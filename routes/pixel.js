
/*
 * GET pixels.
 */


var pixelStates = [
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
    [ '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff' ],
];

exports.index = function(req, res){
    res.render('index', { title: 'Pixels', pixels: pixelStates });
};

exports.get = function(req, res){
//    req.accepts("application/json")
    res.send(pixelStates);
};

var hexCode = /\#[0-9a-f]{3}([0-9a-f]{3})?/i;

exports.post = function(req, res){

    var change = req.body;

    console.log(change);

    if (!hexCode.test(change.brush)) {
        return
    }

    pixelStates[parseInt(change.y)][parseInt(change.x)] = change.brush;

    res.send(pixelStates);
};