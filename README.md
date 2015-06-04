# Raspberry Pi Info Kiosk

![Alt text](/screenshots/screenshot.png?raw=true "Screen")

## Setup
Get node

`https://github.com/basdegroot/raspberry-pi-kiosk`

`sudo apt-get install node`

Install the tools we need to perfectly show the webpage. The next command will install chromium (browser), x11 server utils and unclutter (to hide the cursor from the screen)

`sudo apt-get install chromium x11-xserver-utils unclutter`

The tools are installed. When the GUI starts up chromium needs to boot in kiosk-mode and open the webpage we filled in. In the next file we can add lines what needs to be executed at startup.

`sudo nano /etc/xdg/lxsession/LXDE-pi/autostart`

The autostart files needs to look like this

```
@lxpanel --profile LXDE
@pcmanfm --desktop --profile LXDE
@xset s off
@xset -dpms
@xset s noblank
@sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium/Default/Preferences
@chromium --noerrdialogs --kiosk http://www.page-to.display --incognito
```

The @xset options will disable the energy-options from the X-server so the screen won't be shut down after a x amount of time. The @sed line will prevent errors to be shown. And finally Chromium will be startup in kiosk mode (with no error messages). Change the url to the url you want it to show. Local files are also possibly.

Now Chromium will start after the raspberry pi is booted up and will show the webpage.
