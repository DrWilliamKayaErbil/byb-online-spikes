(function () {


    BackyardBrains.ContinuousView = {};

    var canvas, /*context,*/ height, width, x_axis, y_axis;

    var c = 0;
    var timePassed = 0;
    var pixelScale = 100;

    BackyardBrains.ContinuousView.setup = function (domCanvas) {
        canvas = domCanvas;

        // console.log(this);
        context = canvas.getContext('2d');

        context.fillStyle = 'rgb(0,0,0)';

        context.lineJoin = 'round';

        height = canvas.height;
        width = canvas.width;

        x_axis = height / 2;
        y_axis = 0;

        context.save();

        draw(context);
    };

    BackyardBrains.ContinuousView.draw = function (context) {
        context.clearRect(0, 0, width, height);
        drawXAxis(context);
        drawYAxis(context);
        drawTickmarks(context);

        context.save();
        context.strokeStyle = 'rgb(0,255,0)';
        drawWave(c, context);
        context.restore();

        timePassed = timePassed + .01;
        c = timePassed*Math.PI;
		setTimeout(function () { draw(context); }, 10);
    };

    draw = BackyardBrains.ContinuousView.draw;

    function drawWave(c, context) {
        var x = c;
        var y = Math.sin(c*2);
        context.beginPath();
        context.moveTo(y_axis, pixelScale * y+x_axis);
        for (i = 0; i <= width; i += 1) {
            x = c+i/pixelScale;
            y = Math.sin(x*2);
            context.lineTo(i, pixelScale*y+x_axis);
        }
        context.stroke();
    }

    function drawXAxis (context) {
        bluePen(context);
        context.moveTo(0, x_axis);
        context.lineTo(width, x_axis);
        context.stroke();
    }

    function drawYAxis (context) {
        bluePen(context);
        context.moveTo(0, 0);
        context.lineTo(0, height);
        context.stroke();
    }

    function drawTickmarks (context) {
        bluePen(context);
        for (var i = 0; i < 9; i++) {
            context.moveTo(0, i/8 * height);
            context.lineTo(5, i/8 * height);
            context.stroke();
        }
    }

    function bluePen (context) {
        context.strokeStyle = 'rgb(0,0,255)';
        context.lineWidth = 2;
        context.beginPath();
    }

    function greenPen(context) {
        context.strokeStyle = 'rgb(0,255,0)';
        context.lineWidth = 2;
        context.beginPath();
    }
})();