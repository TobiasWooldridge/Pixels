var Color = require('./color.js');
var SerialPort = require("serialport").SerialPort;

function checksum(bytes) {
    var checksum = 0;
    for (var i = 0; i < bytes.length; i++) {
        var b = bytes[i];
        checksum = (((checksum + b) << 1) ^ b) & 0xFF;
    }
    return checksum;
}


function getPixelIndex(width, x, y) {
    if (y % 2 == 0) {
        return y * width + x;
    }
    else {
        return y * width + (width - 1 - x);
    }
}

function createCanvas(width, height) {
    var canvas = [];

    for (var y = 0; y < height; y++) {
        var row = [];

        for (var x = 0; x < width; x++) {
            row.push(Color.BLACK.toRgb());
        }

        canvas.push(row);
    }

    return canvas;
}

function createPacket(data) {
    var packet = [254].concat(data).concat([checksum(data)]);

    // Convert packet to bytes
    var buf = new Buffer(packet.length);
    for (var i = 0; i < packet.length; i++) {
        buf.writeUInt8(packet[i], i);
    }

    return buf;
}

exports.Rgb123 = function (config) {
    if (typeof config.width != "number" || config.width <= 0 || config.width == NaN) {
        throw "U wot m8";
    }
    else if (typeof config.height != "number" || config.height <= 0 || config.height == NaN) {
        throw "U wot m8";
    }

    var serialPort = new SerialPort(config.port, {
        baudRate: config.baudRate
    });

    function transmitPixel(x, y) {
        var pixelIndex = getPixelIndex(config.width, x, y);
        var body = [pixelIndex].concat(Color.parseColor(canvas[y][x]).toArray());

        serialPort.write(createPacket(body));
    }

    // Create canvas
    var canvas = createCanvas(config.width, config.height);

    var rgb123 = {
        setColor: function (x, y, brush) {
            if (canvas[y] === undefined || canvas[y][x] === undefined) {
                throw "Illegal change coordinates (" + x + ", " + y + ")";
            }

            canvas[y][x] = brush.toRgb();
            transmitPixel(x, y);
        },
        getCanvas: function() {
            return canvas;
        }
    };

    return rgb123;
};
