#!/bin/bash

MAX_LENGTH=25
SCROLL_SPEED=0.3

get_media_info() {
	playerctl metadata --format '{{ artist }} - {{ title }}' 2>/dev/null || echo ""
}

scroll_text() {
	local text="$1"
	local length=${#text}

	if [ $length -le $MAX_LENGTH ]; then
		echo "$text"
		return
	fi

	# Add padding for smooth loop
	local padded_text="$text    $text"
	local timestamp=$(date +%s)
	local offset=$(((timestamp * 2) % length))

	echo "${padded_text:$offset:$MAX_LENGTH}"
}

media_info=$(get_media_info)
if [ -n "$media_info" ]; then
	scrolled=$(scroll_text "$media_info")
	echo "$scrolled"
else
	echo "No music playing"
fi
