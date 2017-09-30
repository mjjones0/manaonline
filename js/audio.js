"use strict";

GAME.Audio = function()
{
	this.music = {};
	this.sounds = {};
	
	this.music['path'] = new Audio("audio/path.mp3");
}

GAME.Audio.constructor = GAME.Audio;

GAME.Audio.prototype.playMusic = function(name, loop, volume)
{
	this.music[name].volume = volume;
	this.music[name].play();
	if (loop) {
		this.music[name].addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);
	}
}

GAME.Audio.prototype.playSound = function(name, volume)
{
	this.sounds[name].volume = volume;
	this.sounds[name].play();
}