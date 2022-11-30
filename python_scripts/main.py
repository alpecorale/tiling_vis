import sys
import pandas as pd
import json

input_file_path = sys.argv[1].split('/')[1]

format = sys.argv[2]
# 'skiprows' skips the header # 'nrows=50' takes only first 50 rows
df = pd.read_csv('raw_data/small.csv', names = ["ReadID", "Length", "Positions", "String"], skiprows=1)
# df = pd.read_csv('raw_data/' + input_file_path, names = ["ReadID", "Length", "Positions", "String"])

result = df.to_json(orient="records")
parsed = json.loads(result)
json_object = json.dumps(parsed, indent=2)

with open("public/clean_data/" + input_file_path.split('.')[0] + ".json", "w") as outfile:
    outfile.write(json_object)
