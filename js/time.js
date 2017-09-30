"use strict";

var Time = function()
{
	this.DELTA_TIME = 1;	
	this.lastTime = Date.now();
    this.speed = 1;
}

Time.constructor = Time;

Time.prototype.update = function()
{
    var time = Date.now();
    var currentTime =  time;
    var passedTime = currentTime - this.lastTime;

	this.DELTA_TIME = (passedTime * this.speed) / 1000;
	
    //this.DELTA_TIME = ((passedTime) * 0.06);
    //this.DELTA_TIME *= this.speed;
    //if(this.DELTA_TIME > 2.3) this.DELTA_TIME = 2.3;

    this.lastTime = currentTime;
}

GAME.time = new Time();