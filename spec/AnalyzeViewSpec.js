describe('Analyze View', function() {

  beforeEach(function() {
    loadFixtures('canvas.html');
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

  

});