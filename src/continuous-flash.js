soundManager.useHTML5Audio = false;
soundManager.preferFlash = true;
soundManager.flashVersion = 9;
soundManager.flashPollingInterval = 1;
soundManager.url = 'sndmgr/swf/';
soundManager.useHighPerformance = true;
soundManager.useConsole = true;

function RingBuffer(n) {
    this.buffer = new Array(n);
    this.beginning = -1;
    this.end = -1;
}

RingBuffer.prototype.addEnd = function (num) {
    if (this.end >= 0) {
        ++this.end;
        if (this.end >= this.buffer.length)
	    this.end = 0;
	if (this.end == this.beginning)
	    this.beginning++;
	if (this.beginning >= this.buffer.length)
	    this.beginning = 0;
    } else {
	this.beginning = 0;
        this.end = 0;
    }
    this.buffer[this.end] = num;
};

RingBuffer.prototype.add = function (nums) {
    for (var i = 0; i < nums.length; i++) {
        this.addEnd(nums[i]);
    }
};

RingBuffer.prototype.getArray = function () {
    if (this.beginning == 0) {
        /*
	returnArray = new Array(this.buffer.length);
        for (i = 0; i<returnArray.length; i++) {
            returnArray[i] = this.buffer[i];
        }
        */
	return this.buffer;
    }
    var returnArray = new Array();
    for(i = this.beginning; i < this.buffer.length; i++) {
        returnArray.push(this.buffer[i]);
    }
    //System.arraycopy(buffer, beginning, returnArray, 0, buffer.length - beginning);
    for(i=0; i< this.end+1; i++) {
        returnArray.push(this.buffer[i]);
    }
    // System.arraycopy(buffer, 0, returnArray, buffer.length - beginning, end + 1);
    return returnArray;
};

RingBuffer.prototype.zeroFill = function () {
    for (var i = 0; i < this.buffer.length; i++) {
	this.addEnd(0);
    }
};

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
