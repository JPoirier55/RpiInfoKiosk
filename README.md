# Raspberry Pi Info Kiosk

![Alt text](/screenshots/screenshot.png?raw=true "Screen")

## Setup
1. Get node

  1. install node
    1. wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
    2. sudo dpkg -i node_latest_armhf.deb
  2. `sudo apt-get install chromium-browser`
  3. `sudo apt-get install x11-xserver-utils`
  4. `sudo apt-get install upstart`
  5. `sudo apt-get install xdotool`

2. Once node/npm is installed run to install all dependecies. 

  1. `npm install`
  2. `npm install forever -g`

3. Link the `autostart/autostart` file to `~/.config/lxsession/LXDE-pi/autostart` to have the server automagically start when the pi boots.

4. Once program is started you need to get a Trakt.tv token. Visit `localhost:9001/trakt.html` and follow instructions.

## Debug

running `forever list` will give you the location of Node log.





