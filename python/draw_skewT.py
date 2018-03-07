from os import listdir, getcwd
from os.path import isfile, join
from math import sin, cos

from setting_utils import timeLimit, heightLimit, input_stream


files = [f for f in listdir(join(getcwd(), 'uploads')) if isfile(join(getcwd(), 'uploads', f))]
files = [f for f in files if f.endswith(".txt")]

fileIndex = 0

mean = [0, 0, 0, 0, 0, 0]

for file in files:
    czml = ''

    czml += ('MEMBER %d\n' %fileIndex);
    czml += ('press,hght,temp,dwpt,wdir,wspd\n');


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
                press = float(words[4])
                temp = float(words[5])
                dwpt = float(words[7])
                wd = float(words[8])
                ws = float(words[9])

                data.append([press, height, temp, dwpt, wd, ws])

    input_stream.close()

    for j in range(0, len(data),20) :
        czml += ('%f,%f,%f,%f,%f,%f\n' %(data[j][0],data[j][1],data[j][2],data[j][3],data[j][4],data[j][5]))

    fileIndex += 1

    savepath = join(getcwd(), 'balloon', 'data', 'skewT', str(file))
    fout = open(savepath, 'w')
    fout.write(czml)
    fout.close()
