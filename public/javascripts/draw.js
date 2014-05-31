var Color = require('color');

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

    var createColoredSquare = memoize(function createColoredSquare(sq, color) {
        var img = ctx.createImageData(sq.w, sq.h);

        for (var i = 0; i < img.data.length; i += 4) {
            // Funroll-loops
            img.data[i + 0] = color[0];
            img.data[i + 1] = color[1];
            img.data[i + 2] = color[2];
            img.data[i + 3] = 255;
        }

        return img;
    });

    function colorToRgb(color) {
        return Color.parseColor(color || "#000000").toRgb()
    }

    function repaintSquare(x, y) {
        updateSquareDimensions();

        var color = Color.parseColor(pixels[y][x]).toArray();

        var img = createColoredSquare(sq, color);

        ctx.putImageData(img, x * sq.w, y * sq.h);


        document.getElementById('favicon').href = canvas.toDataURL('image/png');
    }

    function repaintAll() {
        for (var x = 0; x < dim.w; x++) {
            for (var y = 0; y < dim.h; y++) {
                repaintSquare(x, y);
            }
        }
    };

    function paint(e) {
        var x = Math.floor(e.offsetX / sq.w),
            y = Math.floor(e.offsetY / sq.h);

        if (x >= dim.w || y >= dim.h || colorToRgb(pixels[y][x]) == colorToRgb(brush)) {
            return;
        }

        pixels[y][x] = brush;

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

    function setBrush(b) {
        brush = b;
        $("#brush").css("background", brush);
    }

    function setUpCanvas(w, h) {
        dim.w = w;
        dim.h = h;

        $(canvas).bind("click", paint);
        $(canvas).bind("mousedown", startPainting);
        $("body").bind("mouseup", stopPainting);
        $(canvas).bind("mousemove", function (e) {
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

        socket = io.connect();

        socket.on('initialize', function initialize(data) {
            setUpCanvas(data.w, data.h);
        });

        socket.on('setPixels', function setPixels(data) {
            pixels = data;
            repaintAll();
        });

        socket.on('setPixel', function setPixel(change) {
            pixels[change.y][change.x] = change.brush;
            repaintSquare(change.x, change.y);
        });
    }());
};

