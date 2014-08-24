var color = require('../lib/color');

exports.createCanvas = function createCanvas(width, height, fill, canvas) {
    fill = color.parseColor(fill).toRgb();

    if (canvas == undefined) {
        canvas = [];
    }

    // Create rows
    for (var y = 0; y < height; y++) {
        canvas[y] = [];

        // Fill rows with fill param
        for (var x = 0; x < width; x++) {
            canvas[y][x] = fill;
        }
    }

    return canvas;
}