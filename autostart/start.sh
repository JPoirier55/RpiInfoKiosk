#!/bin/bash

#Run this is @sh <path_to_this> in /home/pi/.config/lxsession/LXDE-pi/autostart 
sudo python /home/pi/Github/RpiInfoKiosk/python/motion.py > /home/pi/logs/motion.log &
forever start /home/pi/Github/RpiInfoKiosk/server.js > /home/pi/logs/node.log &
