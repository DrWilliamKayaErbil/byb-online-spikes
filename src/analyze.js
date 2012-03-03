(function (w) {

  PCM_MIN = -32768;
  PCM_MAX = 32767;
  BACKGROUND_UI_COLOR = 'rgb(48,96,48)';
  GREEN = 'rgb(0,255,0)';

  BackyardBrains.AnalyzeView = Backbone.View.extend({

    initialize: function() {
      this.canvas = $('#waveformCanvas').get(0);
      this.context = this.canvas.getContext('2d');
      this.height = this.canvas.height;
      this.width = this.canvas.width;
      this.x_axis = this.height / 2;
      //this.fillBackground();
      this.context.lineJoin = 'round';
      this.context.save();
    },

    fillBackground: function() {
      this.fillStyle = 'rgb(0,0,0)';
      this.context.fillRect(0, 0, this.width, this.height);
    },

    draw: function (audioData) {
      if (!(audioData instanceof Array)) {
        throw "Not an array";
      }

      this.drawTickmarks();
      this.drawXAxis();

      this.context.strokeStyle = GREEN;
      this.context.beginPath();
      this.context.moveTo(0, this.x_axis);
      /*
       $.each(audioData, function (index, value) {
        datContext.lineTo(remapValue(index, 0, audioData.length, 0, this.width),
                            remapValue(value, PCM_MIN * 1.5, PCM_MAX * 1.5, 0, this.height));
       });
       */
      for (var i = 0; i < audioData.length; i++) {
        this.context.lineTo(remapValue(i, 0, audioData.length, 0, this.width),
                            remapValue(audioData[i], PCM_MIN * 1.5, PCM_MAX * 1.5, 0, this.height));
      }
      this.context.stroke();
    },
    
    drawTickmarks: function () {
    this.context.strokeStyle = BACKGROUND_UI_COLOR;
        for (var i = 0; i < 9; i++) {
            this.context.moveTo(0, i/8 * this.height);
            this.context.lineTo(5, i/8 * this.height);
            this.context.stroke();
        }
    },

    drawXAxis: function () {
      this.context.strokeStyle = BACKGROUND_UI_COLOR;
      this.context.beginPath();
      this.context.moveTo(0, this.x_axis);
      this.context.lineTo(this.width, this.x_axis);
      this.context.stroke();
    }
  });

  function remapValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

})(window);