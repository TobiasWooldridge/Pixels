var layeredCanvas = require('../lib/layeredCanvas.js');

var SerialPort = require("serialport").SerialPort;

var dimensions = { w : 16, h: 16 };

var layeredCanvas = layeredCanvas.createLayeredCanvas(dimensions.w, dimensions.h, 3, 'rgba(0, 0, 0, 1)');

var serialPort = new SerialPort("/dev/tty.usbmodem1411", {
    baudRate: 14400
});

serialPort.on("open", function () {
    serialPort.on('data', function(data) {
        console.log(data.toString());
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
}

function transmitPixel(x, y, brush) {
    var address;
    if (y % 2 == 0) {
        address = y * 16 + x;
    }
    else {
        address = y * 16 + (15 - x);
    }

    var bytes = [254, address].concat(brush.toArray());
    console.log(bytes);

    var buf = new Buffer(6);
    for (var i = 0; i < bytes.length; i++) {
        buf.writeUInt8(bytes[i], i);
    }
    buf.writeUInt8(bytes.reduce(function(a, b) { return a ^ b; }), 5);

    console.log(buf);
    serialPort.write(buf);
    serialPort.write(buf);
}