PID=$(ps aux | grep forever | cut -d " " -f 10)
OUTPUT=$(ps aux | grep forver | head -n 1)

if [[ $OUTPUT == *"grep"* ]]
then
	echo "Coundn't find process."
else
	echo $OUTPUT
	echo "Is $PID the correct service?"

	read answer

	case $answer in
		"y")
			echo "Restarting!"
			kill $PID
			sleep 2
			forever start /home/pi/Github/RpiInfoKiosk/server.js > /home/pi/logs/node.log &
			echo "Done."
			;;
		*)
			echo "No op. Quiting..."

	esac
fi