function pixelDraw(canvas, palette, pixels) {
    function debug(msg) {
        $.ajax("/log?" + JSON.stringify(msg));
    }

    var dim = {
        w: 16,
        h: 16
    };

    var sq;

    var paletteColours = [ "#f00", "#0f0", "#00f", "#0ff", "#f0f", "#ff0", "#fff", "#ddd", "#aaa", "#666", "#333", "#000" ];

    var brush = paletteColours[0];

    var drawLayer = 1;

    var painting = false;

    function updateSquare() {
        sq = {
            w: canvas.width() / dim.w,
            h: canvas.height() / dim.h
        }
    }

    function retrievePixels() {
        $.ajax("/pixels")
        .done(function(data) {
            pixels = data;
            repaint();
        })
        .always(function() {
                setTimeout(retrievePixels, 100);
        })
        ;
    }

    function drawSquare(x, y, color) {
        canvas.drawRect({
            fillStyle: color,
            x: x * sq.w - 1,
            y: y * sq.h - 1,
            width: sq.w + 1,
            height: sq.h + 1,
            fromCenter: false,
        });
    }

    function repaint() {
        updateSquare();

        // Draw each pixel's square on the canvas
        for (var layer = 0; layer < pixels.layers.length; layer++) {
            for (var x = 0; x < dim.w; x++) {
                for (var y = 0; y < dim.h; y++) {
                    drawSquare(x, y, pixels.layers[layer].canvas[y][x]);
                }
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

        $.ajax({
            type: "POST",
            url: "/pixels/draw",
            data: { x: x, y: y, brush: brush }
        }, function(data) {
            pixels = data;
        });

        repaint();
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

    (function init() {
        repaint();

        canvas.bind("click", paint);
        canvas.bind("mousedown", startPainting);
        $("body").bind("mouseup", stopPainting);
        canvas.bind("mousemove", function(e) {
            if (painting) {
                paint(e);
            }
        });

        canvas.resize(repaint);

        retrievePixels();

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
    }());
};

