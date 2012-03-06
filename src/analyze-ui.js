function pcmToMs(samps) {
  return Math.round(samps/44.1);
}

function setTimeShown(from, to) {
  var timeDifference = to - from;
  $("#numberOfSamplesShown").val(pcmToMs(timeDifference) + ' ms');
  window.BackyardBrains.Analyzer.setDrawRange(from, to);
}

function setAmplificationShown(times) {
  window.BackyardBrains.Analyzer.setAmplification(times);
  $("#amplificationAmt").val(times + 'x');
}

$(document).ready(function() {
  window.BackyardBrains.Analyzer = new BackyardBrains.AnalyzeView;
  window.BackyardBrains.Analyzer.setWaveData(sampleData);

  $("#redrawButton").button();
  $("#redrawButton").click(function() {
    window.BackyardBrains.Analyzer.draw();
    return true;
  });
  $("#horizontalViewSizeSlider").slider({
    range: true,
    min: 0,
    max: sampleData.length,
    step: 44,
    values: [0, sampleData.length],
    slide: function( event, ui ) {
      setTimeShown(ui.values[0], ui.values[1]);
    }
  });
  setTimeShown($("#horizontalViewSizeSlider").slider("values", 0),
               $("#horizontalViewSizeSlider").slider("values", 1));

  $("#amplificationSlider").slider({
    min: 0.1,
    max: 3,
    step: 0.1,
    value: 1,
    orientation: "vertical",
    slide: function( event, ui ) {
      setAmplificationShown(ui.value);
    }
  });
  setAmplificationShown($("#amplificationSlider").slider("value"));
});