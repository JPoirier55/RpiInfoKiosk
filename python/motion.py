import RPi.GPIO as GPIO
import time
from datetime import datetime
import subprocess

#Vars
GPIO.setmode(GPIO.BCM)
PIR_PIN = 7
GPIO.setup(PIR_PIN, GPIO.IN)

#global
LAST_MOTION_DETECTED = datetime.now()
MONITOR_STATE = 0
#0 = false 1=true
checking_motion = 0

#Functions
def MOTION(PIR_PIN):
	print "Motion Detected! setting time."
    	global LAST_MOTION_DETECTED
	LAST_MOTION_DETECTED = datetime.now()
	print "Monitor on"
	global MONITOR_STATE
	MONITOR_STATE = 1
	monitorOn()	
	

def monitorOn():
	subprocess.call("tvservice -p | xset dpms force on | xset -dpms | xset s off | xset s noblank", shell=True)

def checkMotion():
	global LAST_MOTION_DECTECTED
	d = datetime.now() - LAST_MOTION_DETECTED
	print "Seconds: " + str(d.seconds)
	if(d.seconds > 30):
		print "turning monitor off"
		global MONITOR_STATE 
		MONITOR_STATE = 0
		subprocess.call(['tvservice','-o'])

#Main
print "PIR Module Test (CTRL+C to exit)"
print "Ready"

try:    
	checkMotion()
	
	GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=MOTION, bouncetime=500)
	while 1:
		if(MONITOR_STATE == 1):
			checkMotion()
		time.sleep(1)


except KeyboardInterrupt:
	print "Quit"
	monitorOn()
	GPIO.cleanup()




