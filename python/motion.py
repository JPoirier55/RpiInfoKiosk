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
	

def monitorOff():
	print "turning monitor off"
	global MONITOR_STATE 
	MONITOR_STATE = 0
	subprocess.call(['tvservice','-o'])

def monitorOn():
	print "Monitor on"
	global MONITOR_STATE
	MONITOR_STATE = 1
	#subprocess.check_call(['/home/pi/Github/RpiInfoKiosk/python/monitor_on.sh'])	
	status = subprocess.check_output(['tvservice', '-s'])
	if "HDMI" in status:
		subprocess.check_output(['tvservice', '--explicit="DMT 87"'])
	    subprocess.check_output(['fbset', '-depth 8'])
	    subprocess.check_output(['fbset', '-depth 16'])
	    subprocess.check_output(['xrefresh'])
	   
		   
	

def checkMotion():
	global LAST_MOTION_DECTECTED
	d = datetime.now() - LAST_MOTION_DETECTED
	print "Seconds: " + str(d.seconds)
	if(d.seconds > 30):
		monitorOff()

#Main
print "PIR Module Test (CTRL+C to exit)"
print "Ready"

try:    
	GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=MOTION, bouncetime=500)
	while 1:
		if(MONITOR_STATE == 1):
			checkMotion()
		time.sleep(1)


except KeyboardInterrupt:
	print "Quit"
	subprocess.check_call(['/home/pi/Github/RpiInfoKiosk/python/monitor_on.sh'])
	GPIO.cleanup()




