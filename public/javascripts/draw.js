function pixelDraw(canvasId, palette) {
    var canvas;
    var ctx;
    var socket;

    var pixels;

    var dim = {
        w: 8,
        h: 8
    };

    var paletteColours = [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#00ffff",
        "#ff00ff",
        "#ffff00",
        "#ffffff",
        "#dddddd",
        "#aaaaaa",
        "#666666",
        "#333333",
        "#000000",
        "#0140CA",
        "#DD1812",
        "#FCCA03",
        "#16A61E"
    ];

    var brush = paletteColours[0];

    var drawLayer = 1;

    var painting = false;

    var sq;

    function updateSquareDimensions() {
        sq = {
            w: canvas.width / dim.w,
            h: canvas.height / dim.h
        }
    }


    function retrievePixels(callback) {
        $.ajax("/pixels")
        .done(function(data) {
            pixels = data;
            repaintAll();

            if (callback) {
                callback();
            }
        })
        .always(function() {
            setTimeout(retrievePixels, 100);
        });
    }


    var parseColor = memoize(function parseColor(color) {
        if (color.substring(0,1) == "#") {
            if (color.length == 4) {
                // #FFF
                return [
                    parseInt(color.substring(1,2), 16) * 16,
                    parseInt(color.substring(2,3), 16) * 16,
                    parseInt(color.substring(3,4), 16) * 16,
                    256
                ]
            }

            // #FFFFFF
            return [
                parseInt(color.substring(1,3), 16),
                parseInt(color.substring(3,5), 16),
                parseInt(color.substring(5,7), 16),
                parseInt(color.substring(7,9), 16) | 255
            ];
        }
        else {
            // rgba(255, 255, 255, 1)
            var channels = [];

            var re = /([0-9\.]+)/g;
            do {
                var m = re.exec(color);
                if (m) {
                    channels.push(+m[1]);
                }
            } while (m);

            if (channels.length == 3) {
                channels.push(1);
            }

            channels[3] *= 255;

            return channels;
        }
    });


    var createColoredSquare = memoize(function createColoredSquare(sq, color) {
        var img = ctx.createImageData(sq.w, sq.h);

        for (var i = 0; i < img.data.length; i += 4) {
            // Funroll-loops
            img.data[i + 0] = color[0];
            img.data[i + 1] = color[1];
            img.data[i + 2] = color[2];
            img.data[i + 3] = color[3];
        }

        return img;
    });

    function repaintSquare(x, y) {
        updateSquareDimensions();

        var color = parseColor(pixels.layers[1].canvas[y][x]);

        var img = createColoredSquare(sq, color);

        ctx.putImageData(img, x * sq.w, y * sq.h);
    }

    function repaintAll() {
        for (var x = 0; x < dim.w; x++) {
            for (var y = 0; y < dim.h; y++) {
                repaintSquare(x, y);
            }
        }
    };

    function paint(e) {
        var x = Math.floor(e.offsetX/sq.w),
            y = Math.floor(e.offsetY/sq.h);

        if (x >= dim.w || y >= dim.h || pixels.layers[drawLayer].canvas[y][x] == brush) {
            return;
        }

        pixels.layers[drawLayer].canvas[y][x] = brush;

        repaintSquare(x, y);

        socket.emit('draw', { x: x, y: y, brush: brush });
    }

    function startPainting(e) {
        painting = true;
        paint(e);
    };

    function stopPainting(e) {
        painting = false;
    };

    function setBrush(color) {
        brush = color;
        $("#brush").css("background", brush);
    }

    function setUpCanvas() {
        $(canvas).bind("click", paint);
        $(canvas).bind("mousedown", startPainting);
        $("body").bind("mouseup", stopPainting);
        $(canvas).bind("mousemove", function(e) {
            if (painting) {
                paint(e);
            }
        });

        $(canvas).resize(repaintAll);

        function changeSwatch(swatch, color) {
            return function doChangeSwatch() {
                palette.children().removeClass('active');
                swatch.addClass('active');

                setBrush(color);
            }
        }

        for (var i = 0; i < paletteColours.length; i++) {
            var color = paletteColours[i];

            var swatch = $("<li></li>").addClass("swatch").css("background", color);

            swatch.click(changeSwatch(swatch, color));

            palette.append(swatch);
        }

        palette.children().first().click();
    }

    (function init() {
        canvas = document.getElementById("pixels");
        ctx = canvas.getContext('2d');
        setUpCanvas();

        socket = io.connect();
        socket.on('setPixels', function (data) {
            pixels = data;
            repaintAll();
        });

        socket.on('setPixel', function (change) {
            pixels.layers[1].canvas[change.y][change.x] = change.brush;
            repaintSquare(change.x, change.y);
        });
    }());
};

