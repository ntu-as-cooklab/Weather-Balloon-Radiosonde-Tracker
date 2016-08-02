from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos
files = [f for f in listdir(getcwd()+'\uploads') if isfile(join(getcwd()+'\uploads', f))]
files = [f for f in files if f.endswith(".txt")]

czml = 'var temp_height_data = [\n'

fileIndex = 0;

for file in files :
    FILE_PATH = getcwd()+'\uploads'+'\%s' % file

    d_x = []
    d_y = []
    with open(FILE_PATH, 'r') as input_stream :
        lines = input_stream.readlines()
      
        for i in range( 4, len(lines)) : #avoid head text

            words = lines[i].split(' ')
            words = [x for x in words if len(x) > 0]
            if (len(words)>15) : #avoid crash data 
                
                d_x.append(words[5])
                d_y.append(words[3])

    input_stream.close()

    czml += (
        '{   label: "%s",\n'
    ) %file
    
    czml += (
        '    x: ['
    )

    for j in range(0, len(d_x)) :
        czml += ('%f' %float(d_x[j]))
        if(j!=len(d_x)-1):
            czml +=(',')
        else:
            czml +=('], \n')
    czml += (
        '    y: ['
    )
    for j in range(0, len(d_y)) :
        czml += ('%f' %float(d_y[j]))
        if(j!=len(d_y)-1):
            czml +=(',')
        else:
            czml +=('] }, \n')
    
    fileIndex += 1

czml += (
    ']\n'
)
    
fout = open(getcwd()+'\\balloon\data'+'\\temp_height_data.js', 'w')
fout.write(czml)
fout.close()
