import rasterio
from rasterio.windows import Window
from rasterio.features import shapes
import geopandas as gpd
import cv2
import numpy as np
import torch
import segmentation_models_pytorch as smp
import albumentations as A
from albumentations.pytorch import ToTensorV2


def predict_large_image(model_path, large_image_path, output_geojson_path, patch_size=64, stride=35):

    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    model = smp.Unet(encoder_name="resnet34", classes=1,
                     activation='sigmoid')
    model.load_state_dict(torch.load(model_path))
    model.to(device)
    model.eval()

    preprocess = A.Compose([
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ToTensorV2()
    ])

    with rasterio.open(large_image_path) as src:
        h, w = src.height, src.width
        profile = src.profile
        transform = src.transform

        full_mask = np.zeros((h, w), dtype=np.float32)

        count_mask = np.zeros((h, w), dtype=np.float32)

        for y in range(0, h, stride):
            for x in range(0, w, stride):
                y_end = min(y + patch_size, h)
                x_end = min(x + patch_size, w)

                win_h = y_end - y
                win_w = x_end - x

                window_data = src.read(window=Window(x, y, win_w, win_h))

                img_patch = window_data.transpose(1, 2, 0)

                if img_patch.shape[2] > 3:
                    img_patch = img_patch[:, :, :3]

                pad_y = patch_size - win_h
                pad_x = patch_size - win_w

                if pad_x > 0 or pad_y > 0:
                    img_patch = cv2.copyMakeBorder(
                        img_patch, 0, pad_y, 0, pad_x, cv2.BORDER_REFLECT)

                augmented = preprocess(image=img_patch)
                input_tensor = augmented['image'].unsqueeze(0).to(device)

                with torch.no_grad():
                    prediction = model(input_tensor)
                    prediction = prediction.squeeze().cpu().numpy()

                valid_pred = prediction[:win_h, :win_w]

                full_mask[y:y_end, x:x_end] += valid_pred
                count_mask[y:y_end, x:x_end] += 1

        final_probability = full_mask / np.maximum(count_mask, 1)

        binary_mask = (final_probability > 0.9995).astype(np.uint8)

        results = (
            {'properties': {'class': 'PermanentCrop'}, 'geometry': s}
            for i, (s, v)
            in enumerate(shapes(binary_mask, mask=binary_mask, transform=transform))
        )

        geoms = list(results)
        if len(geoms) > 0:
            gdf = gpd.GeoDataFrame.from_features(geoms)
            if src.crs:
                gdf.crs = src.crs

            gdf.to_file(output_geojson_path, driver='GeoJSON')
            print(f" Сохранено в {output_geojson_path}")
        else:
            print("Не найдено объектов класса PermanentCrop.")


large_image_path = "sentinel_rgb_10m_5000_voronezh.tif"
predict_large_image('best_model.pth',
                    large_image_path, 'output_crops_voronezh.geojson')
