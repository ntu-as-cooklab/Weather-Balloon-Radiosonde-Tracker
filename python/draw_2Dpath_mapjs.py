from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos

from setting_utils import timeLimit, heightLimit, input_stream


files = [f for f in listdir(join(getcwd(), 'uploads')) if isfile(join(getcwd(), 'uploads', f))]
files = [f for f in files if f.endswith(".txt")]

rgbColor = ['255, 0, 0','51, 204, 51','0, 153, 255','255, 255, 0','204, 0, 153','51, 51, 0','255, 0, 102','200, 200, 200','0, 51, 102','255, 153, 255']

czml = '$(document).ready(function(){\n'

colorIndex = 0;
fileIndex = 0;

for file in files :
    FILE_PATH = join(getcwd(), 'uploads', str(file))

    data = []
    with open(FILE_PATH, 'r') as input_stream :
        lines = input_stream.readlines()

        words = lines[4].split(' ')
        words = [x for x in words if len(x) > 0]
        lat = float(words[11])
        lon = float(words[12])
        _hieght = 0
        data.append([lon, lat, _hieght])

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
                dir_degree = 3.1415926*(float(words[8])+180)/180
                speed = float(words[9])
                u = cos(dir_degree)*speed
                v = sin(dir_degree)*speed
                lat += u/110736
                lon += v/102189
                data.append([lon, lat, _hieght])

    input_stream.close()

    czml += (
        'var line_points_%d = [\n'
    ) %fileIndex

    for j in range(0, len(data)) :
        czml += ('[%f,%f]' %(float(data[j][1]), float(data[j][0]))) #lat lon
        if(j!=len(data)-1):
            czml +=(',\n')
        else:
            czml +=('\n')

    czml += (
    '];\n'
    'var polyline_options_%d = {\n'
    '    color: "rgb(%s)"\n'
    '};\n'
    'var polyline = L.polyline(line_points_%d, polyline_options_%d).addTo(map);\n'
    ) % (fileIndex, rgbColor[colorIndex%10], fileIndex, fileIndex)

    colorIndex += 1
    fileIndex += 1

czml += (
    'map.fitBounds(line_points_0);\n'
    '})'
)

fout = open(join(getcwd(), 'balloon', 'data', '2dpath.js'), 'w')
fout.write(czml)
fout.close()
