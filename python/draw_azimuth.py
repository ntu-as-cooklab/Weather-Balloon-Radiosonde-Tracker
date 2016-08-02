from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos, atan, hypot
files = [f for f in listdir(getcwd()+'\uploads') if isfile(join(getcwd()+'\uploads', f))]
files = [f for f in files if f.endswith(".txt")]

rgbColor = ['255, 0, 0','51, 204, 51','0, 153, 255','255, 255, 0','204, 0, 153','51, 51, 0','255, 0, 102','200, 200, 200','0, 51, 102','255, 153, 255']

czml = '$("#azimuth").empty();\n'

colorIndex = 0;
fileIndex = 0;

for file in files :
    FILE_PATH = getcwd()+'\uploads'+'\%s' % file

    data = []
    with open(FILE_PATH, 'r') as input_stream :
        lines = input_stream.readlines()
        
        words = lines[4].split(' ')
        words = [x for x in words if len(x) > 0]  
        posX = 0
        posY = 0
        data.append([0, 0])
        for i in range( 4, len(lines)) : #avoid head text

            words = lines[i].split(' ')
            words = [x for x in words if len(x) > 0]
            if (len(words)>15) : #avoid crash data 
                dir_degree = 3.1415926*(float(words[8])+180)/180
                speed = float(words[9])         
                u = cos(dir_degree)*speed
                v = sin(dir_degree)*speed
                posX += u/1000 
                posY += v/1000
                azimuth = 0
                if(posX>0 and posY>0):
                    azimuth = (atan(posY/posX) * 180/3.1415926)
                elif(posX>0 and posY<0):
                    azimuth = (atan(posY/posX) * 180/3.1415926)
                elif(posX<0 and posY>0):
                    azimuth = 180+(atan(posY/posX) * 180/3.1415926)
                elif(posX<0 and posY<0):
                    azimuth = 180+(atan(posY/posX) * 180/3.1415926)  
                distance = hypot(posX, posY)
                data.append( [azimuth, distance])

    input_stream.close()

    czml += (
        'var trace%d = {\n'
        '  t: [\n'
    ) %fileIndex

    for j in range(0, len(data),10) : #azimuth
        czml += ('%f' %float(data[j][0])) 
        if(j!=len(data)-1):
            czml +=(',')
    
    czml += (
        '],\n'
        '  r: [\n'
    )
    
    for j in range(0, len(data),10) : #distance
        czml += ('%f' %float(data[j][1])) 
        if(j!=len(data)-1):
            czml +=(',')
            
    czml += (
    '],\n'
    '  mode: "lines",\n'
    '  name: "%s",\n'
    '  marker: {\n'
    '    color: "none",\n'
    '    line: { width: 5,  color: "rgb(%s)"}\n'
    '  },\n'
    '  type: "scatter"\n'
    '};\n'
    ) % (file, rgbColor[colorIndex%10])
    
    colorIndex += 1
    fileIndex += 1
#---------------special case-----------  
if(fileIndex<1):
    czml += (
      "  var trace0 = {\n"
      "  r: [0],t:[0], mode: 'lines',\n"
      "  name: ' ',\n"
      " marker: {\n"
      "     color: 'none',\n"
      "     line: {color: 'white'}\n"
      "  },\n"
      "  type: 'scatter'\n"
      "  };\n"
      "  var trace1 = {\n"
      "  r: [0],t:[0], mode: 'lines',\n"
      "  name: ' ',\n"
      " marker: {\n"
      "     color: 'none',\n"
      "     line: {color: 'white'}\n"
      "  },\n"
      "  type: 'scatter'\n"
      "  };\n"
    )
    fileIndex += 1
if(fileIndex<2):
    czml += (
      "  var trace1 = {\n"
      "  r: [0],t:[0], mode: 'lines',\n"
      "  name: ' ',\n"
      " marker: {\n"
      "     color: 'none',\n"
      "     line: {color: 'white'}\n"
      "  },\n"
      "  type: 'scatter'\n"
      "  };\n"
      "  var trace1 = {\n"
      "  r: [0],t:[0], mode: 'lines',\n"
      "  name: ' ',\n"
      " marker: {\n"
      "     color: 'none',\n"
      "     line: {color: 'white'}\n"
      "  },\n"
      "  type: 'scatter'\n"
      "  };\n"
    )
    fileIndex += 1
if(fileIndex<3):
    czml += (
      "  var trace2 = {\n"
      "  r: [0],t:[0], mode: 'lines',\n"
      "  name: ' ',\n"
      " marker: {\n"
      "     color: 'none',\n"
      "     line: {color: 'white'}\n"
      "  },\n"
      "  type: 'scatter'\n"
      "  };\n"
    )
    fileIndex += 1
#--------------------------------------------    
czml += (
'var data = ['
)
for j in range(0, fileIndex) :
    czml += ('trace%d' %j) 
    if(j!=fileIndex-1):
        czml +=(', ')
          
czml += (
'];\n'
'var layout = {\n'
'  title: "Radius Unit : km",\n'
'  font: {\n'
'    family: "sans-serif",\n'
'    size: 14,\n'
'    color: "#000"\n'
'  },\n'
'  showlegend: true,\n'
'  width: 800,\n'
'  height: 800,\n'
'  margin: {\n'
'    l: 30,\n'
'    r: 40,\n'
'    b: 20,\n'
'    t: 40,\n'
'    pad: 0\n'
'  },\n'
'  paper_bgcolor: "rgb(255, 255, 255)",\n'
'  plot_bgcolor: "rgb(255, 255, 255)",\n'
'  orientation: -90\n'
'};\n'
'Plotly.plot("azimuth", data, layout)\n'
)
    
fout = open(getcwd()+'\\balloon\data'+'\\azimuth.js', 'w')
fout.write(czml)
fout.close()
