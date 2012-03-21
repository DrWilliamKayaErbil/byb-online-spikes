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

  });

  describe('Redraw while dragging checkbox', function() {
    
    it('Shows a checkbox on the screen', function() {
      expect($('#redrawCheckbox').get(0)).toBeDefined();
    });

  });

});