var palette = {
    transparent : "rgba(0, 0, 0, 0)"
}

function isColor(color) {
    return color != undefined;
}


function initializeCanvas(width, height, fill, canvas) {
    if (!isColor(fill)) {
        fill = palette.transparent;
    }

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

exports.createLayeredCanvas = function createPixelMap(width, height, layers, background) {
    function createLayer (fill) {
        var layer = {};

        layer.fill = function(fill) {
            layer.canvas = initializeCanvas(width, height, fill);
        }

        layer.clear = function() { layer.fill(palette.transparent); };

        layer.clear();

        return layer;
    };


    layeredCanvas = {};

    layeredCanvas.layers = [];

    for (var i = 0; i < layers; i++) {
        layeredCanvas.layers[i] = createLayer();
    }

    layeredCanvas.layers[0].fill(background);

    return layeredCanvas;
}


