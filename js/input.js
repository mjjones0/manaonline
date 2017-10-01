"use strict";

var left  = keyboard(37),
	up    = keyboard(38),
	right = keyboard(39),
	down  = keyboard(40);
var leftPressed  = false,
	rightPressed = false,
	upPressed    = false,
	downPressed  = false;
var dirs = [];
var OnScreenDPad = new Array(4);
var OnScreenWheel;

GAME.Input = function()
{
	setup_8dir_inputs();
	//setup_inputs();
	
	if (isMobile) {
		setup_buttons();
	}
}

GAME.Input.constructor = GAME.Input;

function onPointerMove(eventData)
{
	var pX = eventData.data.global.x;
	var pY = eventData.data.global.y;
	circlePadMove(pX, pY);
	
	//var top_side = GAME.DPAD_Y_OFFSET - 48 - 24 - 48 - 10;
	//var right_side = GAME.DPAD_X_OFFSET + 48 + 24 + 48 + 10;

	// pseudo quad tree LUL
	//if (pY > top_side && pX < right_side) {
		// account for anchor for sprite test (removed on circle test)
		//pX += 24;
		//pY += 24;

		/*
		if (rectContains(OnScreenDPad[0], pX, pY) || circleContains(OnScreenDPad[0].x, OnScreenDPad[0].y - 24, 48, pX - 24, pY - 24)) { 
			up.press();
		} else { 
			up.release(); 
		}; 
		
		if (rectContains(OnScreenDPad[1], pX, pY) || circleContains(OnScreenDPad[1].x, OnScreenDPad[1].y + 24, 48, pX - 24, pY - 24)) { 
			down.press() 
		} else { 
			down.release(); 
		}; 
		
		if (rectContains(OnScreenDPad[2], pX, pY) || circleContains(OnScreenDPad[2].x - 24, OnScreenDPad[2].y, 48, pX - 24, pY - 24)) { 
			left.press() 
		} else { 
			left.release(); 
		};
		
		if (rectContains(OnScreenDPad[3], pX, pY) || circleContains(OnScreenDPad[3].x + 24, OnScreenDPad[3].y, 48, pX - 24, pY - 24)) { 
			right.press() 
		} else { 
			right.release(); 
		}; 
		*/
	//}
}

function onPointerDown(eventData)
{
	var pX = eventData.data.global.x;
	var pY = eventData.data.global.y;
	circlePadMove(pX, pY);
	
	/*
	var top_side = GAME.DPAD_Y_OFFSET - 48 - 24 - 48;
	var right_side = GAME.DPAD_X_OFFSET + 48 + 24 + 48;
	if (pY < top_side || pX > right_side) return; 
	if (circleContains(OnScreenDPad[0].x,      OnScreenDPad[0].y - 24, 48, pX, pY)) up.press(); 
	if (circleContains(OnScreenDPad[1].x,      OnScreenDPad[1].y + 24, 48, pX, pY)) down.press(); 
	if (circleContains(OnScreenDPad[2].x - 24, OnScreenDPad[2].y,      48, pX, pY)) left.press(); 
	if (circleContains(OnScreenDPad[3].x + 24, OnScreenDPad[3].y,      48, pX, pY)) right.press(); 
	*/
}

function circlePadMove(pX, pY) 
{
	if (rectContains(OnScreenWheel, pX, pY)) {
		// calculate normal from center
		var V = {x: pX - OnScreenWheel.center.x, y: pY - OnScreenWheel.center.y};
		var angle = Math.atan2(V.y, V.x) * GAME.RADIANSTOANGLE;
		//console.log(angle);
		
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
			alert("YOU JUST GOT MEMED!");
		}
	}
}

GAME.Input.prototype.bindToContainer = function(container)
{
	container.interactive = true;
	container.on('pointermove', onPointerMove);
	container.on('pointerdown', onPointerDown);
	
	if (isMobile) {
		container.on('pointerup', function () {
			up.release();
			left.release();
			down.release();
			right.release();
		});
	}
}

GAME.Input.prototype.release = function()
{
	up.release();
	left.release();
	down.release();
	right.release();
}

