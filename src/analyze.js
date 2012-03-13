$(function () {

  PCM_MIN = -32768;
  PCM_MAX = 32767;
  BACKGROUND_UI_COLOR = 'rgb(64,128,64)';
  GREEN = 'rgb(0,255,0)';

  CanvasView = Backbone.View.extend({

    el: 'waveformCanvas',

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

    draw: function () {
      audioData = this.audioData;
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
  BackyardBrains.CanvasView = CanvasView;  

  function remapValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  AmplificationSlider = Backbone.View.extend({
    el: 'amplificationSlider',
    initialize: function() {
      $("#amplificationSlider").slider({
        min: 0.1,
        max: 3,
        step: 0.1,
        value: 1,
        orientation: "vertical",
        slide: function( event, ui ) {
          setAmplificationShown(ui.value);
        },
        change: function() {
          window.BackyardBrains.Analyzer.draw();
        }
      });
    }
  });
  BackyardBrains.AmplificationSlider = AmplificationSlider;

  SamplesShownSlider = Backbone.View.extend({
    el: 'samplesShownHolder',
    initialize: function() {
      $("#horizontalViewSizeSlider").slider({
        range: true,
        min: 0,
        max: sampleData.length,
        step: 44,
        values: [0, sampleData.length],
        slide: function( event, ui ) {
          setTimeShown(ui.values[0], ui.values[1]);
        },
        change: function() {
          window.BackyardBrains.Analyzer.draw();
        }
      });
      setTimeShown($("#horizontalViewSizeSlider").slider("values", 0),
                   $("#horizontalViewSizeSlider").slider("values", 1));
    }
  });
  BackyardBrains.SamplesShownSlider = SamplesShownSlider;
  
  RedrawButton = Backbone.View.extend({
    el: 'redrawButton',
    events: {
      "click input#redrawButton" : "redrawWave"
    },
    redrawWave: function () {
      console.log('not yet implemented');
      alert('derp');
      // do something here.
    },
    render: function() {
      $(this.el).button();
    }
  });
  BackyardBrains.RedrawButton = RedrawButton;

  AnalyzeView = Backbone.View.extend({
    el: 'appContainer',
    initialize: function (){
      this.render();
      this.canvas = new CanvasView;
      this.setWaveData = function(data){
        this.canvas.setWaveData(data);
      };
      this.draw = function () {
        this.canvas.draw();
      };
      this.ampslider = new AmplificationSlider;
      this.sampleslider = new SamplesShownSlider;
    }
  });
  BackyardBrains.AnalyzeView = AnalyzeView;

});

