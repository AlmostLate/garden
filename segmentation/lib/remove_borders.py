import geopandas as gpd
import rasterio
import matplotlib.pyplot as plt


def remove_border_polygons(input_geojson, tiff_path, output_geojson, margin_pixels=10):
    try:
        gdf = gpd.read_file(input_geojson)
    except Exception as e:
        print(f"Ошибка чтения GeoJSON: {e}")
        return

    if gdf.empty:
        print("GeoJSON пуст.")
        return

    try:
        with rasterio.open(tiff_path) as src:
            img_bounds = src.bounds
            img_crs = src.crs
            res_x, res_y = src.res
            print(f"   Границы снимка: {img_bounds}")
            print(f"   Разрешение: {res_x}x{res_y} м/пикс")
    except Exception as e:
        print(f"Ошибка чтения TIFF: {e}")
        return

    original_crs = gdf.crs

    if gdf.crs != img_crs:
        print("   Приведение GeoJSON к системе координат снимка...")
        gdf = gdf.to_crs(img_crs)

    margin_x = margin_pixels * res_x
    margin_y = margin_pixels * res_y

    safe_left = img_bounds.left + margin_x
    safe_right = img_bounds.right - margin_x
    safe_bottom = img_bounds.bottom + margin_y
    safe_top = img_bounds.top - margin_y

    poly_bounds = gdf.bounds

    mask_touching_edge = (
        (poly_bounds['minx'] < safe_left) |
        (poly_bounds['maxx'] > safe_right) |
        (poly_bounds['miny'] < safe_bottom) |
        (poly_bounds['maxy'] > safe_top)
    )

    clean_gdf = gdf[~mask_touching_edge].copy()

    original_count = len(gdf)
    clean_count = len(clean_gdf)
    removed = original_count - clean_count

    print(f"   Было полигонов: {original_count}")
    print(f"   Удалено на краях: {removed}")
    print(f"   Осталось: {clean_count}")

    if original_crs is not None and original_crs != clean_gdf.crs:
        clean_gdf = clean_gdf.to_crs(original_crs)

    if not clean_gdf.empty:
        clean_gdf.to_file(output_geojson, driver='GeoJSON')
        print(f"Сохранено в: {output_geojson}")
    else:
        print("Внимание: Все полигоны были удалены (возможно, слишком большой отступ?)")


if __name__ == "__main__":
    INPUT_FILE = "crops_smart_merged_voronezh.geojson"

    TIFF_FILE = "sentinel_rgb_10m_5000_voronezh.tif"

    OUTPUT_FILE = "crops_final_no_borders.geojson"

    remove_border_polygons(INPUT_FILE, TIFF_FILE,
                           OUTPUT_FILE, margin_pixels=15)
