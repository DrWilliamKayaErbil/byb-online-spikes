describe('Analyze View', function() {

  beforeEach(function() {
    loadFixtures('app.html');
    window.sampleData = [];
    this.a = new BackyardBrains.AnalyzeView;
    this.a.setWaveData([]);
  });

  it('Builds on the BackyardBrains namespace, which should be defined', function () {

    expect(window.BackyardBrains).toBeDefined();
    expect(window.BackyardBrains).not.toBeNull();

  });

  it('Allows us to set amplification', function() {
    expect(this.a.setAmplification).toBeDefined();
    this.a.setAmplification(500);
    expect(this.a.canvas.amplification).toEqual(500);
  });

  it('Can set the canvas\'s draw range.', function() {
    expect(this.a.setDrawRange).toBeDefined();
    this.a.setDrawRange(200,300);
    expect(this.a.canvas.drawFrom).toBe(200);
    expect(this.a.canvas.drawTo).toBe(300);
  });

  describe('Amplification Slider', function () {

    it('Defines a slider for the amplification view', function() {
      expect(BackyardBrains.AnalyzeView).toBeDefined();
      expect(this.a).toBeDefined();
      expect(this.a.ampslider).toBeDefined();
    });

    it('Changes the label appropriately when the amplification changes', function() {
      this.a.setAmplification(500);
      expect(this.a.canvas.amplification).toEqual(500);
      this.a.ampslider.trigger('amplification-change', 500);
      expect($('#amplificationAmt').val()).toEqual('500x');

    });

  });

  describe('Samples Shown Slider', function() {

    it('Defines a slider for the amount of samples show in the waveform', function () {
      expect(this.a).toBeDefined();
      expect(this.a.sampleslider).toBeDefined();
    });

    it('Changes the label when the sample size changes', function() {
      this.a.setDrawRange(200,300);
      this.a.sampleslider.trigger('sample-size-change', 200, 300);
      expect($('#numberOfSamplesShown').val()).toBe('2 ms');
    });

    it('defines a "setReasonableViewingWindow" function that makes the size less than 100% but greater than 20ms', function() {
      expect(this.a.sampleslider.setReasonableViewingWindow).toBeDefined();

      var mockData = [];

      _.each(_.range(10), function(num) {
        _.each(_.range(441), function (inum) {
          mockData.push(inum);
        });
      });

      console.log(mockData);

      this.a.setWaveData(mockData);
      this.a.sampleslider.$el.dragslider('values', 0, 0);
      this.a.sampleslider.$el.dragslider('values', 0, mockData.length);

      this.a.playButton.trigger('startplayback');

      start = $('#horizontalViewSizeSlider').dragslider('values')[0];
      end = $('#horizontalViewSizeSlider').dragslider('values')[1];

      expect(start).toBe(0);
      expect(end).not.toBe(0);
      expect(end).not.toBe(mockData.length);
      console.log($('#horizontalViewSizeSlider').dragslider('values'));

    });

  });

  describe('Redraw while dragging checkbox', function() {
    
    it('Shows a checkbox on the screen', function() {
      expect(this.a.redrawCheckbox.$el).toBeDefined();
      var cb = $('#redrawCheckbox').get(0);
      expect(cb.tagName).toBe('INPUT');
    });

    it('Is a member of the analyzer object', function() {
      expect(this.a.redrawCheckbox).toBeDefined();
    });

    it('sets state in the analyzer when clicked about whether or not to redraw while dragging sliders', function() {
      expect(this.a.sampleslider.redrawOnMove).toBe(false);
      expect(this.a.ampslider.redrawOnMove).toBe(false);

      this.a.redrawCheckbox.$el.trigger('click');
      
      expect(this.a.sampleslider.redrawOnMove).toBe(true);
      expect(this.a.ampslider.redrawOnMove).toBe(true);
    });
  });

  describe('Play button', function (){
    it('shows a button on the screen', function() {
      expect(this.a.playButton.$el).toBeDefined();
      expect(this.a.playButton.$el.html()).not.toBeNull();
    });

    it('triggers startplayback when it is called', function() {
      spyOn(this.a.playButton, 'trigger');
      this.a.playButton.$el.trigger('click');
      expect(this.a.playButton.trigger).toHaveBeenCalledWith('startplayback');
    });

  });


});