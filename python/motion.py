import RPi.GPIO as GPIO
import time
from datetime import datetime
import subprocess
import sys
log_file = open('/home/pi/Github/RpiInfoKiosk/python/motion.log', 'ab+')

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
def MOTION(PIR_PIN):
    global LAST_MOTION_DETECTED
    LAST_MOTION_DETECTED = datetime.now()
    print("Motion Detected! setting time.")
    print(LAST_MOTION_DETECTED)
    log_file.write("Motion Detected! setting time at: " + str(LAST_MOTION_DETECTED))
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
print("Ready")
log_file.write("Starting python script: " + str(LAST_MOTION_DETECTED))

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