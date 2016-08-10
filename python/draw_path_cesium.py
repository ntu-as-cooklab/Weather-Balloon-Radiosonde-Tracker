from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos
#---Setting---
timeLimit = 0
heightLimit = 0
SETTING_FILE_PATH = getcwd()+'\setting\setting.txt'
with open(SETTING_FILE_PATH, 'r') as input_stream :
    lines = input_stream.readlines()
    option = lines[0].split(',')
    timeLimit = float(option[0])
    heightLimit = float(option[1])
input_stream.close()
#-----------
files = [f for f in listdir(getcwd()+'\uploads') if isfile(join(getcwd()+'\uploads', f))]
files = [f for f in files if f.endswith(".txt")]

rgbaColor = ['[255, 0, 0,200]','[51, 204, 51,200]','[0, 153, 255,200]','[255, 255, 0,200]','[204, 0, 153,200]','[51, 51, 0,200]','[255, 0, 102,200]','[200, 200, 200,200]','[0, 51, 102,200]','[255, 153, 255,200]'
]

czml = (
'[{\n'
'    "id" : "document",\n'
'    "name" : "CZML Wall",\n'
'    "version" : "1.0"\n'
'}\n'
)

colorIndex = 0;

for file in files :
    FILE_PATH = getcwd()+'\uploads'+'\%s' % file

    data = []
    with open(FILE_PATH, 'r') as input_stream :
        lines = input_stream.readlines()

        words = lines[4].split(' ')
        words = [x for x in words if len(x) > 0]
        lat = float(words[11])
        lon = float(words[12])
        hieght = int(words[3])
        data.append([lon, lat, hieght])

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
                hieght = int(words[3])
                data.append([lon, lat, hieght])

    input_stream.close()

    czml += (
    ',{\n'
    '"id" : "%s",\n'
    '"wall" : {\n'
    '    "positions" : {\n'
    '        "cartographicDegrees" : [\n'
    ) % file

    for j in range(0, len(data)) :
        czml += ('%f,%f,%d,\n' %(float(data[j][0]), float(data[j][1]), int(data[j][2])))
    #coordinates no space allowed

    czml += (
        '            ]\n'
        '        },\n'
        '        "material" : {\n'
        '            "solidColor" : {\n'
        '                "color" : {\n'
        '                    "rgba" : %s \n'
        '                }\n'
        '            }\n'
        '        }\n'
        '    }\n'
        '}\n'
    ) % rgbaColor[colorIndex%10]

    colorIndex += 1

czml += (
']\n'
)

fout = open(getcwd()+'\\balloon\data'+'\\3dpath.txt', 'w')
fout.write(czml)
fout.close()
