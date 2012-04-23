$(function () {

  function WaveReader(file) {
    this.file = file;

    this.doneReadingCallback = function() {
      // overwrite me
      return null;
    };

    this.parse = function(){
      this.reader = new FileReader();
      curr_obj = this;
      this.reader.onloadend = function(event){
        if(event.target.readyState == FileReader.DONE){
          var arrayView = new Int16Array(event.target.result);
          var a = [];
          for (i=22; i<arrayView.length; i++){
            a.push(arrayView[i]);
          }
          curr_obj.pcmdata = a;
          curr_obj.doneReadingCallback();
        }
      };
      console.log(file);
      this.reader.readAsArrayBuffer(file);
    }
  }
  window.BackyardBrains.WaveReader = WaveReader;

  PCM_MIN = -32768;
  PCM_MAX = 32767;
  BACKGROUND_UI_COLOR = 'rgb(64,128,64)';
  GREEN = 'rgb(0,255,0)';

  function pcmToMs(samps) {
    return Math.round(samps/44.1);
  }

  function msToPcm(ms) {
    return Math.round(44.1 * ms);
  }

  function remapValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  CanvasView = Backbone.View.extend({

    el: '#waveformCanvas',

    initialize: function() {
      _.bindAll(this, 'render', 'draw');
      this.amplification = 1;
      this.canvas = this.$el.get(0);
      if (this.canvas.getContext('experimental-webgl') == null) {
        this.context = this.canvas.getContext('2d');
      } else {
        WebGL2D.enable(this.canvas);
        this.context = this.canvas.getContext('webgl-2d');
      }
      this.height = this.canvas.height;
      this.width = this.canvas.width;
      this.x_axis = this.height / 2;
      //this.context.save();
      this.context.lineJoin = 'round';
      this.context.lineCap = 'round';
      this.context.strokeStyle = GREEN;
      this.context.clearRect(0,0,this.width,this.height);
      this.context.fillStyle = 'rgb(0,0,0)';
      this.context.fillRect(0,0,this.width, this.height);
      this.drawTickmarks();
      this.drawFrom = 0;
      this.drawTo = 0;
    },

    draw: function () {

      audioData = this.audioData;
      if (!(audioData instanceof Array)) {
        throw "Not an array";
      }

      this.context.clearRect(0,0,this.width,this.height);
      this.context.fillStyle = 'rgb(0,0,0)';
      this.context.fillRect(0,0,this.width, this.height);
      this.drawTickmarks();

      this.context.beginPath();
      this.context.moveTo(0, this.x_axis);

      if(this.drawTo == 0) {
        var mdrawTo = audioData.length;
      } else {
        var mdrawTo = this.drawTo;
      }

      for (var i = this.drawFrom; i < mdrawTo; i++) {
        this.context.lineTo(remapValue(i, this.drawFrom, mdrawTo, 0, this.width),
                            remapValue(audioData[i]*this.amplification,
                                       PCM_MIN*1.5, PCM_MAX*1.5,
                                       0, this.height));
      }
      this.context.stroke();
      this.context.restore();
    },

    drawTickmarks: function () {
      this.context.beginPath();
      for (var i = 0; i < 9; i++) {
        this.context.moveTo(0, i/8 * this.height);
        this.context.lineTo(10, i/8 * this.height);
        this.context.stroke();
      }
    }
  });

  AmplificationSlider = Backbone.View.extend({
    el: '#amplificationSlider',

    setAmplificationShown: function (times) {
      $('#amplificationAmt').val(times + 'x');
      if(this.redrawOnMove) {
        this.trigger('redraw');
      }
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

  SamplesShownSlider = Backbone.View.extend({
    el: '#samplesShownHolder',

    setTimeShown: function(from, to) {
      var timeDifference = to - from;
      $("#numberOfSamplesShown").val(pcmToMs(timeDifference) + ' ms');
      if(this.redrawOnMove) {
        this.trigger('redraw');
      }
    },

    initialize: function() {
      _.bindAll(this, 'setTimeShown', 'initialize');

      this.on('sample-size-change', this.setTimeShown, this);

      $("#horizontalViewSizeSlider").dragslider({
        range: true,
        animate: true,
        rangeDrag: true,
        min: 0,
        max: 441000,
        step: 44,
        values: [0, 441000],
        slide: _.bind(function(event,ui){
          this.trigger('sample-size-change',ui.values[0],ui.values[1]);
        },this),
        stop: _.bind(function(event, ui) {
          this.trigger('redraw');
        }, this),
        change: _.bind(function(event, ui) {
          this.trigger('sample-size-change',ui.values[0],ui.values[1]);
        },this)
      });

    },

    setSliders : function(begin, end) {
      $("#horizontalViewSizeSlider").dragslider('option', "max", end);
      $("#horizontalViewSizeSlider").dragslider("values", [begin, end]);
      $("#horizontalViewSizeSlider").dragslider('refresh');

      this.setTimeShown(
        $("#horizontalViewSizeSlider").dragslider("values", 0),
        $("#horizontalViewSizeSlider").dragslider("values", 1));
    },

    setReasonableViewingWindow: function(sampleData) {
      var start = $('#horizontalViewSizeSlider').dragslider('values')[0];
      var end = $('#horizontalViewSizeSlider').dragslider('values')[1];

      var length = end - start;

      if(length > sampleData.length/50){
        length = sampleData.length/50;
      }
      // Make sure we are at least 20 ms
      if(length < 882) {
        length = 882;
      }

      $('#horizontalViewSizeSlider').dragslider('values', [0, length]);
    },

    stepTime: function(ms) {
      var start = $('#horizontalViewSizeSlider').dragslider('values')[0];
      var end = $('#horizontalViewSizeSlider').dragslider('values')[1];
      start += msToPcm(ms);
      end += msToPcm(ms);
      if (end >= $('#horizontalViewSizeSlider').dragslider('option', 'max')) {
        end = $('#horizontalViewSizeSlider').dragslider('option', 'max');
        this.trigger('stop-playback');
      }
      $('#horizontalViewSizeSlider').dragslider('values', [start, end]);
      this.trigger('sample-size-change', start, end);
    }

  });

  RedrawButton = Backbone.View.extend({
    el: '#redrawButton',

    initialize: function () {
      this.$el.button();
    },

    events : {
      'click': 'triggerRedraw'
    },

    'triggerRedraw' : function() {
      this.trigger('redraw');
    }
  });

  PlayButton = Backbone.View.extend({
    el: '#playback',

    initialize: function() {
      this.$el.button();
    },

    events: {
      'click' : 'startplayback'
    },

    startplayback: function() {
      this.trigger('start-playback');
    }
  });

  RedrawCheckbox = Backbone.View.extend({
    el: '#redrawCheckbox',

    events: {
      'change' : 'checkState'
    },

    checkState: function(e) {
      this.trigger('redrawOnMove', e.currentTarget.checked);
    }
  });

  AnalyzeView = Backbone.View.extend({
    el: '#appContainer',

    isPlaying: false,

    initialize: function (){

      this.wavereader = null;

      this.canvas = new CanvasView;

      this.ampslider = new AmplificationSlider;
      this.ampslider.on('redraw', this.canvas.draw);
      this.ampslider.on('amplification-change', this.setAmplification, this);

      this.sampleslider = new SamplesShownSlider;
      this.sampleslider.on('redraw', this.canvas.draw);
      this.sampleslider.on('sample-size-change', this.setDrawRange, this);
      this.sampleslider.on('stop-playback', this.stopPlayback, this);

      this.redraw = new RedrawButton;
      this.redraw.on('redraw', this.canvas.draw);

      this.redrawCheckbox = new RedrawCheckbox;
      this.redrawCheckbox.on('redrawOnMove', this.setRedrawOnMove, this);
      this.redrawCheckbox.trigger('redrawOnMove', false);

      this.playButton = new PlayButton;
      this.playButton.on('start-playback', this.startPlayback, this);

    },

    setRedrawOnMove: function(state) {
      this.sampleslider.redrawOnMove = state;
      this.ampslider.redrawOnMove = state;
    },

    setWaveData: function(data){
      this.canvas.audioData = data.pcmdata;
      this.wavereader = data;
      this.sampleslider.setSliders(0, data.pcmdata.length);
    },

    setDrawRange: function(from, to) {
      this.canvas.drawFrom = from;
      this.canvas.drawTo = to;
    },

    setAmplification: function(times) {
      this.canvas.amplification = times;
    },

    playing : function(oldtime) {
      var pl = _.bind(this.playing, this);
      currentTime = new Date().getTime();
      this.sampleslider.stepTime(currentTime - oldtime);
      if(this.isPlaying) {
        _.delay(pl, 33, currentTime);
      }
    },

    startPlayback: function() {
      this.isPlaying = true;
      this.sampleslider.setReasonableViewingWindow(this.canvas.audioData);
      currentTime = new Date().getTime();

      var reader = new FileReader();
      reader.onload = function(file){
        var snd = new Audio(file.target.result);
        snd.play();
      }
      var dataUrl = reader.readAsDataURL(this.wavereader.file);
      this.playing(currentTime);
    },

    stopPlayback: function() {
      this.isPlaying = false;
    }

  });
  BackyardBrains.AnalyzeView = AnalyzeView;

  BackyardBrains.analyze = new AnalyzeView;
});
