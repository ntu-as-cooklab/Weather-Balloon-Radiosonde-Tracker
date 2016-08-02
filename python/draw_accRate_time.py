from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos
files = [f for f in listdir(getcwd()+'\uploads') if isfile(join(getcwd()+'\uploads', f))]
files = [f for f in files if f.endswith(".txt")]

czml = 'rate	time	name\n'

fileIndex = 0;

for file in files :
    FILE_PATH = getcwd()+'\uploads'+'\%s' % file

    d_x = []
    d_y = []
    with open(FILE_PATH, 'r') as input_stream :
        
        lines = input_stream.readlines()
        
        words = lines[4].split(' ')
        words = [x for x in words if len(x) > 0]
        front_height = int(words[3])
        
        words = lines[5].split(' ')
        words = [x for x in words if len(x) > 0]
        back_height = int(words[3])
        front_vel = back_height-front_height
        front_height = back_height
        
        
        for i in range( 6, len(lines)) : #avoid head text
            words = lines[i].split(' ')
            words = [x for x in words if len(x) > 0]
            if (len(words)>15) : #avoid crash data 
                back_height = int(words[3])
                back_vel = back_height-front_height
                acc = back_vel - front_vel
                d_x.append(i)
                d_y.append(acc)
                front_height = back_height
                front_vel = back_vel
                
    input_stream.close()

    for j in range(0, len(d_x)) :
        czml += ('%d	%d	%s\n' %(d_y[j], d_x[j], file))

    
    fileIndex += 1

    
fout = open(getcwd()+'\\balloon\data'+'\\accRate_time_data.tsv', 'w')
fout.write(czml)
fout.close()
