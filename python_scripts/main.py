import sys

input_file_path = sys.argv[1]
format = sys.argv[2]
f = open('clean_data/test.txt', 'w')
f.write(input_file_path + ' ' + format)
f.close()