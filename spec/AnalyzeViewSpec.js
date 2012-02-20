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

  it('makes sure there is a canvas available to draw on', function() {
    var context = $("#waveformCanvas").get(0).getContext('2d');
    expect(context).not.toBeNull();
  });

});