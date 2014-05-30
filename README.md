# Pixels

Draw on a 8x8 or 16x16 RGB-123 LED matrix

Uses node.js/websockets/HTML5 canvas

Hipster cred over 9000

## Getting started

### Arduino code

1. Install the Adafruit Neopixel library into your Arduino /libraries directory. It's available
(here)[https://github.com/adafruit/Adafruit_NeoPixel]. I found just 'git clone'ing it to my Arduino library
directory was sufficient

2. Clone (TobiasWooldridge/PixelsArduino)[https://github.com/TobiasWooldridge/PixelsArduino]

3. Open the .ino file in your Arduino IDE, configure your IDE and build the application


### NodeCode™

    git clone git@github.com:TobiasWooldridge/Pixels.git
    npm install
    node app.js


You may need to update the serial port address described in app.js