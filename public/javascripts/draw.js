var Color = require('color');

function pixelDraw(canvasId, paletteId, brushId, exportFileId, exportFacebookId) {
    var canvas;
    var ctx;
    var palette;
    var brushSwatch;

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

    function updateFavicon() {
        document.getElementById('favicon').href = canvas.toDataURL('image/png');
    }

    function repaintSquare(x, y, favicon) {
        updateSquareDimensions();

        var color = Color.parseColor(pixels[y][x]).toArray();

        var img = createColoredSquare(sq, color);

        // Draw square to the current canvas context
        ctx.putImageData(img, x * sq.w, y * sq.h);

        if (favicon !== true) {
            updateFavicon();
        }
    }

    function repaintAll() {
        for (var x = 0; x < dim.w; x++) {
            for (var y = 0; y < dim.h; y++) {
                repaintSquare(x, y, true);
            }
        }

        updateFavicon();
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
        brushSwatch.style.background = b;
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

        canvas.onresize = repaintAll;
    }

    function setUpPalette() {
        function changeSwatch(color) {
            return function doChangeSwatch() {
                setBrush(color);
            }
        }

        palette.innerHTML = "";

        for (var i = 0; i < paletteColours.length; i++) {
            var color = paletteColours[i];

            var swatch = document.createElement("li");
            swatch.className = 'swatch';
            swatch.style.background = color;

            swatch.onclick = changeSwatch(color);

            palette.appendChild(swatch);
        }

        setBrush(paletteColours[0]);
    }

    (function init() {
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext('2d');
        palette = document.getElementById(paletteId);
        brushSwatch = document.getElementById(brushId);

        socket = io.connect();

        socket.on('initialize', function initialize(data) {
            setUpCanvas(data.w, data.h);
            setUpPalette();
        });

        socket.on('setPixels', function setPixels(data) {
            pixels = data;
            repaintAll();
        });

        socket.on('setPixel', function setPixel(change) {
            pixels[change.y][change.x] = change.brush;
            repaintSquare(change.x, change.y);
        });


        var saveToFile = document.getElementById(exportFileId);

        $(saveToFile).bind('click', function() {
            saveCanvasAsFile(canvas, "Mooo.png");
        });

        var postToFacebook = document.getElementById(exportFileId);
        $(postToFacebook).bind('click', function() {
            FB.login(function(response) {
                var accessToken = response.authResponse.accessToken;

                var fd = new FormData();
                fd.append("access_token", accessToken);
                fd.append("source", canvasToBlob(canvas));
                fd.append("message", "I just drew this using http://github.com/TobiasWooldridge/Pixels !");

                $.ajax({
                    url:"https://graph.facebook.com/me/photos?access_token=" + accessToken,
                    type: "POST",
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false
                });

            }, {scope: 'user_photos,publish_actions,publish_stream'});
        });
    }());
};

