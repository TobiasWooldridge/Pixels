var layeredCanvas = require('../lib/layeredCanvas.js');

var dimensions = { w : 16, h: 16 };

var layeredCanvas = layeredCanvas.createLayeredCanvas(dimensions.w, dimensions.h, 3, 'rgba(0, 0, 0, 1)');

exports.index = function(req, res){
    res.render('index', { title: 'Pixels' });
};

exports.get = function(req, res){
    res.send(layeredCanvas);
};

exports.post = function(req, res){
    var change = req.body;

    layeredCanvas.layers[1].canvas[change.y][change.x] = change.brush;
};