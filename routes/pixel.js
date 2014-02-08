var layeredCanvas = require('../lib/layeredCanvas.js');

var dimensions = { w : 16, h: 16 };

var layeredCanvas = layeredCanvas.createLayeredCanvas(dimensions.w, dimensions.h, 3, 'rgba(0, 0, 0, 1)');


var moo = 0;
setInterval(function() {
    layeredCanvas.layers[2].clear();

    layeredCanvas.layers[2].canvas[moo][moo] = 'rgba(255, 255, 255, 0.8)';

    moo = (moo + 1) % 16;
}, 1000);

exports.index = function(req, res){
    res.render('index', { title: 'Pixels', layeredCanvas: layeredCanvas });
};

exports.get = function(req, res){
    res.send(layeredCanvas);
};

var hexCode = /\#[0-9a-f]{3}([0-9a-f]{3})?/i;

exports.post = function(req, res){
    var change = req.body;

    console.log(change);

    if (!hexCode.test(change.brush)) {
        return
    }

    layeredCanvas.layers[1].canvas[change.y][change.x] = change.brush;

    res.send(layeredCanvas);
};