function validateColorChannel(c) {
    if (typeof c !== "number" || c == NaN || c > 255 || c < 0) {
        throw "Illegal color component";
    }
}

function colourChannelHex(octet) {
    validateColorChannel(octet);

    var hex = octet.toString(16);
    if (hex.length == 1) {
        hex = "0" + hex;
    }
    return hex;
}

exports.CreateColorFromHex = function CreateColorFromHex(r, g, b) {
    return exports.Color(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));
};

exports.Color = function Color(r, g, b) {
    validateColorChannel(r);
    validateColorChannel(g);
    validateColorChannel(b);

    return {
        toHex : function toHex() {
            return "#" + colourChannelHex(r) + colourChannelHex(g) + colourChannelHex(b);
        },
        toRgb : function toHex() {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        },
        toArray : function toArray() {
            return [r, g, b];
        }
    };
};

var rgbFormat = /rgb\(([0-2]?[0-9]{1,2}), ([0-2]?[0-9]{1,2}), ([0-2]?[0-9]{1,2})\)/i;
var bigHexFormat = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
var smallHexFormat = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

exports.parseColor = function parseColor(s) {
    var parsed = rgbFormat.exec(s);
    if (parsed) {
        return exports.Color(parsed[1], parsed[2], parsed[3]);
    }

    parsed = bigHexFormat.exec(s.toLowerCase());
    if (parsed) {
        return exports.CreateColorFromHex(parsed[1], parsed[2], parsed[3]);
    }

    parsed = smallHexFormat.exec(s.toLowerCase());
    if (parsed) {
        return exports.CreateColorFromHex(parsed[1] + "0", parsed[2] + "0", parsed[3] + "0");
    }

    console.warn("Could not parse color " + s);

    return exports.Color(0, 0, 0);
};