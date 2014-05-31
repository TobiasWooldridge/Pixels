#!/usr/bin/bash

# Pixels Configuration
export PIXELS_SERIAL_PORT=`find /dev/tty.usbmodem* | head -n 1`
export PIXELS_HTTP_PORT=3000
export PIXELS_DISPLAY_WIDTH=16
export PIXELS_DISPLAY_HEIGHT=16

# TODO: Check out watchify
echo "Browserifying stuff"
./node_modules/browserify/bin/cmd.js \
	-r ./lib/color.js:color \
	> public/javascripts/color.js

echo "Running node.js server"
node app.js
