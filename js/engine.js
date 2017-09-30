"use strict";

GAME.Engine = function()
{	
	GAME.player = new GAME.Player();
	GAME.level = new GAME.Level(this);
	GAME.input = new GAME.Input();
	GAME.audio = new GAME.Audio();

	this.view = new GAME.View(this);
}

GAME.Engine.prototype.start = function()
{
	GAME.level.load('demo_room_0');
}

GAME.Engine.prototype.update = function()
{
	GAME.time.update();
	GAME.level.update();
	
	this.view.update();
}













