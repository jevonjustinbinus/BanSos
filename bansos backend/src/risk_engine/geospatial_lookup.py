import geopandas as gpd
from shapely.geometry import Point


GEOJSON_PATH = "datasource/raw/jakartasatu_resiko_banjir.geojson"


def load_flood_risk_polygons():
    gdf = gpd.read_file(GEOJSON_PATH)

    # Pastikan CRS lat/lng
    if gdf.crs is None:
        gdf = gdf.set_crs(epsg=4326)
    else:
        gdf = gdf.to_crs(epsg=4326)

    # Standardize column names
    gdf = gdf.rename(columns={
        "WADMKD": "kelurahan",
        "WADMKC": "kecamatan",
        "WADMKK": "kota_administrasi",
        "KDEPUM": "kode_kelurahan",
        "KDCPUM": "kode_kecamatan",
        "KDPKAB": "kode_kota",
        "KELAS": "risk_class"
    })

    text_cols = [
        "kelurahan",
        "kecamatan",
        "kota_administrasi",
        "risk_class"
    ]

    for col in text_cols:
        if col in gdf.columns:
            gdf[col] = gdf[col].astype(str).str.upper().str.strip()

    return gdf


def risk_class_to_score(risk_class):
    mapping = {
        "RINGAN": 0.3,
        "SEDANG": 0.6,
        "BERAT": 0.9
    }

    return mapping.get(str(risk_class).upper().strip(), 0.0)


def find_risk_polygon_by_latlng(lat, lng):
    gdf = load_flood_risk_polygons()

    user_point = Point(lng, lat)  # important: Point(longitude, latitude)

    matched = gdf[gdf.contains(user_point)]

    if matched.empty:
        return {
            "found": False,
            "message": "User location is outside flood risk polygon layer."
        }

    row = matched.iloc[0]

    return {
        "found": True,
        "kelurahan": row.get("kelurahan"),
        "kecamatan": row.get("kecamatan"),
        "kota_administrasi": row.get("kota_administrasi"),
        "kode_kelurahan": row.get("kode_kelurahan"),
        "kode_kecamatan": row.get("kode_kecamatan"),
        "risk_class": row.get("risk_class"),
        "baseline_score": risk_class_to_score(row.get("risk_class"))
    }


if __name__ == "__main__":
    # Contoh koordinat Jakarta
    test_lat = -6.200000
    test_lng = 106.816666

    result = find_risk_polygon_by_latlng(test_lat, test_lng)

    print(result)