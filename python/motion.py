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

#Functions
def MOTION(PIR_PIN):
    print "Motion Detected!"
    LAST_MOTION_DETECTED = datetime.now()

def turnOn():
	subprocess.check_call(['/home/pi/monitor_on.sh'])
	
	while 1:
		d = datetime.now() - LAST_MOTION_DETECTED
		if(d.seconds > 30):
			break
		sleep(1000)
	
	subprocess.call(['tvservice','-o'])


#Main
print "PIR Module Test (CTRL+C to exit)"
time.sleep(2)
print "Ready"

try:
    
	GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=MOTION, bouncetime=500)
	while 1:
		turnOn()
		time.sleep(1000)


except KeyboardInterrupt:
	print "Quit"
	subprocess.check_call(['monitor_on.sh'])
	GPIO.cleanup()




