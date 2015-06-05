# Raspberry Pi Info Kiosk

![Alt text](/screenshots/screenshot.png?raw=true "Screen")

## Setup
Get node

`https://github.com/basdegroot/raspberry-pi-kiosk`

`sudo apt-get install node`

## Useful CMDS:

Upstart commands:
`sudo start|stop|status node`

Upstart Logs:
`sudo cat /var/log/upstart/your_service.log` 

Run cmds on local display.
`ssh -X pi@host`

Once logged in
`export DISPLAY=:0`
