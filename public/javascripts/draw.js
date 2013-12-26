function pixelDraw(canvas, palette, pixels) {
    var dim = {
        w: 16,
        h: 16
    };

    var sq;

    var paletteColours = [ "#fff", "#f00", "#0f0", "#00f", "#0ff", "#f0f", "#ff0", "#000", "#802A2A", "#ddd", "#aaa", "#666", "#333" ];

    var brush = "#f00";

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
                setTimeout(retrievePixels, 500);
        })
        ;
    }

    function repaint() {
        updateSquare();

        // Draw each pixel's square on the canvas
        for (var x = 0; x < dim.w; x++) {
            for (var y = 0; y < dim.h; y++) {
                canvas.drawRect({
                    fillStyle: pixels[y][x],
                    x: x * sq.w - 1,
                    y: y * sq.h - 1,
                    width: sq.w + 1,
                    height: sq.h + 1,
                    fromCenter: false,
                });
            }
        }
    };

    function paint(e) {
        if (!painting) {
            return;
        }

        var x = Math.floor(e.offsetX/sq.w),
            y = Math.floor(e.offsetY/sq.h);

        if (x >= dim.w || y >= dim.h) {
            return;
        }

        if (pixels[y][x] == brush) {
            return;
        }

        pixels[y][x] = brush;


        $.ajax({
            type: "POST",
            url: "/pixels/draw",
            data: { x: x, y: y, brush: brush }
        });

        repaint();
    }

    function startPainting(e) {
        painting = true; paint(e);
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

        canvas.mousedown(startPainting);
        $("body").mouseup(stopPainting);

        canvas.mousemove(paint);

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

