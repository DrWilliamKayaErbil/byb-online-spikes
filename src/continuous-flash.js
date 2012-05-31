soundManager.useHTML5Audio = false;
soundManager.preferFlash = true;
soundManager.flashVersion = 9;
soundManager.flashPollingInterval = 1;
soundManager.url = 'sndmgr/swf/';
soundManager.useHighPerformance = true;
soundManager.useConsole = true;

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

soundManager.onready(function(){
    var mySound = soundManager.createSound({
        id: 'aSound',
        useWaveformData: true,
        whileplaying: function() {
            for(var i = 0; i<256; i++) {
                rb.addEnd(this.waveformData.left[i] * 32768);
            }
            // var pcmArr = this.waveformData.left;
        },
        url: 'sndmgr/beg.mp3'
    });
    mySound.play();
    var intervalID = setInterval(redrawMyRingbuffer, 33);
});
