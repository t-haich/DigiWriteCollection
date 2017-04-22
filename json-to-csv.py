import json
import sys

numFiles = len(sys.argv)
for i in range(1, numFiles):
    fileName = sys.argv[i]
    with open(fileName) as dataFile:
        data = json.load(dataFile)
        memory = []

        for line in data:
            if data[line] == 'start' or data[line] == 'stop':
                continue
            else:
                memoryLine = [int(line), int(data[line]['x']), int(data[line]['y'])]
                memory.append(memoryLine)
        
        memory = sorted(memory, key=lambda x : x[0])
        out = open(fileName+'.csv', 'w')
        for line in memory:
            print line
            out.write(str(line[0]/1000.0))
            out.write(',')
            out.write(str(line[1]))
            out.write(',')
            out.write(str(line[2]))
            out.write('\n')