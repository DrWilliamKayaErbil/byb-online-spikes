function passAudio(pcmData){
  var pcmArr = new Array();
  for(var i = 0; i < pcmData.length; i++){
    pcmArr[i] = pcmData[i];
  }
  var wr ={
    pcmdata: pcmArr
  };
  wr.pcmdata = pcmData;
  BackyardBrains.analyze.setWaveData(wr);
  BackyardBrains.analyze.redraw.trigger('redraw');
}
