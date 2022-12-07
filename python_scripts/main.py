import sys
import pandas as pd
import json

input_file_path = sys.argv[1].split('/')[1]

format = sys.argv[2]

if format == 'parham':
    # 'skiprows' skips the header # 'nrows=50' takes only first 50 rows
    # df = pd.read_csv('raw_data/Final_BC_Vectors_PacBio_Annotated_PH_2.csv', nrows=150)
    # df = pd.read_csv('raw_data/' + input_file_path, names = ["ReadID", "Length", "Positions", "String"], skiprows=1, nrows=50)
    df = pd.read_csv('raw_data/' + input_file_path)

    result = df.to_json(orient="records")
    parsed = json.loads(result)
    json_object = json.dumps(parsed, indent=2)

    with open("public/clean_data/" + input_file_path.split('.')[0] + ".json", "w") as outfile:
    # with open("public/clean_data/Final_BC_Vectors_PacBio_Annotated_PH_2.json", "w") as outfile:
        outfile.write(json_object)

elif format == 'gustavo':
    # 'skiprows' skips the header # 'nrows=50' takes only first 50 rows
    # df = pd.read_csv('raw_data/Final_BC_Vectors_PacBio_Annotated_PH_2.csv', nrows=150)
    # df = pd.read_csv('raw_data/' + input_file_path, names = ["ReadID", "Length", "Positions", "String"], skiprows=1, nrows=50)
    df = pd.read_csv('raw_data/' + input_file_path)

    result = df.to_json(orient="records")
    parsed = json.loads(result)
    json_object = json.dumps(parsed, indent=2)

    with open("public/clean_data/" + input_file_path.split('.')[0] + ".json", "w") as outfile:
    # with open("public/clean_data/Final_BC_Vectors_PacBio_Annotated_PH_2.json", "w") as outfile:
        outfile.write(json_object)

elif format == 'bob':
    bobFile = open('raw_data/' + 'og_pac-76.tile.counts', 'r')
    # bobFile = open('raw_data/' + input_file_pat, 'r')
    bobLines = bobFile.readlines()

    # outputFile = open('public/clean_data/' + input_file_path.split('.'[0]) + ".json", "w")
    outputFile = open('public/clean_data/delete.json', "w")
    outputFile.write('[\n')
    lastLine = len(bobLines)-1
    for idline, line in enumerate(bobLines):
        segments = line.split()

        outputFile.write('{"count": ' + segments[0] + ',')
        outputFile.write('"dist": ' + segments[1] + ',')
        
        segments.pop(0) # remove first two items leaving only tiles left
        segments.pop(0)
        
        outputFile.write('"tiles": ')
        tilesStr = ','.join(segments)
        outputFile.write('"' + tilesStr + '"}')

        if idline != lastLine:
            outputFile.write(',')


        

    outputFile.write(']')
    outputFile.close()


