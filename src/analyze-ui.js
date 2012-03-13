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
});