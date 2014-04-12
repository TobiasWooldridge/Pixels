var layeredCanvas = require('../lib/layeredCanvas.js');
var color = require('../lib/color')

var SerialPort = require("serialport").SerialPort;

var dimensions = { w : 8, h: 8 };

var layeredCanvas = layeredCanvas.createLayeredCanvas(dimensions.w, dimensions.h, 3, '#000000');

var serialPort = new SerialPort("/dev/tty.usbmodem1411", {
    baudRate: 115200
});

function millis() {
    return new Date().getTime();
}

serialPort.on("open", function () {
    var lastSent = 0;

    serialPort.on('data', function(data) {
            var x = lastSent % dimensions.w;
        var y = (lastSent - x)/dimensions.w % 255;

        if (layeredCanvas.layers[1].canvas[y] !== undefined) {
            transmitPixel(x, y, color.parseColor(layeredCanvas.layers[1].canvas[y][x] || "#111111"))
        }

        lastSent++;
        if (lastSent > (dimensions.w * dimensions.h)) {
            lastSent = 0;
        }
    });
});


exports.index = function(req, res){
    res.render('index', { title: 'Pixels' });
};

exports.getCanvas = function(){
    return layeredCanvas;
}

exports.drawPixel = function(x, y, brush){
    var canvas = layeredCanvas.layers[1].canvas;

    if (canvas[y] === undefined || canvas[y][x] === undefined) {
        console.error("Illegal change coordinates (" + x + ", " + y + ")");
        return;
    }

    canvas[y][x] = brush.toRgb();

    transmitPixel(x, y, brush);
    transmitPixel(x, y, brush);
    transmitPixel(x, y, brush);
}

function getAddress(x, y) {
    if (y % 2 == 0) {
        return y * dimensions.w + x;
    }
    else {
        return y * dimensions.w + (dimensions.w - 1 - x);
    }
}

function checksum(bytes) {
    var checksum = 0;
    for (var i = 0; i < bytes.length; i++) {
        var b = bytes[i];
        checksum = (((checksum + b) << 1) ^ b) & 0xFF;
    }
    return checksum;
}

function transmitPixel(x, y, brush) {
    // Throw in some zeroes for the #YOLOs
    var packet = [0, 0, 254];

    // Add message
    var address = getAddress(x, y);
    var data = [ address].concat(brush.toArray());
    packet = packet.concat(data);

    // Calculate checksum for data
    packet.push(checksum(data));

    // Convert packet to bytes
    var buf = new Buffer(packet.length);
    for (var i = 0; i < packet.length; i++) {
        buf.writeUInt8(packet[i], i);
    }

    // Transmit message
    serialPort.write(buf);
}