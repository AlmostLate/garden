import geopandas as gpd
import warnings

warnings.filterwarnings("ignore")


def process_smart_merge(input_geojson, output_geojson, proximity_meters=15, min_area_sq_m=500):

    print(f"1. Чтение файла: {input_geojson}")
    try:
        gdf = gpd.read_file(input_geojson)
    except Exception as e:
        print(f"Ошибка: {e}")
        return

    if gdf.empty:
        print("Файл пуст.")
        return

    original_crs = gdf.crs

    if gdf.crs.is_geographic:
        utm_crs = gdf.estimate_utm_crs()
        print(f"   Перевод в UTM зону: {utm_crs.name}")
        gdf = gdf.to_crs(utm_crs)
    else:
        utm_crs = gdf.crs

    print(f"2. Объединение соседей в радиусе {proximity_meters}м...")

    buffered_geometries = gdf.buffer(proximity_meters, join_style=2)

    merged_geom = buffered_geometries.unary_union

    final_geom = merged_geom.buffer(-proximity_meters, join_style=2)

    merged_gdf = gpd.GeoDataFrame(geometry=[final_geom], crs=utm_crs)
    exploded_gdf = merged_gdf.explode(index_parts=False).reset_index(drop=True)

    exploded_gdf['area'] = exploded_gdf.geometry.area
    final_gdf = exploded_gdf[exploded_gdf['area'] >= min_area_sq_m].copy()
    final_gdf['class'] = 'PermanentCrop'

    final_gdf['geometry'] = final_gdf.geometry.simplify(
        tolerance=2, preserve_topology=True)

    print(f"   Было полигонов (исходно): {len(gdf)}")
    print(f"   Стало полигонов (итого): {len(final_gdf)}")

    if original_crs is not None:
        final_gdf = final_gdf.to_crs(original_crs)

    final_gdf = final_gdf.drop(columns=['area'])

    final_gdf.to_file(output_geojson, driver='GeoJSON')
    print(f" Сохранено: {output_geojson}")


if __name__ == "__main__":
    INPUT = "crops_final_no_borders.geojson"
    OUTPUT = "crops_final.geojson"

    process_smart_merge(INPUT, OUTPUT, proximity_meters=300,
                        min_area_sq_m=80_000)
