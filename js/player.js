"use strict";

GAME.Player = function () 
{
	this.position = new PIXI.Point();
	this.previous = new PIXI.Point();
	
	this.vx = 0;
	this.vy = 0;
	
	this.inventory = {};
	this.bounds = {}
	
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
	
	this.currentAnimation = new PIXI.extras.AnimatedSprite(this.walkDownFrames);
	this.currentAnimation.animationSpeed = 0.15;
	this.view = this.currentAnimation;
	this.width = GAME.PLAYER_BASE.WIDTH;
	this.height = GAME.PLAYER_BASE.HEIGHT;
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
	this.bounds.x = this.position.x;
	this.bounds.y = this.position.y;
}

GAME.Player.prototype.animate = function() 
{
	if (this.vx < 0.01 && this.vy < 0.01 && this.vx > -0.01 && this.vy > -0.01) {
		this.view.stop();
	} else {
		var newFrames;
		
		if (GAME.dirs[0] == up) {
			newFrames = this.walkUpFrames;
		} else if (GAME.dirs[0] == down) {
			newFrames = this.walkDownFrames;
		} else if (GAME.dirs[0] == left) {
			newFrames = this.walkLeftFrames;
		} else if (GAME.dirs[0] == right) {
			newFrames = this.walkRightFrames;
		} else {
			alert("YOU JUST GOT MEMED");
		}
		
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

	if (GAME.dirs.length) {
		if (GAME.dirs[top] == up) {
			if (twoInputs) {
				if (GAME.dirs[top - 1] == left) {
					this.vx = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
					this.vy = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
				} else if (GAME.dirs[top - 1] == right) {
					this.vx = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
					this.vy = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
				} else {
					this.vy = -GAME.PLAYER_BASE.SPEED;
					this.vx = 0;
				}
			} else {
				this.vy = -GAME.PLAYER_BASE.SPEED;
				this.vx = 0;
			}
		} else if (GAME.dirs[top] == left) {
			if (twoInputs) {
				if (GAME.dirs[top - 1] == down) {
					this.vx = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
					this.vy = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
				} else if (GAME.dirs[top - 1] == up) {
					this.vx = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
					this.vy = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
				} else {
					this.vx = -GAME.PLAYER_BASE.SPEED;
					this.vy = 0;
				}
			} else {
				this.vx = -GAME.PLAYER_BASE.SPEED;
				this.vy = 0;
			}
		} else if (GAME.dirs[top] == down) {
			if (twoInputs) {
				if (GAME.dirs[top - 1] == left) {
					this.vx = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
					this.vy = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
				} else if (GAME.dirs[top - 1] == right) {
					this.vx = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
					this.vy = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
				} else {
					this.vy = GAME.PLAYER_BASE.SPEED;
					this.vx = 0;
				}
			} else {
				this.vy = GAME.PLAYER_BASE.SPEED;
				this.vx = 0;
			}
		} else if (GAME.dirs[top] == right) {
			if (twoInputs) {
				if (GAME.dirs[top - 1] == down) {
					this.vx = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
					this.vy = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
				} else if (GAME.dirs[top - 1] == up) {
					this.vx = GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
					this.vy = -GAME.PLAYER_BASE.SPEED * GAME.ROOTTWOOVERTWO;
				} else {
					this.vx = GAME.PLAYER_BASE.SPEED;
					this.vy = 0;
				}
			} else {
				this.vx = GAME.PLAYER_BASE.SPEED;
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
}

GAME.Player.prototype.move = function(x, y)
{
	this.previous.x = this.position.x;
	this.previous.y = this.position.y;

	this.position.x += x;
	this.position.y += y;
	
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
	
	this.bounds.x = this.position.x;
	this.bounds.y = this.position.y;
}

GAME.Player.prototype.moveX = function()
{
	this.move(this.vx, 0);
}

GAME.Player.prototype.moveY = function()
{
	this.move(0, this.vy);
}
