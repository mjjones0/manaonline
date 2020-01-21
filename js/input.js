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
var OnScreenAttack;
var OnScreenZ;
var OnScreenX;
var ControllerA;
var ControllerX;

GAME.Input = function()
{
	setup_inputs();
	
	if (isMobile) {
		setup_buttons();
	} else {
		setup_keyboard_buttons();
		setup_gamepad_buttons();
	}

	window.addEventListener("gamepaddisconnected", gamepad_disconnected_handler);
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

GAME.Input.prototype.release = function()
{
	up.release();
	left.release();
	down.release();
	right.release();
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
	
	z_button.press = function () { 
		zPressed = true;
		OnScreenZ.texture = resources["img/keyboard_z_pressed.png"].texture;
	}
	z_button.release = function () { 
		zPressed = false; 
		OnScreenZ.texture = resources["img/keyboard_z.png"].texture;
	}
	x_button.press = function () { 
		console.log("X press");
		xPressed = true; 
		OnScreenX.texture = resources["img/keyboard_x_pressed.png"].texture;
	}
	x_button.release = function () {
		console.log("X release"); 
		xPressed = false; 
		OnScreenX.texture = resources["img/keyboard_x.png"].texture;
	}
}

function setup_buttons() {
	OnScreenWheel = new PIXI.Sprite(resources["img/mana_tree.png"].texture);
	OnScreenWheel.x = 4;
	OnScreenWheel.y = GAME.BASEHEIGHT - OnScreenWheel.height - 4;
	OnScreenWheel.interactive = true;
	OnScreenWheel.buttonMode = true;
	OnScreenWheel.center = {x: OnScreenWheel.width / 2 + 4, y: GAME.BASEHEIGHT - OnScreenWheel.height / 2 - 4};
	OnScreenWheel.outerBounds = {
		x: 0, 
		y: GAME.BASEHEIGHT - OnScreenWheel.height - 8, 
		width: OnScreenWheel.width + 8, 
		height: OnScreenWheel.height + 8
	};
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
	OnScreenRun.outerBounds = {
		x: GAME.BASEWIDTH - OnScreenRun.width - OnScreenRun.width / 4 - 4,
		y: GAME.BASEHEIGHT - OnScreenRun.height - OnScreenRun.height / 4 - 4,
		width: OnScreenRun.width + 8,
		height: OnScreenRun.height + 8
	};
	OnScreenRun.on('pointerdown', function () {
		zPressed = true;
	});
	OnScreenRun.on('pointerup', function () {
		zPressed = false;
	});
	OnScreenRun.on('pointermove', function (eventData) {
		var pX = eventData.data.global.x;
		var pY = eventData.data.global.y;
		if (rectContains(OnScreenRun, pX, pY)) {
			zPressed = true;
		} else if (rectContains(OnScreenRun.outerBounds, pX, pY)) {
			zPressed = false;
		}
	});
	
	OnScreenAttack = new PIXI.Sprite(resources["img/attack_icon.png"].texture);
	OnScreenAttack.x = OnScreenRun.x - OnScreenAttack.width - OnScreenAttack.width / 4;
	OnScreenAttack.y = GAME.BASEHEIGHT - OnScreenAttack.height - OnScreenAttack.height / 4;
	OnScreenAttack.outerBounds = {
		x: GAME.BASEWIDTH - OnScreenAttack.width - OnScreenAttack.width / 4 - 4,
		y: GAME.BASEHEIGHT - OnScreenAttack.height - OnScreenAttack.height / 4 - 4,
		width: OnScreenAttack.width + 8,
		height: OnScreenAttack.height + 8
	};
	OnScreenAttack.interactive = true;
	OnScreenAttack.buttonMode = true;
	OnScreenAttack.on('pointerdown', function () {
		xPressed = true;
	});
	OnScreenAttack.on('pointerup', function () {
		xPressed = false;
	});
	OnScreenAttack.on('pointermove', function (eventData) {
		var pX = eventData.data.global.x;
		var pY = eventData.data.global.y;
		if (rectContains(OnScreenAttack, pX, pY)) {
			xPressed = true;
		} else if (rectContains(OnScreenAttack.outerBounds, pX, pY)) {
			xPressed = false;
		}
	});
}

function setup_keyboard_buttons() {
	OnScreenZ = new PIXI.Sprite(resources["img/keyboard_z.png"].texture);
	OnScreenZ.x = 6;
	OnScreenZ.y = GAME.BASEHEIGHT - OnScreenZ.height - 6;
	
	OnScreenX = new PIXI.Sprite(resources["img/keyboard_x.png"].texture);
	OnScreenX.x = 6 + 2 + OnScreenZ.width;
	OnScreenX.y = GAME.BASEHEIGHT - OnScreenX.height - 6;
}

function setup_gamepad_buttons(){

	ControllerA = new PIXI.Sprite(resources["img/controller_a.png"].texture);
	ControllerA.x = 6;
	ControllerA.y = GAME.BASEHEIGHT - OnScreenZ.height - 6;

	ControllerX = new PIXI.Sprite(resources["img/controller_x.png"].texture);
	ControllerX.x = 6 + 2 + OnScreenZ.width;
	ControllerX.y = GAME.BASEHEIGHT - OnScreenX.height - 6;
}

function check_gamepad(){
	var gp = navigator.getGamepads()[0];
	if(!gamepad.on){
		if(!gp) return false;
		if(gp.axes[0] > 0.5 || gp.axes[0] < -0.5 || gp.axes[1] > 0.5 || gp.axes[1] < -0.5 ){
			gamepad.on = true;
			gamepad.updateHud = true;
		}
		if(!gamepad.on){
			return false;
		}
	}
    var axeLR = gp.axes[0];
    var axeUD = gp.axes[1];
    var currentZ = gp.buttons[0];
    var currentX = gp.buttons[2];



    if(axeLR < -0.5) {
		if( !(gamepad.axeLR < -0.5) ){
			left.press();
		}
		
    }
    else if(axeLR > 0.5) {
		if( !(gamepad.axeLR > 0.5) ){
			right.press();
		}

	}
	else{
		if( gamepad.axeLR < -0.5 || gamepad.axeLR > 0.5){
			left.release();
			right.release();
		}
	}

    if(axeUD < -0.5) {
		if( !(gamepad.axeUD < -0.5) ){
			up.press();
		}
    }
    else if(axeUD > 0.5) {
		if( !(gamepad.axeUD < -0.5) ){
			down.press();
		}
	}
	else{
		if( gamepad.axeUD < -0.5 || gamepad.axeUD > 0.5){
			up.release();
			down.release();
		}
	}

    if(currentX.pressed){
		if( !gamepad.previousX){
			x_button.press();
		}
	}
	else if (gamepad.previousX){
		x_button.release();
	}

    if(currentZ.pressed){
		if( !gamepad.previousZ){
			z_button.press();
		}
	}
	else if (gamepad.previousZ){
		z_button.release();
	}
	
	//update gamepad state
	gamepad.axeLR = axeLR;
	gamepad.axeUD = axeUD;
	gamepad.previousX = currentX.pressed;
	gamepad.previousZ = currentZ.pressed;

	return true;
}

function gamepad_disconnected_handler(){
	if(gamepad.on){

		gamepad.on = false;
		gamepad.updateHud = true;

    	up.release();
		left.release();
		down.release();
		right.release();
		x_button.release();
		z_button.release();
	}
}

GAME.Input.prototype.update = function(){
	check_gamepad();
}