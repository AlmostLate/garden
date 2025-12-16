from PIL import Image
import ee
import geemap.core as geemap
from geemap import ee_export_image
import os


def mask_s2_clouds(image):
    """Masks clouds in a Sentinel-2 image using the QA band.

    Args:
        image (ee.Image): A Sentinel-2 image.

    Returns:
        ee.Image: A cloud-masked Sentinel-2 image.
    """
    qa = image.select('QA60')

    # Bits 10 and 11 are clouds and cirrus, respectively.
    cloud_bit_mask = 1 << 10
    cirrus_bit_mask = 1 << 11

    # Both flags should be set to zero, indicating clear conditions.
    mask = (
        qa.bitwiseAnd(cloud_bit_mask)
        .eq(0)
        .And(qa.bitwiseAnd(cirrus_bit_mask).eq(0))
    )

    return image.updateMask(mask).divide(10000)


ee.Authenticate()
ee.Initialize(project='garden-481316')

dataset = (
    ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate('2020-06-01', '2020-06-30')
    # Pre-filter to get less cloudy granules.
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(mask_s2_clouds)
)

visualization = {
    'min': 0.0,
    'max': 0.3,
    'bands': ['B4', 'B3', 'B2'],
}

m = geemap.Map()
m.set_center(39.476002, 51.715833, 12)
m.add_layer(dataset.mean(), visualization, 'RGB')

center_point = ee.Geometry.Point([39.476002, 51.715833,])
region = center_point.buffer(5_000).bounds()


image = dataset.mean()
rgb_image = image.visualize(**visualization)

output_file = "sentinel_rgb_10m_5000_voronezh.tif"

try:
    ee_export_image(
        rgb_image,
        filename=output_file,
        scale=10,
        region=region,
        file_per_band=False,
    )
    print(f"Успешно сохранено: {os.path.abspath(output_file)}")
except Exception as e:
    print("Ошибка при скачивании:", e)


def tif_to_jpg(tif_path, jpg_path=None, quality=95):
    Image.MAX_IMAGE_PIXELS = None

    if jpg_path is None:
        jpg_path = os.path.splitext(tif_path)[0] + ".jpg"

    try:
        with Image.open(tif_path) as img:
            print(
                f"Открыт файл: {tif_path}, Размер: {img.size}, Режим: {img.mode}")

            rgb_im = img.convert('RGB')

            rgb_im.save(jpg_path, 'JPEG', quality=quality)
            print(f"Успешно сохранено: {jpg_path}")
            return jpg_path

    except Exception as e:
        print(f"Ошибка при конвертации: {e}")
        return None
