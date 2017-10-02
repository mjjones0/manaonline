"use strict";

GAME.Player = function () 
{
	this.position = new PIXI.Point();
	this.previous = new PIXI.Point();
	
	this.vx = 0;
	this.vy = 0;
	
	this.running = false;
	
	this.inventory = {};
	this.bounds = {};
	this.sizes = {};
	
	this.frames = {};
	this.frames['walk_down'] = [
		PIXI.Texture.fromFrame('walk_0.png'),
		PIXI.Texture.fromFrame('walk_1.png'),
		PIXI.Texture.fromFrame('walk_2.png'),
		PIXI.Texture.fromFrame('walk_3.png'),
		PIXI.Texture.fromFrame('walk_4.png'),
		PIXI.Texture.fromFrame('walk_5.png')
	];
	this.frames['walk_right'] = [
		PIXI.Texture.fromFrame('walk_6.png'),
		PIXI.Texture.fromFrame('walk_7.png'),
		PIXI.Texture.fromFrame('walk_8.png'),
		PIXI.Texture.fromFrame('walk_9.png'),
		PIXI.Texture.fromFrame('walk_10.png'),
		PIXI.Texture.fromFrame('walk_11.png')
	];
	this.frames['walk_up'] = [
		PIXI.Texture.fromFrame('walk_12.png'),
		PIXI.Texture.fromFrame('walk_13.png'),
		PIXI.Texture.fromFrame('walk_14.png'),
		PIXI.Texture.fromFrame('walk_15.png'),
		PIXI.Texture.fromFrame('walk_16.png'),
		PIXI.Texture.fromFrame('walk_17.png')
	];
	this.frames['run_down'] = [
		PIXI.Texture.fromFrame('run_0.png'),
		PIXI.Texture.fromFrame('run_1.png'),
		PIXI.Texture.fromFrame('run_2.png'),
		PIXI.Texture.fromFrame('run_3.png'),
		PIXI.Texture.fromFrame('run_4.png'),
		PIXI.Texture.fromFrame('run_5.png')
	];
	this.frames['run_right'] = [
		PIXI.Texture.fromFrame('run_6.png'),
		PIXI.Texture.fromFrame('run_7.png'),
		PIXI.Texture.fromFrame('run_8.png'),
		PIXI.Texture.fromFrame('run_9.png'),
		PIXI.Texture.fromFrame('run_10.png'),
		PIXI.Texture.fromFrame('run_11.png')
	];
	this.frames['run_up'] = [
		PIXI.Texture.fromFrame('run_12.png'),
		PIXI.Texture.fromFrame('run_13.png'),
		PIXI.Texture.fromFrame('run_14.png'),
		PIXI.Texture.fromFrame('run_15.png'),
		PIXI.Texture.fromFrame('run_16.png'),
		PIXI.Texture.fromFrame('run_17.png')
	];
	this.frames['still_down'] = [ PIXI.Texture.fromFrame('still_0.png') ];
	this.frames['still_right'] = [ PIXI.Texture.fromFrame('still_1.png') ];
	this.frames['still_up'] = [ PIXI.Texture.fromFrame('still_2.png') ];
	
	this.walkDownFrames = [];
	this.walkLeftFrames = [];
	this.walkUpFrames = [];
	this.walkRightFrames = [];
	
	this.FaceLeftFrame = PIXI.Texture.fromFrame("still_left.png");
	this.FaceDownFrame = PIXI.Texture.fromFrame("still_down.png");
	this.FaceRightFrame = PIXI.Texture.fromFrame("still_right.png");
	this.FaceUpFrame = PIXI.Texture.fromFrame("still_up.png");
	
	for (var i = 0; i < 6; ++i) {
		this.walkDownFrames.push(PIXI.Texture.fromFrame("walk_down_" + i + ".png"));
		this.walkLeftFrames.push(PIXI.Texture.fromFrame("walk_left_" + i + ".png"));
		this.walkRightFrames.push(PIXI.Texture.fromFrame("walk_right_" + i + ".png"));
		this.walkUpFrames.push(PIXI.Texture.fromFrame("walk_up_" + i + ".png"));
	}
	
	this.currentAnimation = new PIXI.extras.AnimatedSprite(this.frames['walk_down']);
	this.currentAnimation.animationSpeed = 0.15;
	this.view = this.currentAnimation;
	this.view.anchor.x = 0.5;
	this.view.anchor.y = 0.5;
	this.width = 20;
	this.height = 32;
	this.bounds = {x: this.position.x, y: this.position.y, width: this.width, height: this.height};
};

GAME.Player.constructor = GAME.Player;

GAME.Player.prototype.reset = function(x, y)
{
	this.position.x = 0;
	this.position.y = 0;
    this.vx = 0;
    this.vy = 0;
	this.move(x - this.width / 2, y - this.height / 2);
}

GAME.Player.prototype.setPosition = function(x, y)
{
	this.previous.x = this.position.x;
	this.previous.y = this.position.y;
	this.position.x = x;
	this.position.y = y;
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
	this.bounds.x = this.position.x - this.width / 2;
	this.bounds.y = this.position.y - this.height / 2;
}

