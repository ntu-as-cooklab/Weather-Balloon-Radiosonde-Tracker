from os import getcwd
from os.path import join


#---Setting---
timeLimit = 0
heightLimit = 0
SETTING_FILE_PATH = join(getcwd(), 'setting', 'setting.txt')

with open(SETTING_FILE_PATH, 'r') as input_stream :
    lines = input_stream.readlines()
    option = lines[0].split(',')
    timeLimit = float(option[0])
    heightLimit = float(option[1])

input_stream.close()
