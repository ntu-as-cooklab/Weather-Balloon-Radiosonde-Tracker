from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos
files = [f for f in listdir(getcwd()+'\uploads') if isfile(join(getcwd()+'\uploads', f))]
files = [f for f in files if f.endswith(".txt")]

czml =(
'var wd_height_data = {\n'
'data: [\n'
)

fileIndex = 0

for file in files:

    czml += ('[');

    FILE_PATH = getcwd()+'\uploads'+'\%s' % file

    data = []
    with open(FILE_PATH, 'r') as input_stream :
        lines = input_stream.readlines()

        for i in range( 4, len(lines)) : #avoid head text

            words = lines[i].split(' ')
            words = [x for x in words if len(x) > 0]
            if (len(words)>15) : #avoid crash data
                data.append([words[8],words[3]])

    input_stream.close()

    for j in range(0, len(data)) :
        czml += ('[ %f, %f], ' %(float(data[j][0]),float(data[j][1])))
        #if(j!=len(data)-1):
        #    czml += (' ,')

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
    'xAxisName: "Deg",\n'
    "yAxisName: 'meter(s)',\n"
    'xMax: 360,\n'
    'yMax: 0,\n'
    'xMin: 0,\n'
    'yMin: 1000,\n'
    'target: "wd_height",\n'
    'W: 500,\n'
    'H: 800\n'
    '}\n'
)

fout = open(getcwd()+'\\balloon\data'+'\\wd_height_data.js', 'w')
fout.write(czml)
fout.close()