GAME.Player.prototype.animate = function() 
{
	if (this.vx < 0.01 && this.vy < 0.01 && this.vx > -0.01 && this.vy > -0.01) {
		this.view.stop();
		
		if (this.view.textures == this.frames['run_right'] || 
			this.view.textures == this.frames['walk_right']) {
			this.view.textures = this.frames['still_right'];
		} else if (this.view.textures == this.frames['run_down'] || 
			this.view.textures == this.frames['walk_down']) {
			this.view.textures = this.frames['still_down'];
		} else if (this.view.textures == this.frames['run_up'] || 
			this.view.textures == this.frames['walk_up']) {
			this.view.textures = this.frames['still_up'];
		}
	} else {
		var newFrames;
		var angle = Math.atan2(this.vy, this.vx) * GAME.RADIANSTOANGLE;
		
		if (angle > -45 && angle < 45) {
			newFrames = this.running ? this.frames['run_right'] : this.frames['walk_right'];
			this.view.scale.x = 1;
		} else if (angle < -45 && angle > -135) {
			newFrames = this.running ? this.frames['run_up'] : this.frames['walk_up'];
			this.view.scale.x = 1;
		// left
		} else if (angle < -135 || angle > 135) {
			newFrames = this.running ? this.frames['run_right'] : this.frames['walk_right'];
			this.view.scale.x = -1;
		} else if (angle < 135 && angle > 45) {
			newFrames = this.running ? this.frames['run_down'] : this.frames['walk_down'];
			this.view.scale.x = 1;
		}
	
		/*
		// right
		if (this.vx > 0.01 && this.vy < 0.01) {
			newFrames = this.walkRightFrames;
		// down
		} else if (this.vx < 0.01 && this.vy > 0.01) {
			newFrames = this.walkDownFrames;
		// left
		} else if (this.vx < -0.01 && this.vy < 0.01) {
			newFrames = this.walkLeftFrames;
		// up
		} else if (this.vx < 0.01 && this.vy < -0.01) {
			newFrames = this.walkUpFrames;
		}*/
		
		if (this.view.textures != newFrames) {
			this.view.textures = newFrames;
			this.view.gotoAndPlay(0);
		} else {
			this.view.play();
		}
	}
}

GAME.Player.prototype.handleInput = function()
{
	var top = GAME.dirs.length - 1;
	var twoInputs = GAME.dirs.length > 1;
	
	if (zPressed) {
		this.running = true;
	} else {
		this.running = false;
	}
	
	var speed = GAME.PLAYER_BASE.WALK_SPEED;
	if (this.running) { speed = GAME.PLAYER_BASE.RUN_SPEED; }

	if (GAME.dirs.length) {
		if (GAME.dirs[top] == up) {
			if (twoInputs) {
				if (GAME.dirs[top - 1] == left) {
					this.vx = -speed * GAME.ROOTTWOOVERTWO;
					this.vy = -speed * GAME.ROOTTWOOVERTWO;
				} else if (GAME.dirs[top - 1] == right) {
					this.vx = speed * GAME.ROOTTWOOVERTWO;
					this.vy = -speed * GAME.ROOTTWOOVERTWO;
				} else {
					this.vy = -speed;
					this.vx = 0;
				}
			} else {
				this.vy = -speed;
				this.vx = 0;
			}
		} else if (GAME.dirs[top] == left) {
			if (twoInputs) {
				if (GAME.dirs[top - 1] == down) {
					this.vx = -speed * GAME.ROOTTWOOVERTWO;
					this.vy = speed * GAME.ROOTTWOOVERTWO;
				} else if (GAME.dirs[top - 1] == up) {
					this.vx = -speed * GAME.ROOTTWOOVERTWO;
					this.vy = -speed * GAME.ROOTTWOOVERTWO;
				} else {
					this.vx = -speed;
					this.vy = 0;
				}
			} else {
				this.vx = -speed;
				this.vy = 0;
			}
		} else if (GAME.dirs[top] == down) {
			if (twoInputs) {
				if (GAME.dirs[top - 1] == left) {
					this.vx = -speed * GAME.ROOTTWOOVERTWO;
					this.vy = speed * GAME.ROOTTWOOVERTWO;
				} else if (GAME.dirs[top - 1] == right) {
					this.vx = speed * GAME.ROOTTWOOVERTWO;
					this.vy = speed * GAME.ROOTTWOOVERTWO;
				} else {
					this.vy = speed;
					this.vx = 0;
				}
			} else {
				this.vy = speed;
				this.vx = 0;
			}
		} else if (GAME.dirs[top] == right) {
			if (twoInputs) {
				if (GAME.dirs[top - 1] == down) {
					this.vx = speed * GAME.ROOTTWOOVERTWO;
					this.vy = speed * GAME.ROOTTWOOVERTWO;
				} else if (GAME.dirs[top - 1] == up) {
					this.vx = speed * GAME.ROOTTWOOVERTWO;
					this.vy = -speed * GAME.ROOTTWOOVERTWO;
				} else {
					this.vx = speed;
					this.vy = 0;
				}
			} else {
				this.vx = speed;
				this.vy = 0;
			}
		}
	} else {
		this.vx = 0;
		this.vy = 0;
	}
}

GAME.Player.prototype.update = function()
{
	if (this.movementDisabled) {
		return;
	}
	
	this.handleInput();
	this.animate();
	//this.move(this.vx, this.vy);
}

GAME.Player.prototype.backout = function()
{
	this.position.x = this.previous.x;
	this.position.y = this.previous.y;
	
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
	
	this.bounds.x = this.position.x - this.width / 2;
	this.bounds.y = this.position.y - this.height / 2; 
}

GAME.Player.prototype.move = function(x, y)
{
	this.previous.x = this.position.x;
	this.previous.y = this.position.y;

	this.position.x += x;
	this.position.y += y;
	
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
	
	this.bounds.x = this.position.x - this.width / 2;
	this.bounds.y = this.position.y - this.height / 2;
}

GAME.Player.prototype.moveX = function()
{
	this.move(this.vx, 0);
}

GAME.Player.prototype.moveY = function()
{
	this.move(0, this.vy);
}
