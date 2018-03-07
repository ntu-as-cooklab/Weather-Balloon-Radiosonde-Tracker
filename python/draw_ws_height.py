from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos

from setting_utils import timeLimit, heightLimit, input_stream


#-----------
files = [f for f in listdir(join(getcwd(), 'uploads')) if isfile(join(getcwd(), 'uploads', f))]
files = [f for f in files if f.endswith(".txt")]

czml =(
'var ws_height_data = {\n'
'data: [\n'
)

fileIndex = 0

for file in files:

    czml += ('[');

    FILE_PATH = join(getcwd(), 'uploads', str(file))

    data = []
    with open(FILE_PATH, 'r') as input_stream :
        lines = input_stream.readlines()

        for i in range( 4, len(lines)) : #avoid head text

            words = lines[i].split(' ')
            words = [x for x in words if len(x) > 0]
            #---Setting---
            minutes = float(words[0]) + float(words[1])/60
            height = float(words[3])
            if(minutes > timeLimit):
                break
            if(height > heightLimit):
                break
            #-------------
            if (len(words)>15) : #avoid crash data
                data.append([words[9],words[3]])

    input_stream.close()

    for j in range(0, len(data)) :
        czml += ('[ %f, %f], ' %(float(data[j][0]),float(data[j][1])))

        fileIndex += 1

    czml += ('], \n')

czml += (
    '],\n'
    'filename: ['
)

for file in files:
    czml += ('"%s",' %(file))

czml += (
    '],\n'
    'xAxisName: "m/s",\n'
    "yAxisName: 'meter(s)',\n"
    'xMax: 0,\n'
    'yMax: 0,\n'
    'xMin: 1000,\n'
    'yMin: 1000,\n'
    'target: "ws_height",\n'
    'W: 500,\n'
    'H: 800\n'
    '}\n'
)

fout = open(join(getcwd(), 'balloon', 'data', 'ws_height_data.js'), 'w')
fout.write(czml)
fout.close()
