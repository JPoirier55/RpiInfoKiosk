import RPi.GPIO as GPIO
import time
from datetime import datetime
import subprocess

# Vars
GPIO.setmode(GPIO.BCM)
PIR_PIN = 7
GPIO.setup(PIR_PIN, GPIO.IN)

# global
LAST_MOTION_DETECTED = datetime.now()
MONITOR_STATE = 0
checking_motion = 0


# Functions
def MOTION(pin):
    global LAST_MOTION_DETECTED
    LAST_MOTION_DETECTED = datetime.now()
    print "Motion Detected! Monitor on setting time: " + LAST_MOTION_DETECTED
    monitorOn()

def monitorOn():
    global MONITOR_STATE
    if(MONITOR_STATE == 0):
        onCmds = ["tvservice -p", "xset dpms force on", "xset -dpms", "xset s off", "xset s noblank"]
        monitorStatus = subprocess.check_output("tvservice -s", shell=True)
        print monitorStatus
        if "off" in monitorStatus:
            for monitorCmd in onCmds:
                subprocess.call(monitorCmd, shell=True)
        
        MONITOR_STATE = 1

def monitorOff():
    print "turning monitor off"
    global MONITOR_STATE 
    MONITOR_STATE = 0
    subprocess.call(['tvservice' , '-o'])

def checkMotion():
    global LAST_MOTION_DECTECTED
    d = datetime.now() - LAST_MOTION_DETECTED
    if(d.seconds > 30):
        monitorOff()
        


# Main
print "PIR Module Test (CTRL+C to exit)"
print "Ready"

try:
    monitorOn()
    monitorOff()

    GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=MOTION, bouncetime=500)
    while 1:
        if(MONITOR_STATE == 1):
            checkMotion()
        time.sleep(1)


except KeyboardInterrupt:
    print "Quit"
    monitorOn()
    GPIO.cleanup()




