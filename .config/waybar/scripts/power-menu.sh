#!/bin/bash
SCREEN_WIDTH=$(hyprctl monitors -j | jq '.[0].width')

options="Shutdown\nReboot\nSleep"
chosen=$(echo -e "$options" | rofi \
	-dmenu \
	-location 3 \
	-anchor 3 \
	-lines 3)

case $chosen in
"Shutdown")
	systemctl poweroff
	;;
"Reboot")
	systemctl reboot
	;;
"Sleep")
	systemctl suspend
	;;
esac