function setup_8dir_inputs() {
	left.press = function() {
		leftPressed = true;
		GAME.player.vx = -GAME.PLAYER_BASE.SPEED;
		
		if (upPressed) {
			GAME.player.vx = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
			GAME.player.vy = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
		} else if (downPressed) {
			GAME.player.vx = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
			GAME.player.vy = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
		}
	}

	left.release = function() {
		leftPressed = false;
		GAME.player.vx = 0;
		
		if (upPressed) {
			GAME.player.vy = -GAME.PLAYER_BASE.SPEED;
		} else if (downPressed) {
			GAME.player.vy = GAME.PLAYER_BASE.SPEED;
		}
	}
	
	right.press = function() {
		rightPressed = true;
		GAME.player.vx = GAME.PLAYER_BASE.SPEED;
		
		if (upPressed) {
			GAME.player.vx = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
			GAME.player.vy = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
		} else if (downPressed) {
			GAME.player.vx = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
			GAME.player.vy = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
		}
	}

	right.release = function() {
		rightPressed = false;
		GAME.player.vx = 0;
		
		if (upPressed) {
			GAME.player.vy = -GAME.PLAYER_BASE.SPEED;
		} else if (downPressed) {
			GAME.player.vy = GAME.PLAYER_BASE.SPEED;
		}
	}
	
	up.press = function() {
		upPressed = true;
		GAME.player.vy = -GAME.PLAYER_BASE.SPEED;
		
		if (leftPressed) {
			GAME.player.vx = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
			GAME.player.vy = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
		} else if (rightPressed) {
			GAME.player.vx = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
			GAME.player.vy = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
		}
	}
	
	up.release = function() {
		upPressed = false;
		GAME.player.vy = 0;
		
		if (leftPressed) {
			GAME.player.vx = -GAME.PLAYER_BASE.SPEED;
		} else if (rightPressed) {
			GAME.player.vx = GAME.PLAYER_BASE.SPEED;
		}
	}
	
	down.press = function() {
		downPressed = true;
		GAME.player.vy = GAME.PLAYER_BASE.SPEED;
		
		if (leftPressed) {
			GAME.player.vx = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
			GAME.player.vy = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
		} else if (rightPressed) {
			GAME.player.vx = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
			GAME.player.vy = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
		}
	}
	
	down.release = function() {
		downPressed = false;
		GAME.player.vy = 0;
		
		if (leftPressed) {
			GAME.player.vx = -GAME.PLAYER_BASE.SPEED;
		} else if (rightPressed) {
			GAME.player.vx = GAME.PLAYER_BASE.SPEED;
		}
	}
}

function setup_inputs() {
	function next_button(button) {
		dirs.remove(button);
		
		if (dirs.length > 0) {
			dirs[dirs.length - 1].press();
		} else {
			GAME.player.vx = 0;
			GAME.player.vy = 0;
		}
	}

    left.press = function() {
		if (!leftPressed) {
			dirs.push(left);
			leftPressed = true;
			GAME.player.vx = -GAME.PLAYER_BASE.SPEED;
			GAME.player.vy = 0;
		} else if (dirs[dirs.length - 1] == left) {
			GAME.player.vx = -GAME.PLAYER_BASE.SPEED;
			GAME.player.vy = 0;
		}
    };
    left.release = function() {
        next_button(left);
		leftPressed = false;
    };

    up.press = function() {
		if (!upPressed) {
			dirs.push(up);
			upPressed = true;
			GAME.player.vy = -GAME.PLAYER_BASE.SPEED;
			GAME.player.vx = 0;
		} else if (dirs[dirs.length - 1] == up) {
			GAME.player.vy = -GAME.PLAYER_BASE.SPEED;
			GAME.player.vx = 0;
		}
    };
    up.release = function() {
        next_button(up);
		upPressed = false;
    };

    right.press = function() {
		if (!rightPressed) {
			dirs.push(right);
			rightPressed = true;
			GAME.player.vx = GAME.PLAYER_BASE.SPEED;
			GAME.player.vy = 0;
		} else if (dirs[dirs.length - 1] == right) {
			GAME.player.vx = GAME.PLAYER_BASE.SPEED;
			GAME.player.vy = 0;
		}
    };
    right.release = function() {
        next_button(right);
		rightPressed = false;
    };

    down.press = function() {
		if (!downPressed) {
			dirs.push(down);
			downPressed = true;
			GAME.player.vy = GAME.PLAYER_BASE.SPEED;
			GAME.player.vx = 0;
		} else if (dirs[dirs.length - 1] == down) {
			GAME.player.vy = GAME.PLAYER_BASE.SPEED;
			GAME.player.vx = 0;
		}
    };
    down.release = function() {
        next_button(down);
		downPressed = false;
    };
}

function setup_buttons() {
	/*
	OnScreenDPad[0] = new PIXI.Sprite(resources["img/arrow_up.png"].texture);
	OnScreenDPad[0].x = ( GAME.DPAD_X_OFFSET );
	OnScreenDPad[0].y = ( GAME.DPAD_Y_OFFSET - 48 );
	
	OnScreenDPad[1] = new PIXI.Sprite(resources["img/arrow_down.png"].texture);
	OnScreenDPad[1].x = ( GAME.DPAD_X_OFFSET );
	OnScreenDPad[1].y = ( GAME.DPAD_Y_OFFSET + 48 );
	
	OnScreenDPad[2] = new PIXI.Sprite(resources["img/arrow_left.png"].texture);
	OnScreenDPad[2].x = ( GAME.DPAD_X_OFFSET - 48 );
	OnScreenDPad[2].y = ( GAME.DPAD_Y_OFFSET );
	
	OnScreenDPad[3] = new PIXI.Sprite(resources["img/arrow_right.png"].texture);
	OnScreenDPad[3].x = ( GAME.DPAD_X_OFFSET + 48 );
	OnScreenDPad[3].y = ( GAME.DPAD_Y_OFFSET );
	
	for (var i = 0; i < 4; ++i) {
		OnScreenDPad[i].anchor.set(0.5);
		OnScreenDPad[i].interactive = true;
		OnScreenDPad[i].buttonMode = true;
	}
	*/
	
	OnScreenWheel = new PIXI.Sprite(resources["img/mana_tree.png"].texture);
	OnScreenWheel.x = 0;
	OnScreenWheel.y = GAME.BASEHEIGHT - OnScreenWheel.height;
	OnScreenWheel.interactive = true;
	OnScreenWheel.buttonMode = true;
	OnScreenWheel.center = {x: OnScreenWheel.width / 2, y: GAME.BASEHEIGHT - OnScreenWheel.height / 2};
}


