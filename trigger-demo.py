import firebase
import json
import time
import thread
import sys
import serial

url = 'digiwrite.firebaseIO.com/state'
running = False

def doStuff():
    global running
    global serial
    global log
    num_lines_to_remove = 10
    current_line = 0
    start_time = -1
    print 'start doing stuff'
    while serial and running:
        line = serial.readline()
        if line:
            line_split = line.split(" ")
            if len(line_split) == 16:
                if current_line < num_lines_to_remove:
                    current_line += 1
                else:
                    print line_split
                    log.write(line_split[0]) # Teensy time
                    log.write(',')

                    if start_time == -1:
                        start_time = time.time()

                    log.write(str(time.time()-start_time)) # Python system time
                    log.write(',')
                    log.write(line_split[1]) # packet number
                    log.write(',')
                    log.write(line_split[2]) # sensor 1 gyroscope X
                    log.write(',')
                    log.write(line_split[3]) # sensor 1 gyroscope Y
                    log.write(',')
                    log.write(line_split[4]) # sensor 1 gyroscope Z
                    log.write(',')
                    log.write(line_split[5]) # sensor 1 accelerometer X
                    log.write(',')
                    log.write(line_split[6]) # sensor 1 accelerometer Y
                    log.write(',')
                    log.write(line_split[7]) # sensor 1 accelerometer X
                    log.write(',')
                    log.write(line_split[8]) # sensor 2 gyroscope X
                    log.write(',')
                    log.write(line_split[9]) # sensor 2 gyroscope Y
                    log.write(',')
                    log.write(line_split[10]) # sensor 2 gyroscope Z
                    log.write(',')
                    log.write(line_split[11]) # sensor 2 accelerometer X
                    log.write(',')
                    log.write(line_split[12]) # sensor 2 accelerometer Y
                    log.write(',')
                    log.write(line_split[13]) # sensor 2 accelerometer Z
                    log.write(',')
                    log.write(line_split[14]) # mouse X
                    log.write(',')
                    log.write(line_split[15]) # mouse Y
                    # log.write('\n')

def callback(e):
    global running
    if e[1]['data'] == 'on':
        print 'received start trigger'
        running = True
        thread.start_new_thread(doStuff, ())
    elif running and e[1]['data'] == 'off':
        print 'received stop trigger'
        running = False

        try:
            subscribe.stop()
        except Exception:
            print 'catching hacky exceptions'

serial = serial.Serial(
    port='/dev/ttyACM3',\
    baudrate=115200,\
    parity=serial.PARITY_NONE,\
    stopbits=serial.STOPBITS_ONE,\
    bytesize=serial.EIGHTBITS,\
        timeout=0)

log = open(sys.argv[1], 'w')
log.write('Time,SystemTime,Packet,S1GX,S1GY,S1GZ,S1AX,S1AY,S1AZ,S2GX,S2GY,S2GZ,S2AX,S2AY,S2AZ,MX,MY\n')

subscribe = firebase.subscriber(url, callback)
subscribe.start()