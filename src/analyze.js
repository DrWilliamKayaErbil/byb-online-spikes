(function (w) {

  PCM_MIN = -32768;
  PCM_MAX = 32767;
  BACKGROUND_UI_COLOR = 'rgb(64,128,64)';
  GREEN = 'rgb(0,255,0)';

  BackyardBrains.AnalyzeView = Backbone.View.extend({

    initialize: function() {
      _.bindAll(this, 'render', 'draw', 'setAmplification', 'setDrawRange', 'setWaveData');
      this.amplification = 1;
      this.canvas = $('#waveformCanvas').get(0);
      this.context = this.canvas.getContext('2d');
      this.height = this.canvas.height;
      this.width = this.canvas.width;
      this.x_axis = this.height / 2;
      this.context.lineJoin = 'round';
      this.context.lineCap = 'round';
      this.context.strokeStyle = GREEN;
      this.drawTickmarks();
      this.context.save();
      this.setDrawRange(0, 0);
      this.context.restore();
    },

    events: {
        'click #redrawForm': 'draw'
    },

    setAmplification: function (x) {
      this.amplification = x;
    },

    setDrawRange: function(start, end) {
      this.drawFrom = start;
      this.drawTo = end;
    },

    setWaveData: function(audioData) {
      this.audioData = audioData;
    },

    /*
    fillBackground: function() {
      this.fillStyle = 'rgb(0,0,0)';
      this.context.fillRect(0, 0, this.width, this.height);
    },
     */

    draw: function (audioData) {
      if (audioData == null) {
        audioData = this.audioData;
      }
      if (!(audioData instanceof Array)) {
        throw "Not an array";
      }
      this.context.clearRect(0,0,this.width,this.height);
      this.drawTickmarks();

      this.context.save();
      this.context.beginPath();
      this.context.moveTo(0, this.x_axis);
      if(this.drawTo == 0) {
        var mdrawTo = audioData.length;
      } else {
        var mdrawTo = this.drawTo;
      }
      for (var i = this.drawFrom; i < mdrawTo; i++) {
        this.context.lineTo(remapValue(i, this.drawFrom, mdrawTo, 0, this.width),
                            remapValue(audioData[i]*this.amplification, PCM_MIN*1.5, PCM_MAX*1.5, 0, this.height));
      }
      this.context.stroke();
      this.context.restore();
    },

    drawTickmarks: function () {
        for (var i = 0; i < 9; i++) {
            this.context.moveTo(0, i/8 * this.height);
            this.context.lineTo(10, i/8 * this.height);
            this.context.stroke();
        }
    },

    drawXAxis: function () {
      this.context.beginPath();
      this.context.moveTo(0, this.x_axis);
      this.context.lineTo(this.width, this.x_axis);
      this.context.stroke();
    }
  });

  function remapValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

}

AmplificationSlider = Backbone.View.extend();

)(window);
