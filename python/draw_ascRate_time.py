from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos

from setting_utils import timeLimit, heightLimit, input_stream


files = [f for f in listdir(join(getcwd(), 'uploads')) if isfile(join(getcwd(), 'uploads', f))]
files = [f for f in files if f.endswith(".txt")]

czml =(
    'var ascRate_time_data = {\n'
    'data: [\n'
)

fileIndex = 0;

for file in files :

    czml += ('[');

    FILE_PATH = join(getcwd(), 'uploads', str(file))

    data = []
    with open(FILE_PATH, 'r') as input_stream :

        lines = input_stream.readlines()
        words = lines[4].split(' ')
        words = [x for x in words if len(x) > 0]
        front_height = int(words[3])

        for i in range( 5, len(lines)) : #avoid head text
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
                back_height = int(words[3])
                rate = back_height-front_height
                data.append([ minutes, rate])
                front_height = back_height

    input_stream.close()

    for j in range(0, len(data)) :
        czml += ('[ %f, %d], ' %(data[j][0],data[j][1]))

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
    'xAxisName: "minute(s)",\n'
    "yAxisName: 'm/s',\n"
    'xMax: 0,\n'
    'yMax: 0,\n'
    'xMin: 1000,\n'
    'yMin: 1000,\n'
    'target: "ascRate_time",\n'
    'W: 800,\n'
    'H: 400\n'
    '}\n'
)

fout = open(join(getcwd(), 'balloon', 'data', 'ascRate_time_data.js'), 'w')
fout.write(czml)
fout.close()
