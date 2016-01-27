#!/bin/bash

#Run this is @sh <path_to_this> in /home/pi/.config/lxsession/LXDE-pi/autostart 
forever start /home/pi/Github/RpiInfoKiosk/server.js 
sudo python /home/pi/Github/RpiInfoKiosk/python/motion.py