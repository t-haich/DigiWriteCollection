import json
import sys

numFiles = len(sys.argv)
for i in range(1, numFiles):
    fileName = sys.argv[i]
    with open(fileName) as dataFile:
        data = json.load(dataFile)
        memory = []
        startTime = 0
        for line in data:
            if data[line] == 'start':
                startTime = int(line)
                break

        for line in data:
            if data[line] == 'start' or data[line] == 'stop':
                continue
            else:
                memoryLine = { 'time': int(line) - startTime, 'x': int(data[line]['x']), 'y': int(data[line]['y']), 'state': data[line]['state'] }
                memory.append(memoryLine)
        
        memory = sorted(memory, key=lambda x : x['time'])
        out = open(fileName+'-list.json', 'w')
        out.write(json.dumps(memory))