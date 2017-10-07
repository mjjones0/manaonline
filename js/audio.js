"use strict";

GAME.Audio = function()
{
	this.music = {};
	this.sounds = {};
	
	this.music['path'] = new Audio("audio/path.mp3");
	this.music['dungeon'] = new Audio("audio/dungeon.mp3");
	this.music['boss'] = new Audio("audio/boss.mp3");
	
	this.sounds['slash_1'] = new Audio("audio/slash_1.wav");
	this.sounds['slashed_1'] = new Audio("audio/slash_2.wav");
	this.sounds['monster_death_1'] = new Audio("audio/death_0.wav");
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