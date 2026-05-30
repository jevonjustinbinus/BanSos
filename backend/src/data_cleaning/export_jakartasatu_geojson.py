import requests
import json
import time


BASE_URL = "https://jakartasatu.jakarta.go.id/server/rest/services/Resiko_Bencana/MapServer/3/query"
OUTPUT_PATH = "frontend/public/jakartasatu_resiko_banjir.geojson"


def arcgis_feature_to_geojson(feature):
    attrs = feature.get("attributes", {})
    geom = feature.get("geometry", {})

    rings = geom.get("rings")

    if not rings:
        return None

    return {
        "type": "Feature",
        "properties": attrs,
        "geometry": {
            "type": "Polygon",
            "coordinates": rings
        }
    }


def main():
    all_features = []
    offset = 0
    page_size = 100

    while True:
        params = {
            "where": "1=1",
            "outFields": "*",
            "returnGeometry": "true",
            "outSR": 4326,
            "f": "json",
            "resultOffset": offset,
            "resultRecordCount": page_size
        }

        response = requests.get(BASE_URL, params=params, timeout=60)
        response.raise_for_status()
        data = response.json()

        features = data.get("features", [])

        if not features:
            break

        for feature in features:
            geojson_feature = arcgis_feature_to_geojson(feature)

            if geojson_feature:
                all_features.append(geojson_feature)

        print(f"Fetched {len(features)} features at offset {offset}")

        if len(features) < page_size:
            break

        offset += page_size
        time.sleep(0.3)

    geojson = {
        "type": "FeatureCollection",
        "features": all_features
    }

    with open(OUTPUT_PATH, "w") as f:
        json.dump(geojson, f)

    print(f"Saved {len(all_features)} features to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()