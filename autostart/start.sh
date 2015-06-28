#!/bin/bash

#Run this is @sh <path_to_this> in /home/pi/.config/lxsession/LXDE-pi/autostart 
nodemon /home/pi/Github/RpiInfoKiosk/server.js &
sudo python /home/pi/Github/RpiInfoKiosk/python/motion.py &
