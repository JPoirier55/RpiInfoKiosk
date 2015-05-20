import RPi.GPIO as GPIO
import time
import subprocess

#Vars
GPIO.setmode(GPIO.BCM)
PIR_PIN = 7
GPIO.setup(PIR_PIN, GPIO.IN)

#Functions
def MOTION(PIR_PIN):
	print "Motion Detected!"
	turnOn()

def turnOn():
	subprocess.check_call(['/home/pi/monitor_on.sh'])
	time.sleep(20)
	subprocess.call(['tvservice','-o'])


#Main
print "PIR Module Test (CTRL+C to exit)"
time.sleep(2)
print "Ready"

try:
	GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=MOTION, bouncetime=20000)
	while 1:
		time.sleep(100)
except KeyboardInterrupt:
	print "Quit"
	subprocess.check_call(['/home/pi/monitor_on.sh'])
	GPIO.cleanup()




