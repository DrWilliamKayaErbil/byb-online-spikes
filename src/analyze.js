$(function () {

  PCM_MIN = -32768;
  PCM_MAX = 32767;
  BACKGROUND_UI_COLOR = 'rgb(64,128,64)';
  GREEN = 'rgb(0,255,0)';

  function pcmToMs(samps) {
    return Math.round(samps/44.1);
  }

  CanvasView = Backbone.View.extend({

    el: 'waveformCanvas',

    initialize: function() {
      _.bindAll(this, 'render', 'draw');
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
      this.drawFrom = 0;
      this.drawTo = 0;
      this.context.restore();
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
    }
  });
  BackyardBrains.CanvasView = CanvasView;  

  function remapValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  AmplificationSlider = Backbone.View.extend({
    el: '#amplificationSlider',
    setAmplificationShown: function (times) {
      $('#amplificationAmt').val(times + 'x');
    },
    initialize: function() {
      this.on('amplification-change', this.setAmplificationShown, this);
      this.$el.slider({
        min: 0.1,
        max: 3,
        step: 0.1,
        value: 1,
        orientation: "vertical",
        slide: _.bind( function(event,ui){
          this.trigger('amplification-change',ui.value);},this),
        change: _.bind(function(){
          this.trigger('redraw');},this)
      });
      this.setAmplificationShown(1);
    }
  });
  BackyardBrains.AmplificationSlider = AmplificationSlider;

  SamplesShownSlider = Backbone.View.extend({
    el: '#samplesShownHolder',
    setTimeShown: function(from, to) {
      var timeDifference = to - from;
      $("#numberOfSamplesShown").val(pcmToMs(timeDifference) + ' ms');
    },
    initialize: function() {
      _.bindAll(this, 'setTimeShown', 'initialize');
      this.on('sample-size-change', this.setTimeShown, this);
      $("#horizontalViewSizeSlider").slider({
        range: true,
        min: 0,
        max: sampleData.length,
        step: 44,
        values: [0, sampleData.length],
        slide: _.bind(function(event,ui){this.trigger('sample-size-change',ui.values[0],ui.values[1]);},this),
        change: _.bind(function() { this.trigger('redraw'); },this)
      });
      this.setTimeShown(
        $("#horizontalViewSizeSlider").slider("values", 0),
        $("#horizontalViewSizeSlider").slider("values", 1));
    }
  });
  BackyardBrains.SamplesShownSlider = SamplesShownSlider;
  
  RedrawButton = Backbone.View.extend({
    el: '#redrawButton',
    initialize: function () {

      this.$el.button();
      this.$el.click(_.bind(function(){this.trigger('redraw');}, this));
    }
  });
  BackyardBrains.RedrawButton = RedrawButton;

  AnalyzeView = Backbone.View.extend({
    el: $('#appContainer'),
    initialize: function (){
      this.render();
      this.canvas = new CanvasView;
      this.setWaveData = function(data){
        this.canvas.audioData = data;
      };

      this.ampslider = new AmplificationSlider;
      this.ampslider.on('redraw', this.canvas.draw);
      this.ampslider.on('amplification-change', this.setAmplification, this);

      this.sampleslider = new SamplesShownSlider;
      this.sampleslider.on('redraw', this.canvas.draw);
      this.sampleslider.on('sample-size-change', this.setDrawRange, this);

      this.redraw = new RedrawButton;
      this.redraw.on('redraw', this.canvas.draw);

    },
    setDrawRange: function(from, to) {
      this.canvas.drawFrom = from;
      this.canvas.drawTo = to;
    },
    setAmplification: function(times) {
      this.canvas.amplification = times;
    }
  });
  BackyardBrains.AnalyzeView = AnalyzeView;

  BackyardBrains.analyze = new AnalyzeView;
});

