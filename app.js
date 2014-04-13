/**
 * Module dependencies.
 */

var express = require('express');
var pixel = require('./routes/pixel');
var http = require('http');
var path = require('path');
var color = require('./lib/color')
var Rgb123 = require('./lib/rgb123').Rgb123;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', pixel.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var device = Rgb123({
    width: 8,
    height: 8,
    port: "/dev/tty.usbmodem1421",
    baudRate: 115200
});


var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.emit('setPixels', device.getCanvas());

    socket.on('draw', function(change) {
        var brush = color.parseColor(change.brush);
        device.setColor(change.x, change.y, brush);
        socket.broadcast.emit('setPixel', { x: change.x, y: change.y, brush: brush.toRgb() });
        socket.emit('setPixel', { x: change.x, y: change.y, brush: brush.toRgb() });
    });
});