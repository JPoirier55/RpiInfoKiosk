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
#0 = false 1=true
checking_motion = 0

#Functions
def MOTION(PIR_PIN):
    print "Motion Detected! setting time."
    LAST_MOTION_DETECTED = datetime.now()

def checkMotion():
	global checking_motion
	checking_motion = 1
	subprocess.check_call(['./monitor_on.sh'])	
	print "Monitor on"
	print "in turn on"
	while 1:
		d = datetime.now() - LAST_MOTION_DETECTED
		if(d.seconds > 30):
			print "turning monitor off"
			#subprocess.call(['tvservice','-o'])
			checking_motion = 0
			break
		time.sleep(1)

#Main
print "PIR Module Test (CTRL+C to exit)"
print "Ready"

try:    
	GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=MOTION, bouncetime=5000)
	while 1:
		print "in main while"
		if(checking_motion == 0):
			checkMotion()
		time.sleep(1)


except KeyboardInterrupt:
	print "Quit"
	#subprocess.check_call(['./monitor_on.sh'])
	GPIO.cleanup()




