#!/bin/sh

#hdmi_on.sh - custom script to turn HDMI on
status=`tvservice -s | grep off | wc -l`

if [ $status -eq 1 ]
then
	tvservice -p
	xset dpms force on
	xset -dpms
	xset s off
	xset s noblank
fi
