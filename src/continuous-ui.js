rb = new RingBuffer(44100/2);
rb.zeroFill();

function redrawMyRingbuffer() {
    var pcmArr = rb.getArray();
    var wr ={
        pcmdata: pcmArr
    };
    BackyardBrains.analyze.setWaveData(wr);
    BackyardBrains.analyze.redraw.trigger('redraw');
}

function passAudio(pcmData){
  for(var i = 0; i < pcmData.length; i++){
    rb.addEnd(pcmData[i]);
  }
}

var intervalID = setInterval(redrawMyRingbuffer, 33);