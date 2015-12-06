#!/bin/bash

# if [ ! -d /home/pi/logs ]; then
# 	mkdir /home/pi/logs
# fi;

# if [ ! -d /home/pi/logs/node.log ]; then
# 	touch /home/pi/logs/node.log
# fi;

#Run this is @sh <path_to_this> in /home/pi/.config/lxsession/LXDE-pi/autostart 
echo "Begin script" >> /home/pi/logs/debug.log
sudo python /home/pi/Github/RpiInfoKiosk/python/motion.py > /home/pi/logs/motion.log &
forever start /home/pi/Github/RpiInfoKiosk/server.js > /home/pi/logs/node.log &
echo "End script" >> /home/pi/logs/debug.log
