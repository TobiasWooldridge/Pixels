/*
 * GET pixels.
 */

function createPixelMap(width, height, fill, pixelMap) {
    if (pixelMap == undefined) {
        pixelMap = [];
    }

    // Create rows
    for (var y = 0; y < height; y++) {
        pixelMap[y] = [];

        // Fill rows with fill
        for (var x = 0; x < width; x++) {
            pixelMap[y][x] = fill;
        }
    }

    return pixelMap;
}

/*
Compose every passed layers into a single image.
 */
function mergePixelMaps(a, b) {
    // Create rows
    for (var y = 0; y < a.length; y++) {
        // Fill rows with fill
        for (var x = 0; x < a[0].length; x++) {
            if (b[y][x] !== undefined) {
                a[y][x] = b[y][x];
            }
        }
    }
}

function compositLayers(layers) {
    var canvas = createPixelMap(layers[0][0].length, layers[0].length, '#fff');

    for (var i = 0; i < layers.length; i++) {
        mergePixelMaps(canvas, layers[i]);
    }

    return canvas;
}

var dimensions = { w : 16, h: 16 };

var userLayer = createPixelMap(dimensions.w, dimensions.h, "#000");
var systemLayer = createPixelMap(dimensions.w, dimensions.h, undefined);

//
//var moo = 0;
//setInterval(function() {
//    systemLayer = createPixelMap(16, 16, undefined, systemLayer);
//
//    systemLayer[moo][1] = "#fff";
//
//    moo = (moo + 1) % 16;
//}, 200);

var layers = [ userLayer, systemLayer ];

exports.index = function(req, res){
    res.render('index', { title: 'Pixels', pixels: compositLayers(layers) });
};

exports.get = function(req, res){
    res.send(compositLayers(layers));
};

var hexCode = /\#[0-9a-f]{3}([0-9a-f]{3})?/i;

exports.post = function(req, res){

    var change = req.body;

    console.log(change);

    if (!hexCode.test(change.brush)) {
        return
    }

    userLayer[change.y][change.x] = change.brush;

    res.send(compositLayers(layers));
};