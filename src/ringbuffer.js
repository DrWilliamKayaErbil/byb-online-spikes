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