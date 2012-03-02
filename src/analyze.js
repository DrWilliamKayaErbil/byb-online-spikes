(function (w) {

  PCM_MIN = -32768;
  PCM_MAX = 32767;
  BACKGROUND_UI_COLOR = 'rgb(48,96,48)';
  GREEN = 'rgb(0,255,0)';

  BackyardBrains.AnalyzeView = {
      context: false,
      height: 0,
      width: 0
  };

  _.extend(BackyardBrains.AnalyzeView, Backbone.Events);

  function remapValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  BackyardBrains.AnalyzeView.setup = function (canvasname) {
    that = BackyardBrains.AnalyzeView;
    
    canvas = $('#'+canvasname).get(0);
    that.context = canvas.getContext('2d');
    that.height = canvas.height;
    that.width = canvas.width;

    that.x_axis = that.height/2;
    
    that.context.fillStyle = 'rgb(0,0,0)';
    that.context.fillRect(0,0,that.width,that.height);
    that.context.lineJoin = 'round';
    that.context.save();
  };

  BackyardBrains.AnalyzeView.draw = function (audioData) {
    if (!(audioData instanceof Array)) {
      throw "Not an array";
    }

    drawTickmarks();
    drawXAxis();

    context.strokeStyle = GREEN;
    context = BackyardBrains.AnalyzeView.context;
    context.beginPath();
    context.moveTo(0, BackyardBrains.AnalyzeView.x_axis);
    $.each(audioData, function (index, value) {
      context.lineTo(remapValue(index, 0, audioData.length, 0, BackyardBrains.AnalyzeView.width),
                     remapValue(value, PCM_MIN * 1.5, PCM_MAX * 1.5, 0, BackyardBrains.AnalyzeView.height));
    });
    context.stroke();
  };

  function drawXAxis() {
    context = BackyardBrains.AnalyzeView.context;
    context.strokeStyle = BACKGROUND_UI_COLOR;
    context.beginPath();
    context.moveTo(0, BackyardBrains.AnalyzeView.x_axis);
    context.lineTo(BackyardBrains.AnalyzeView.width, BackyardBrains.AnalyzeView.x_axis);
    context.stroke();
  };

  function drawTickmarks (context) {
    context = BackyardBrains.AnalyzeView.context;
    context.strokeStyle = BACKGROUND_UI_COLOR;
        for (var i = 0; i < 9; i++) {
            context.moveTo(0, i/8 * BackyardBrains.AnalyzeView.height);
            context.lineTo(5, i/8 * BackyardBrains.AnalyzeView.height);
            context.stroke();
        }
 }

})(window);