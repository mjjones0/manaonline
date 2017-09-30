"use strict";

GAME.Enemy = function(name) 
{
	var data = GAME.MONSTERS[name];
	if (!data) { alert('no data for monster: ' + name); }
	
	this.position = new PIXI.Point();
	this.previous = new PIXI.Point();
	
	this.vx = 0;
	this.vy = 0;
	
	this.name = data.NAME;
	this.exp = data.EXP;
	this.health = data.HEALTH;
	this.speed = data.SPEED;
	this.loot = data.LOOT;
	this.aggressive = data.AGGRESSIVE;
	this.attack = data.ATTACK;
	this.defense = data.DEFENSE;
	this.heavy = data.HEAVY;
	
	this.damage = 0;
	this.moveFramesLeft = 0;
	this.moveDirection = 0;
	
	this.width = data.WIDTH;
	this.height = data.HEIGHT;
	
	this.moveDownFrames = [];
	this.moveLeftFrames = [];
	this.moveUpFrames = [];
	this.moveRightFrames = [];
	this.getHitFrames = [];
	this.attackLeftFrames = [];
	this.attackRightFrames = [];
	this.combatLeftFrames = [];
	this.combatRightFrames = [];
	
	for (var i = 0; i < data.MOVE_FRAMES; ++i) {
		if (PIXI.Texture.fromFrame(this.name + "_move_down_" + i + ".png")) { 
			this.moveDownFrames.push(PIXI.Texture.fromFrame(this.name + "_move_down_" + i + ".png")); 
		}
		if (PIXI.Texture.fromFrame(this.name + "_move_left_" + i + ".png")) {
			this.moveLeftFrames.push(PIXI.Texture.fromFrame(this.name + "_move_left_" + i + ".png"));
		}
		if (PIXI.Texture.fromFrame(this.name + "_move_right_" + i + ".png")) {
			this.moveRightFrames.push(PIXI.Texture.fromFrame(this.name + "_move_right_" + i + ".png"));
		}
		if (PIXI.Texture.fromFrame(this.name + "_move_up_" + i + ".png")) {
			this.moveUpFrames.push(PIXI.Texture.fromFrame(this.name + "_move_up_" + i + ".png"));
		}
	}
	
	for (var i = 0; i < data.HIT_FRAMES; ++i) {
		if (PIXI.Texture.fromFrame(this.name + "_get_hit_" + i + ".png")) {
			this.getHitFrames.push(PIXI.Texture.fromFrame(this.name + "_get_hit_" + i + ".png"));
		}
	}
	
	this.currentAnimation = new PIXI.extras.AnimatedSprite(this.moveDownFrames);
	this.currentAnimation.animationSpeed = 0.08;
	this.view = this.currentAnimation;
	this.bounds = {x: this.position.x, y: this.position.y, width: this.width, height: this.height};
}

GAME.Enemy.constructor = GAME.Enemy;

GAME.Enemy.prototype.reset = function(x, y)
{
	this.position.x = 0;
	this.position.y = 0;
    this.vx = 0;
    this.vy = 0;
	this.move(x - this.width / 2, y - this.height / 2);
}

GAME.Enemy.prototype.setPosition = function(x, y)
{
	this.previous.x = this.position.x;
	this.previous.y = this.position.y;
	this.position.x = x;
	this.position.y = y;
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
}

GAME.Enemy.prototype.moveUp = function()
{
	this.vx = 0;
	this.vy = -this.speed;
}

GAME.Enemy.prototype.moveRight = function()
{
	this.vy = 0;
	this.vx = this.speed;
}

GAME.Enemy.prototype.moveDown = function()
{
	this.vx = 0;
	this.vy = this.speed;
}

GAME.Enemy.prototype.moveLeft = function()
{
	this.vy = 0;
	this.vx = -this.speed;
}

GAME.Enemy.prototype.animate = function() 
{
	if (this.vx < 0.01 && this.vy < 0.01 && this.vx > -0.01 && this.vy > -0.01) {
		this.view.stop();
	} else {
		var newFrames;
	
		// right
		if (this.vx > 0.01 && this.vy < 0.01) {
			newFrames = this.moveRightFrames;
		// down
		} else if (this.vx < 0.01 && this.vy > 0.01) {
			newFrames = this.moveDownFrames;
		// left
		} else if (this.vx < -0.01 && this.vy < 0.01) {
			newFrames = this.moveLeftFrames;
		// up
		} else if (this.vx < 0.01 && this.vy < -0.01) {
			newFrames = this.moveUpFrames;
		}
		
		if (this.view.textures != newFrames) {
			this.view.textures = newFrames;
			this.view.gotoAndPlay(0);
		} else {
			this.view.play();
		}
	}
}

GAME.Enemy.prototype.changeDirection = function()
{
	this.moveFramesLeft = 0;
}

GAME.Enemy.prototype.backout = function()
{
	this.position.x = this.previous.x;
	this.position.y = this.previous.y;
	
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
}

GAME.Enemy.prototype.move = function(x, y)
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

GAME.Enemy.prototype.behave = function() 
{
	if (this.moveFramesLeft == 0) {
		this.moveFramesLeft = randomInt(100, 200);
		this.moveDirection = randomInt(1, 4);
	} else {
		--this.moveFramesLeft;
	}
	
	if (this.moveDirection == 1) {
		this.moveUp();
	} else if (this.moveDirection == 2) {
		this.moveLeft();
	} else if (this.moveDirection == 3) {
		this.moveDown();
	} else if (this.moveDirection == 4) {
		this.moveRight();
	}
}

GAME.Enemy.prototype.update = function()
{
	if (this.movementDisabled) {
		return;
	}

	this.behave();
	this.animate();
	this.move(this.vx, this.vy);
}