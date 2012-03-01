describe('Analyze View', function() {

  beforeEach(function() {
    loadFixtures('canvas.html');
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
    expect(window.BackyardBrains.AnalyzeView.on).toBeDefined();
  });

  it('Defines a setup function which accepts the name of a canvas element', function () {
    av = window.BackyardBrains.AnalyzeView;
    expect(av.setup).toBeDefined();
    av.setup('waveformCanvas');
    expect(av.context).not.toBeNull();
    expect(av.height).not.toEqual(0);
    expect(av.width).not.toEqual(0);

  });

  it('makes sure there is a canvas available to draw on', function() {
    var context = $("#waveformCanvas").get(0).getContext('2d');
    expect(context).not.toBeNull();
  });

  it('Defines a "draw" function that accepts an array', function() {
    expect(window.BackyardBrains.AnalyzeView.draw).toBeDefined();
    expect(function(){
      window.BackyardBrains.AnalyzeView.draw(1);
    }).toThrow("Not an array");
    expect(function(){
      window.BackyardBrains.AnalyzeView.draw("derp");
    }).toThrow("Not an array");
  });

  

});