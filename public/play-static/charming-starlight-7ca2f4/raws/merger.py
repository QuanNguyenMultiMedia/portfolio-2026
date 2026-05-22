import geopandas as gpd
import pandas as pd

gdf = gpd.read_file("vietnam.geojson")
df = pd.read_csv("data.csv")

# Normalize names for matching
gdf["name_clean"] = gdf["name"].str.strip().str.lower()
df["province_clean"] = df["Province"].str.strip().str.lower()  # Adjust column name

# Merge
merged = gdf.merge(df, left_on="name_clean", right_on="province_clean")

# Save
merged.to_file("vietnam_forest.geojson", driver="GeoJSON")
