import rasterio
from rasterio.plot import show
import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np


def normalize_image(img_data):
    img_data = np.nan_to_num(img_data)

    lower = np.percentile(img_data, 2)
    upper = np.percentile(img_data, 98)

    if upper == lower:
        return np.zeros_like(img_data)

    img_data = np.clip(img_data, lower, upper)
    img_data = (img_data - lower) / (upper - lower)
    return img_data


def visualize_overlay_filled(tiff_path, geojson_path, output_png_path):

    try:
        with rasterio.open(tiff_path) as src:
            img = src.read([1, 2, 3])

            img_display = np.moveaxis(img, 0, -1)
            img_display = normalize_image(img_display)

            extent = [src.bounds.left, src.bounds.right,
                      src.bounds.bottom, src.bounds.top]
            image_crs = src.crs

    except Exception as e:
        print(f"Ошибка TIFF: {e}")
        return

    try:
        gdf = gpd.read_file(geojson_path)

        if not gdf.empty:
            if gdf.crs is None:
                gdf.set_crs(image_crs, inplace=True)
            elif gdf.crs != image_crs:
                gdf = gdf.to_crs(image_crs)
    except Exception as e:
        print(f"Ошибка GeoJSON: {e}")
        return

    fig, ax = plt.subplots(figsize=(15, 15), dpi=150)

    ax.imshow(img_display, extent=extent, origin='upper')

    if not gdf.empty:
        gdf.plot(
            ax=ax,
            color='red',
            alpha=0.35,
            edgecolor='red',
            linewidth=1.5
        )

    ax.set_axis_off()
    plt.title(
        f"Сегментация: {len(gdf)} зон (Красный = PermanentCrop)", fontsize=15)

    plt.savefig(output_png_path, bbox_inches='tight', pad_inches=0.1)
    plt.close()

    print(f"Сохранено: {output_png_path}")


if __name__ == "__main__":
    TIFF_FILE = "sentinel_rgb_10m_5000_voronezh.tif"
    GEOJSON_FILE = "crops_final.geojson"
    OUTPUT_PNG = "sentinel_rgb_10m_5000_voronezh.png"

    visualize_overlay_filled(TIFF_FILE, GEOJSON_FILE, OUTPUT_PNG)
