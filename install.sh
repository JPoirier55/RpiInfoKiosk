#!/bin/bash
sudo apt-get update
sudo apt-get upgrade
echo "Updated, installing depnecies"

sudo apt-get install chromium-browser x11-xserver-utils upstart xdotool

"Installing node..."

wget https://nodejs.org/download/release/v0.10.0/node-v0.10.0-linux-arm-pi.tar.gz

pwdir=$(pwd)

cd /usr/local
sudo tar xzvf $pwdir/node-v0.10.0-linux-arm-pi.tar.gz --strip=1
rm $pwdir/node-v0.10.0-linux-arm-pi.tar.gz
cd pwdir


"Updating node..."
sudo npm install -g n
sudo n stable


sudo npm install forever -g
sudo npm install


"Linking upstart file to start kiosk on boot..."
mkdir -p /home/pi/.config/lxsession/LXDE-pi/

ln autostart/autostart /home/pi/.config/lxsession/LXDE-pi/


echo "Donezo!"

