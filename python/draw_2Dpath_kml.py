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

kmlColor = ['ff0000ff','ff33cc33','ffff9900','ff00ffff','ff9900cc','ff003333','ff6600ff','ffc8c8c8','ff663300','ffff99ff']

czml = (
'<?xml version="1.0" encoding="UTF-8"?>\n'
'<kml xmlns="http://earth.google.com/kml/2.1">\n'
'  <Document>\n'
'    <name>2D path</name>\n'
'    <description>Balloon 2D Path Tracker</description>\n'
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
                _hieght = 0
                data.append([lon, lat, _hieght])

    input_stream.close()

    czml += (
    '<Style id="%s" >\n'
    '  <LineStyle>\n'
    '    <color>%s</color>\n'
    '    <width>4</width>\n'
    '  </LineStyle>\n'
    '</Style>\n'
    '<Placemark>\n'
    '  <name>%s</name>\n'
    '  <styleUrl>#%s</styleUrl>\n'
    '  <LineString>\n'
    '    <altitudeMode>relative</altitudeMode>\n'
    '    <coordinates>\n'
    ) %(file, kmlColor[colorIndex%10], file, file)

    for j in range(0, len(data)) :
        czml += ('%f,%f,%d\n' %(float(data[j][0]), float(data[j][1]), int(data[j][2])))
    #coordinates no space allowed

    czml += (
    '        </coordinates>\n'
    '  </LineString>\n'
    '</Placemark>\n'
    )

    colorIndex += 1

czml += (
'  </Document>\n'
'</kml>\n'
)

fout = open(getcwd()+'\\balloon\data'+'\\2dpath.kml', 'w')
fout.write(czml)
fout.close()
