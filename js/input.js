"use strict";

var left  = keyboard(37),
	up    = keyboard(38),
	right = keyboard(39),
	down  = keyboard(40),
	z_button = keyboard(90),
	x_button = keyboard(88);
var leftPressed  = false,
	rightPressed = false,
	upPressed    = false,
	downPressed  = false,
	zPressed = false,
	xPressed = false;
GAME.dirs = [];
var OnScreenDPad = new Array(4);
var OnScreenWheel;
var OnScreenRun;

GAME.Input = function()
{
	setup_inputs();
	
	if (isMobile) {
		setup_buttons();
	}
}

GAME.Input.constructor = GAME.Input;

function circlePadMove(pX, pY) 
{
	if (rectContains(OnScreenWheel, pX, pY)) {
		var V = {x: pX - OnScreenWheel.center.x, y: pY - OnScreenWheel.center.y};
		var angle = Math.atan2(V.y, V.x) * GAME.RADIANSTOANGLE;
		
		right.release();
		left.release();
		down.release();
		up.release();
		
		if (angle > -22.5 && angle < 22.5) {
			right.press();
		} else if (angle < -22.5 && angle > -67.5) {
			right.press();
			up.press();
		} else if (angle < -67.5 && angle > -112.5) {
			up.press();
		} else if (angle < -112.5 && angle > -157.5) {
			up.press();
			left.press();
		} else if (angle < -157.5 || angle > 157.5) {
			left.press();
		} else if (angle < 157.5 && angle > 112.5) {
			left.press();
			down.press();
		} else if (angle < 112.5 && angle > 67.5) {
			down.press();
		} else if (angle < 67.5 && angle > 22.5) {
			down.press();
			right.press();
		} else {
			alert("PROBLEMATIC MOVEMENT ON CIRCLE PAD PLEASE EXPLORE");
		}
	} else if (rectContains(OnScreenWheel.outerBounds, pX, pY)) {
		right.release();
		left.release();
		down.release();
		up.release();
	}
}

function setup_inputs() {
	left.press = function() {
		GAME.dirs.push(left);
	}

	left.release = function() {
		GAME.dirs.remove(left);
	}
	
	right.press = function() {
		GAME.dirs.push(right);
	}

	right.release = function() {
		GAME.dirs.remove(right);
	}
	
	up.press = function() {
		GAME.dirs.push(up);
	}
	
	up.release = function() {
		GAME.dirs.remove(up);
	}
	
	down.press = function() {
		GAME.dirs.push(down);
	}
	
	down.release = function() {
		GAME.dirs.remove(down);
	}
	
	z_button.press = function () { zPressed = true; }
	z_button.release = function () { zPressed = false; }
	x_button.press = function () { xPressed = true; }
	x_button.release = function () { xPressed = false; }
}

function setup_buttons() {
	OnScreenWheel = new PIXI.Sprite(resources["img/mana_tree.png"].texture);
	OnScreenWheel.x = 4;
	OnScreenWheel.y = GAME.BASEHEIGHT - OnScreenWheel.height - 4;
	OnScreenWheel.interactive = true;
	OnScreenWheel.buttonMode = true;
	OnScreenWheel.center = {x: OnScreenWheel.width / 2 + 4, y: GAME.BASEHEIGHT - OnScreenWheel.height / 2 - 4};
	OnScreenWheel.outerBounds = {x: 0, y: GAME.BASEHEIGHT - OnScreenWheel.height - 8, width: OnScreenWheel.width + 8, height: OnScreenWheel.height + 8};
	OnScreenWheel.on('pointerdown', function (eventData) {
		var pX = eventData.data.global.x;
		var pY = eventData.data.global.y;
		circlePadMove(pX, pY);
	});
	OnScreenWheel.on('pointermove', function (eventData) {
		var pX = eventData.data.global.x;
		var pY = eventData.data.global.y;
		circlePadMove(pX, pY);
	});
	OnScreenWheel.on('pointerup', function () {
		up.release();
		left.release();
		down.release();
		right.release();
	});
	
	OnScreenRun = new PIXI.Sprite(resources["img/run_icon.png"].texture);
	OnScreenRun.x = GAME.BASEWIDTH - OnScreenRun.width - OnScreenRun.width / 4;
	OnScreenRun.y = GAME.BASEHEIGHT - OnScreenRun.height - OnScreenRun.height / 4;
	OnScreenRun.interactive = true;
	OnScreenRun.buttonMode = true;
	OnScreenRun.on('pointerdown', function () {
		zPressed = true;
	});
	OnScreenRun.on('pointerup', function () {
		zPressed = false;
	});
}


