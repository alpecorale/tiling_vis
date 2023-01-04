import json
import sys
import csv


def tile_summary(num,fn,method):
    if method == 'bob':
        tile_list = []
        with open(fn) as f:
            for line in f:
                small_list = []
                for j in line.split(' '):
                    if j != '':
                        small_list.append(j)
                tile_list.append(small_list)
        print(len(tile_list))  
        
    elif method == 'gustavo':
        g_tile_list = []
        with open(fn,'r') as tsvin:
            for line in csv.reader(tsvin, delimiter='\t'):
                g_tile_list.append(line)
        total_count = 0
        for g_tile in g_tile_list:
            total_count+= int(g_tile[1])
        tile_list = []
        for g_tile in g_tile_list:
            temp_tile = []
            temp_tile.append(1)
            temp_tile.append(int(g_tile[1])/total_count)
            temp_locs = g_tile[2].split(':')
            temp_refs = g_tile[3].split(':')
            for i in range(len(temp_locs)):
                temp_str = temp_refs[i][1:]+'['+temp_locs[i]+']'
                if temp_refs[i][0] == '+':
                    temp_str+= '(f)'
                else:
                    temp_str+= '(t)'
                temp_tile.append(temp_str)
            tile_list.append(temp_tile)
    else:
        print("method needed")
                   
    dict_len = {}
    for tile in tile_list:
        if len(tile)-2 in dict_len:
            dict_len[len(tile)-2].append(tile)
        else:
            dict_len[len(tile)-2] = [tile] 
    print(len(dict_len))
    
    new_len = {}
    tf = True
    for key in dict_len.keys():
        for i in dict_len[key]:
            if key not in new_len.keys():
                new_len[key]=[i]
            else:
                for k1 in range(len(new_len[int(key)])):
                    tf = True
                    for j1 in range(int(key)):
                        try:
                            if i[j1+2].split('[')[0] != new_len[key][k1][j1+2].split('[')[0]:
                                tf = False
                            if int(i[j1+2].split('[')[1].split('-')[0]) not in range(int(new_len[key][k1][j1+2].split('[')[1].split('-')[0])-num, int(new_len[key][k1][j1+2].split('[')[1].split('-')[0])+num):
                                tf = False
                            if int(i[j1+2].split('[')[1].split(']')[0].split('-')[1]) not in range(int(new_len[key][k1][j1+2].split('[')[1].split(']')[0].split('-')[1])-num, int(new_len[key][k1][j1+2].split('[')[1].split(']')[0].split('-')[1])+num):
                                tf = False
                        except:
                            tf = False
                            pass
                    if tf == True:
                        new_len[key][k1][0] = int(new_len[key][k1][0])+int(i[0])
                        new_len[key][k1][1] = (int(new_len[key][k1][0])+int(i[0]))/(int(new_len[key][k1][0])/float(new_len[key][k1][1]))
                        break
                if tf == False:
                    new_len[key].append(i)
                    # print(i)
    return new_len


# get variables from cmd line

input_file_path = sys.argv[1].split('/')[1]

format = sys.argv[2]

cluster_amt = sys.argv[3]
# cluster_amt = 5000

# call fxn and write to output
out = tile_summary(cluster_amt,'raw_data/' + input_file_path,format)
clustering_output = json.dumps(out, indent=4)

with open("testout_5000.json", "w") as outfile:
    outfile.write(clustering_output)