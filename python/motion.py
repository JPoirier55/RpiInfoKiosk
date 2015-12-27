import RPi.GPIO as GPIO
import time
from datetime import datetime
import subprocess
import sys
import json



# Vars
GPIO.setmode(GPIO.BCM)
PIR_PIN = 7
GPIO.setup(PIR_PIN, GPIO.IN)

# global
LAST_MOTION_DETECTED = datetime.now()
MONITOR_STATE = 1
# 0 = false 1=true
checking_motion = 0


# Functions
def logEventToJson(time, msg):
    logArray = readJson()       
    event = {                   
      'time':  time,
      'msg' :  msg    
    }
    
    logArray.append(event)          
    out_file = open("/home/pi/Github/RpiInfoKiosk/python/motion_log.json","w+")
    json.dump(logArray , out_file, indent=4)                                    
    out_file.close()

def readJson():
    try:
        in_file = open("/home/pi/Github/RpiInfoKiosk/python/motion_log.json","r")
        logObj = json.load(in_file)
        in_file.close()
        # last N items in the array
        return logObj[-200:]
    except:
        return []


def MOTION(PIR_PIN):
    global LAST_MOTION_DETECTED
    LAST_MOTION_DETECTED = datetime.now()
    print("Motion Detected! setting time.")
    print(LAST_MOTION_DETECTED)
    monitorOn()


def monitorOn():
    monitorStatus = subprocess.check_output("tvservice -s", shell=True)
    if "off" in monitorStatus:
        subprocess.check_output("tvservice -p", shell=True)# turn on montior
        subprocess.check_output("xset s noblank", shell=True)# disable screensaver
        subprocess.check_output("xset s off", shell=True)# disable screensaver                
        subprocess.check_output("xset -dpms", shell=True)# disable engergy saving
        subprocess.check_output("xset dpms force on", shell=True)# disable screensaver
        subprocess.check_output("xdotool key x", shell=True)# disable screensaver        
        
        global MONITOR_STATE
        MONITOR_STATE = 1
        logEventToJson(str(LAST_MOTION_DETECTED), "Motion detected")        

def monitorOff():
    global MONITOR_STATE
    MONITOR_STATE = 0
    subprocess.check_output("tvservice -o", shell=True)

def checkMotion():
    global LAST_MOTION_DECTECTED
    d = datetime.now() - LAST_MOTION_DETECTED
    #print("Seconds: " + str(d.seconds))
    if(d.seconds > 30):
        monitorOff()

# Main
print("PIR Module Test (CTRL+C to exit)")
logEventToJson(str(LAST_MOTION_DETECTED), "Starting python script.")

try:
    GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=MOTION, bouncetime=500)
    monitorOn()
    time.sleep(5)
    monitorOff()
    
    
    while 1:
        if(MONITOR_STATE == 1):
            checkMotion()
        time.sleep(1)


except KeyboardInterrupt:
    print("Quit")
    monitorOn()
    GPIO.cleanup()
