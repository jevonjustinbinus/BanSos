import geopandas as gpd
from shapely.geometry import Point


GEOJSON_PATH = "datasource/raw/jakartasatu_resiko_banjir.geojson"

# Maksimal jarak fallback ke polygon risiko terdekat.
# 5000 meter cukup aman untuk area Jakarta.
# Kalau mau lebih luas, bisa ubah ke 10000.
MAX_FALLBACK_DISTANCE_M = 5000


def load_flood_risk_polygons():
    gdf = gpd.read_file(GEOJSON_PATH)

    # Pastikan CRS lat/lng
    if gdf.crs is None:
        gdf = gdf.set_crs(epsg=4326)
    else:
        gdf = gdf.to_crs(epsg=4326)

    # Standardize column names
    gdf = gdf.rename(
        columns={
            "WADMKD": "kelurahan",
            "WADMKC": "kecamatan",
            "WADMKK": "kota_administrasi",
            "KDEPUM": "kode_kelurahan",
            "KDCPUM": "kode_kecamatan",
            "KDPKAB": "kode_kota",
            "KELAS": "risk_class",
        }
    )

    text_cols = [
        "kelurahan",
        "kecamatan",
        "kota_administrasi",
        "risk_class",
    ]

    for col in text_cols:
        if col in gdf.columns:
            gdf[col] = gdf[col].astype(str).str.upper().str.strip()

    return gdf


def risk_class_to_score(risk_class):
    mapping = {
        "RINGAN": 0.3,
        "SEDANG": 0.6,
        "BERAT": 0.9,
    }

    return mapping.get(str(risk_class).upper().strip(), 0.0)


def _row_to_result(row, lat, lng, is_fallback=False, distance_m=None):
    return {
        "found": True,
        "kelurahan": row.get("kelurahan"),
        "kecamatan": row.get("kecamatan"),
        "kota_administrasi": row.get("kota_administrasi"),
        "kode_kelurahan": row.get("kode_kelurahan"),
        "kode_kecamatan": row.get("kode_kecamatan"),
        "risk_class": row.get("risk_class"),
        "baseline_score": risk_class_to_score(row.get("risk_class")),
        "is_fallback": is_fallback,
        "fallback_distance_m": float(round(distance_m, 2)) if distance_m is not None else None,
        "message": (
            "Exact polygon matched."
            if not is_fallback
            else f"Location is outside flood risk polygon, using nearest polygon within {round(distance_m, 2)} meters."
        ),
        "query_lat": float(lat),
        "query_lng": float(lng),
    }


def find_risk_polygon_by_latlng(lat, lng):
    gdf = load_flood_risk_polygons()

    user_point = Point(lng, lat)  # Point(longitude, latitude)

    # covers lebih aman daripada contains.
    # contains bisa gagal kalau titik berada tepat di boundary polygon.
    matched = gdf[gdf.geometry.covers(user_point)]

    if not matched.empty:
        row = matched.iloc[0]
        return _row_to_result(row, lat, lng, is_fallback=False)

    # Kalau tidak masuk polygon mana pun,
    # cari polygon risiko terdekat sebagai fallback.
    try:
      gdf_meter = gdf.to_crs(epsg=3857)
      point_meter = gpd.GeoSeries([user_point], crs="EPSG:4326").to_crs(epsg=3857).iloc[0]

      distances = gdf_meter.geometry.distance(point_meter)
      nearest_idx = distances.idxmin()
      nearest_distance_m = float(distances.loc[nearest_idx])

      if nearest_distance_m <= MAX_FALLBACK_DISTANCE_M:
          row = gdf.loc[nearest_idx]
          return _row_to_result(
              row,
              lat,
              lng,
              is_fallback=True,
              distance_m=nearest_distance_m,
          )

      return {
          "found": False,
          "message": (
              "User location is outside flood risk polygon layer "
              f"and nearest polygon is too far ({round(nearest_distance_m, 2)} meters)."
          ),
      }

    except Exception as exc:
        return {
            "found": False,
            "message": f"Failed to find nearest flood risk polygon: {str(exc)}",
        }


if __name__ == "__main__":
    test_lat = -6.2702
    test_lng = 106.8722

    result = find_risk_polygon_by_latlng(test_lat, test_lng)

    print(result)