#!/bin/bash

if [ ! -d /home/pi/logs ]; then
	mkdir /home/pi/logs
fi;

if [ ! -d /home/pi/logs/node.log ]; then
	touch /home/pi/logs/node.log
fi;

xset s off         # don't activate screensaver
xset -dpms         # disable DPMS (Energy Star) features.
xset s noblank     # don't blank the video device

#Run this is @sh <path_to_this> in /home/pi/.config/lxsession/LXDE-pi/autostart 
forever start /home/pi/Github/RpiInfoKiosk/server.js >> /home/pi/logs/node.log &
sudo python /home/pi/Github/RpiInfoKiosk/python/motion.py >> /home/pi/logs/motion.log &
