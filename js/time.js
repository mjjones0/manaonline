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

    this.lastTime = currentTime;
}

GAME.time = new Time();