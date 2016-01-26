#!/bin/bash

# if [ ! -d /home/pi/logs ]; then
# 	mkdir /home/pi/logs
# fi;

# if [ ! -d /home/pi/logs/node.log ]; then
# 	touch /home/pi/logs/node.log
# fi;

#Run this is @sh <path_to_this> in /home/pi/.config/lxsession/LXDE-pi/autostart 
forever -l /home/pi/logs/node.log start /home/pi/Github/RpiInfoKiosk/server.js 
sudo python /home/pi/Github/RpiInfoKiosk/python/motion.py

