(function (w) {

  BackyardBrains.AnalyzeView = {
      context: false,
      height: 0,
      width: 0
  };

  _.extend(BackyardBrains.AnalyzeView, Backbone.Events);

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
  };
})(window);