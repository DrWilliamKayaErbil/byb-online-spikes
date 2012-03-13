describe('Analyze View', function() {

  beforeEach(function() {
    loadFixtures('canvas.html','vslider.html', 'hslider.html', 'title.html');
    this.analyzer = new window.BackyardBrains.AnalyzeView;
  });

  it('Builds on the BackyardBrains namespace, which should be defined', function () {
    expect(window.BackyardBrains).toBeDefined();
    expect(window.BackyardBrains).not.toBeNull();
  });

  it('Creates the AnalyzeView namespace within the BackyardBrains namespace', function () {
    expect(window.BackyardBrains.AnalyzeView).toBeDefined();
    expect(window.BackyardBrains.AnalyzeView).not.toBeNull();    
  });

  it('Extends backbone for easy event-planning', function () {
    expect(this.analyzer.on).toBeDefined();
  });

  it('Defines a setup function which accepts the name of a canvas element', function () {
    expect(this.analyzer.context).not.toBeNull();
    expect(this.analyzer.height).not.toEqual(0);
    expect(this.analyzer.width).not.toEqual(0);

  });

  it('Defines a "draw" function that accepts an array', function() {
    var derper = this.analyzer;
    expect(this.analyzer.draw).toBeDefined();
    expect(function(){
      derper.draw(1);
    }).toThrow("Not an array");
    expect(function(){
      derper.draw("derp");
    }).toThrow("Not an array");
    testarray = new Array();
    for (i = 0; i <= this.analyzer.width; i++) {
      testarray[i] = i;
    }
    expect(this.analyzer.draw(testarray)).toBeUndefined();
  });

  describe('Amplification Slider', function () {

    it('Defines a slider for the amplification view', function() {
      expect(window.BackyardBrains.AnalyzeView.AmplificationSlider).toBeDefined();
    });

    it('Displays itself on render.', function () {
      var as = new BackyardBrains.AnalyzeView.AmplificationSlider;
      console.log(as.render().el);
      expect(as.render()).not.toBeNull();
    });

  });

  describe('Samples Shown Slider', function() {
    it('Defines a slider for the amount of samples show in the waveform', function () {
      expect(window.BackyardBrains.AnalyzeView.SamplesShownSlider).toBeDefined();
    });
    it('Displayes some html on render', function() {
      var ss = new BackyardBrains.AnalyzeView.SamplesShownSlider;
      console.log(ss.render().el);
      expect(ss.render()).not.toBeNull();
    });
  });


});