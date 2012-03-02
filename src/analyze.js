(function (w) {

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
    that.context.lineJoin = 'round';
    that.context.save();
  };

  BackyardBrains.AnalyzeView.draw = function (audioData) {
    if (!(audioData instanceof Array)) {
      throw "Not an array";
    }
    context = BackyardBrains.AnalyzeView.context;
    context.beginPath();
    context.moveTo(0,0);
    $.each(audioData, function (index, value) {
      context.lineTo(remapValue(index, 0, audioData.length, 0, BackyardBrains.AnalyzeView.width),
                     remapValue(value, -32768, 32767, 0, BackyardBrains.AnalyzeView.height));
    });
    context.stroke();
  };
})(window);