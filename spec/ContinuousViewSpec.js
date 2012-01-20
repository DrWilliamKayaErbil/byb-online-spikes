describe('ContinuousView', function () {

             beforeEach(function () {
                            loadFixtures("canvas.html");
                        });
             
             it('exists on page load', function () {
                    expect(window.BackyardBrains).toBeDefined();
                    expect(window.BackyardBrains.ContinuousView).toBeDefined();
                });

             it('grabs the canvas context properly', function () {
                    var canvas = document.getElementById('waveformCanvas');
                    window.BackyardBrains.ContinuousView.setup(canvas);
                    expect(context).toBeDefined();
                });

             it('creates the draw function', function () {
                    expect(window.BackyardBrains.ContinuousView.draw).toBeDefined();
                    });
         });