import os
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
import segmentation_models_pytorch as smp
import albumentations as A
from albumentations.pytorch import ToTensorV2
from sklearn.model_selection import train_test_split
import glob

DATA_DIR = '/Users/dborovinsky/Downloads/EuroSAT_RGB'
CLASSES = ['AnnualCrop', 'Forest', 'HerbaceousVegetation', 'Highway', 'Industrial',
           'Pasture', 'PermanentCrop', 'Residential', 'River', 'SeaLake']
TARGET_CLASS = 'PermanentCrop'
img_size = 256
BATCH_SIZE = 16
EPOCHS = 15

if torch.backends.mps.is_available():
    device = 'mps'
elif torch.cuda.is_available():
    device = 'cuda'
else:
    device = 'cpu'


class SentinelDataset(Dataset):
    def __init__(self, image_paths, transform=None):
        self.image_paths = image_paths
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        image = cv2.imread(img_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        parent_folder = os.path.basename(os.path.dirname(img_path))

        h, w, _ = image.shape
        if parent_folder == TARGET_CLASS:
            mask = np.ones((h, w), dtype=np.float32)
        else:
            mask = np.zeros((h, w), dtype=np.float32)

        mask = np.expand_dims(mask, axis=-1)

        if self.transform:
            augmented = self.transform(image=image, mask=mask)
            image = augmented['image']
            mask = augmented['mask']
        else:
            t = ToTensorV2()
            augmented = t(image=image, mask=mask)
            image = augmented['image']
            mask = augmented['mask']

        return image, mask.float()


train_transform = A.Compose([
    A.Resize(img_size, img_size),
    A.HorizontalFlip(p=0.5),
    A.VerticalFlip(p=0.5),
    A.RandomRotate90(p=0.5),
    A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
    ToTensorV2()
])

val_transform = A.Compose([
    A.Resize(img_size, img_size),
    A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
    ToTensorV2()
])

if __name__ == '__main__':
    from multiprocessing import freeze_support
    import random
    freeze_support()

    os.makedirs('checkpoints', exist_ok=True)
    os.makedirs('debug_images', exist_ok=True)

    crop_images = []
    other_images = []

    if not os.path.exists(DATA_DIR):
        print(f"Ошибка: Путь {DATA_DIR} не найден.")
        exit()

    for cat in CLASSES:
        search_path = os.path.join(DATA_DIR, cat, '*.jpg')
        imgs = glob.glob(search_path)

        if cat == TARGET_CLASS:
            crop_images.extend(imgs)
        else:
            other_images.extend(imgs)

    if len(other_images) > len(crop_images):
        random.shuffle(other_images)
        other_images_balanced = other_images[:len(crop_images)]
    else:
        other_images_balanced = other_images

    balanced_images = crop_images + other_images_balanced
    random.shuffle(balanced_images)

    train_imgs, val_imgs = train_test_split(
        balanced_images, test_size=0.2, random_state=42, shuffle=True)

    train_dataset = SentinelDataset(train_imgs, transform=train_transform)
    val_dataset = SentinelDataset(val_imgs, transform=val_transform)

    train_loader = DataLoader(
        train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
    val_loader = DataLoader(
        val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

    model = smp.Unet(
        encoder_name="resnet34",
        encoder_weights="imagenet",
        in_channels=3,
        classes=1,
        activation=None
    )

    model.to(device)
    loss_fn = smp.losses.DiceLoss(smp.losses.BINARY_MODE, from_logits=True)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

    best_val_loss = float('inf')

    for epoch in range(EPOCHS):
        model.train()
        train_loss = 0

        for images, masks in train_loader:
            images, masks = images.to(device), masks.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = loss_fn(outputs, masks)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()

        avg_train_loss = train_loss / len(train_loader)

        model.eval()
        val_loss = 0
        with torch.no_grad():
            for images, masks in val_loader:
                images, masks = images.to(device), masks.to(device)
                outputs = model(images)
                loss = loss_fn(outputs, masks)
                val_loss += loss.item()

        avg_val_loss = val_loss / len(val_loader)

        print(
            f"Epoch {epoch+1}/{EPOCHS} | Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f}")

        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            torch.save(model.state_dict(), 'checkpoints/best_model.pth')
            print(f"--> Новый лучший результат! Сохранено в best_model.pth")

        torch.save(model.state_dict(),
                   f'checkpoints/model_epoch_{epoch+1}.pth')

        with torch.no_grad():
            test_imgs, test_masks = next(iter(val_loader))
            test_imgs = test_imgs.to(device)

            pred_logits = model(test_imgs)
            pred_mask = (torch.sigmoid(pred_logits) > 0.5).float()

            img_vis = test_imgs[0].cpu().permute(1, 2, 0).numpy()
            mean = np.array([0.485, 0.456, 0.406])
            std = np.array([0.229, 0.224, 0.225])
            img_vis = std * img_vis + mean
            img_vis = np.clip(img_vis, 0, 1) * 255
            img_vis = cv2.cvtColor(img_vis.astype(np.uint8), cv2.COLOR_RGB2BGR)

            true_mask_vis = test_masks[0].cpu().numpy().squeeze() * 255
            pred_mask_vis = pred_mask[0].cpu().numpy().squeeze() * 255

            true_mask_vis = cv2.cvtColor(
                true_mask_vis.astype(np.uint8), cv2.COLOR_GRAY2BGR)
            pred_mask_vis = cv2.cvtColor(
                pred_mask_vis.astype(np.uint8), cv2.COLOR_GRAY2BGR)

            combined = np.hstack([img_vis, true_mask_vis, pred_mask_vis])
            cv2.imwrite(f'debug_images/epoch_{epoch+1}.jpg', combined)
