"use strict";

GAME.Player = function () 
{
	this.position = new PIXI.Point();
	this.previous = new PIXI.Point();
	
	this.vx = 0;
	this.vy = 0;
	
	this.running = false;
	this.attacking = false;
	this.cooldown = 0;
	this.onCooldown = false;
	this.health = GAME.PLAYER_BASE.HEALTH;
	this.attack = GAME.PLAYER_BASE.ATTACK;
	
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
	this.frames['attack_right_0'] = [
		PIXI.Texture.fromFrame('attack_0.png'),
		PIXI.Texture.fromFrame('attack_1.png'),
		PIXI.Texture.fromFrame('attack_2.png'),
		PIXI.Texture.fromFrame('attack_3.png')
	];
	this.frames['attack_right_1'] = [
		PIXI.Texture.fromFrame('attack_4.png'),
		PIXI.Texture.fromFrame('attack_5.png'),
		PIXI.Texture.fromFrame('attack_6.png'),
		PIXI.Texture.fromFrame('attack_7.png')
	];
	this.frames['attack_right_2'] = [
		PIXI.Texture.fromFrame('attack_8.png'),
		PIXI.Texture.fromFrame('attack_9.png'),
		PIXI.Texture.fromFrame('attack_10.png'),
		PIXI.Texture.fromFrame('attack_13.png')
	];
	this.frames['attack_right_3'] = [
		PIXI.Texture.fromFrame('attack_11.png'),
		PIXI.Texture.fromFrame('attack_12.png'),
		PIXI.Texture.fromFrame('attack_14.png'),
		PIXI.Texture.fromFrame('attack_15.png')
	];
	this.frames['attack_down_0'] = [
		PIXI.Texture.fromFrame('attack_24.png'),
		PIXI.Texture.fromFrame('attack_25.png'),
		PIXI.Texture.fromFrame('attack_26.png'),
		PIXI.Texture.fromFrame('attack_27.png')
	];
	this.frames['attack_down_1'] = [
		PIXI.Texture.fromFrame('attack_16.png'),
		PIXI.Texture.fromFrame('attack_17.png'),
		PIXI.Texture.fromFrame('attack_18.png'),
		PIXI.Texture.fromFrame('attack_19.png')
	];
	this.frames['attack_down_2'] = [
		PIXI.Texture.fromFrame('attack_28.png'),
		PIXI.Texture.fromFrame('attack_29.png'),
		PIXI.Texture.fromFrame('attack_30.png'),
		PIXI.Texture.fromFrame('attack_31.png')
	];
	this.frames['attack_down_3'] = [
		PIXI.Texture.fromFrame('attack_20.png'),
		PIXI.Texture.fromFrame('attack_21.png'),
		PIXI.Texture.fromFrame('attack_22.png'),
		PIXI.Texture.fromFrame('attack_23.png')
	];
	this.frames['attack_up_0'] = [
		PIXI.Texture.fromFrame('attack_32.png'),
		PIXI.Texture.fromFrame('attack_33.png'),
		PIXI.Texture.fromFrame('attack_34.png'),
		PIXI.Texture.fromFrame('attack_35.png')
	];
	this.frames['attack_up_1'] = [
		PIXI.Texture.fromFrame('attack_36.png'),
		PIXI.Texture.fromFrame('attack_37.png'),
		PIXI.Texture.fromFrame('attack_38.png'),
		PIXI.Texture.fromFrame('attack_39.png')
	];
	this.frames['attack_up_2'] = [
		PIXI.Texture.fromFrame('attack_44.png'),
		PIXI.Texture.fromFrame('attack_45.png'),
		PIXI.Texture.fromFrame('attack_46.png'),
		PIXI.Texture.fromFrame('attack_47.png')
	];
	this.frames['attack_up_3'] = [
		PIXI.Texture.fromFrame('attack_40.png'),
		PIXI.Texture.fromFrame('attack_41.png'),
		PIXI.Texture.fromFrame('attack_42.png'),
		PIXI.Texture.fromFrame('attack_43.png')
	];
	
	this.frames['still_down'] = [ PIXI.Texture.fromFrame('still_0.png') ];
	this.frames['still_right'] = [ PIXI.Texture.fromFrame('still_1.png') ];
	this.frames['still_up'] = [ PIXI.Texture.fromFrame('still_2.png') ];
	
	this.currentAnimation = new PIXI.extras.AnimatedSprite(this.frames['walk_down']);
	this.currentAnimation.animationSpeed = 0.15;
	this.view = this.currentAnimation;
	this.view.anchor.x = 0.5;
	this.view.anchor.y = 0.5;
	this.width = 20;
	this.height = 32;
	this.bounds = {x: this.position.x, y: this.position.y, width: this.width, height: this.height};
	this.slashBounds = {
		x: this.bounds.x + this.bounds.width, 
		y: this.bounds.y + this.bounds.height / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2, 
		width: GAME.PLAYER_BASE.SLASH_HITBOX_SIZE, 
		height: GAME.PLAYER_BASE.SLASH_HITBOX_SIZE
	};
	this.tileBounds = {x: this.position.x + GAME.PLAYER_BASE.TILE_OFFSET_X,
					   y: this.position.y + GAME.PLAYER_BASE.TILE_OFFSET_Y,
					   width: GAME.PLAYER_BASE.TILE_WIDTH,
					   height: GAME.PLAYER_BASE.TILE_HEIGHT};
	
	this.healthbar = new GAME.Healthbar();
	this.healthbar.create(0x00FF00, 1, 40, 10, 0xFF0000);
	this.healthbar.setMax(GAME.PLAYER_BASE.HEALTH);
	this.healthbar.setCurrent(this.health);
	this.healthbar.view.alpha = 0.5;
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
	
	this.adjustSlashBounds();
	
	this.healthbar.view.position.x = this.position.x - this.healthbar.view.width / 2;
	this.healthbar.view.position.y = this.position.y - this.height / 2 - this.healthbar.view.height;
	
	this.tileBounds.x = this.position.x + GAME.PLAYER_BASE.TILE_OFFSET_X;
	this.tileBounds.y = this.position.y + GAME.PLAYER_BASE.TILE_OFFSET_Y;
}

GAME.Player.prototype.facingRight = function() 
{
	return this.view.scale.x == 1 && (this.view.textures == this.frames['run_right'] ||
		   this.view.textures == this.frames['still_right'] || 
		   this.view.textures == this.frames['walk_right'] || 
		   this.view.textures == this.frames['attack_right_0']);
}

GAME.Player.prototype.facingLeft = function() 
{
	return this.view.scale.x == -1 && (this.view.textures == this.frames['run_right'] ||
		   this.view.textures == this.frames['still_right'] || 
		   this.view.textures == this.frames['walk_right']) || 
		   this.view.textures == this.frames['attack_right_0'];
}

GAME.Player.prototype.facingUp = function() 
{
	return this.view.textures == this.frames['run_up'] ||
		   this.view.textures == this.frames['still_up'] || 
		   this.view.textures == this.frames['walk_up'] || 
		   this.view.textures == this.frames['attack_up_0'];
}

GAME.Player.prototype.facingDown = function() 
{
	return this.view.textures == this.frames['run_down'] ||
		   this.view.textures == this.frames['still_down'] || 
		   this.view.textures == this.frames['walk_down'] || 
		   this.view.textures == this.frames['attack_down_0'];
}

GAME.Player.prototype.animate = function() 
{
	if (this.vx < 0.01 && this.vy < 0.01 && this.vx > -0.01 && this.vy > -0.01 && !this.attacking) {
		this.view.stop();
		
		if (this.facingRight()) {
			this.view.textures = this.frames['still_right'];
			this.view.scale.x = 1;
		} else if (this.facingDown()) {
			this.view.textures = this.frames['still_down'];
			this.view.scale.x = 1;
		} else if (this.facingUp()) {
			this.view.textures = this.frames['still_up'];
			this.view.scale.x = 1;
		} else if (this.facingLeft()) {
			this.view.textures = this.frames['still_right'];
			this.view.scale.x = -1;
		} else {
			alert("PROBLEM");
		}
	} else if (!this.attacking) {
		var newFrames;
		var angle = Math.atan2(this.vy, this.vx) * GAME.RADIANSTOANGLE;
		this.view.loop = true;
		
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
		
		if (this.view.textures != newFrames) {
			this.view.textures = newFrames;
			this.view.gotoAndPlay(0);
		} else {
			this.view.play();
		}
	} else if (this.attacking) {
		var newFrames;
		this.view.loop = false;
	
		if (GAME.player.facingUp()) {
			newFrames = this.frames['attack_up_0'];
			this.view.scale.x = 1;
		} else if (GAME.player.facingRight()) {
			newFrames = this.frames['attack_right_0'];
			this.view.scale.x = 1;
		} else if (GAME.player.facingLeft()) {
			newFrames = this.frames['attack_right_0'];
			this.view.scale.x = -1;
		} else if (GAME.player.facingDown()) {
			newFrames = this.frames['attack_down_0'];
			this.view.scale.x = 1;
		} else {
			alert("What's going on?");
		}
		
		var player = this;
		if (this.view.textures != newFrames) {
			this.view.textures = newFrames;
			this.view.onComplete = function () {
				player.attacking = false;
				player.onCooldown = true;
				player.cooldown = 0.0;
			};
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
	
	if (xPressed && !this.attacking && !this.onCooldown) {
		this.attacking = true;
		GAME.audio.playSound('slash_1', 0.2);
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

GAME.Player.prototype.updateAttackCooldown = function()
{
	if (this.onCooldown) {
		this.cooldown += GAME.time.DELTA_TIME;
		
		if (this.cooldown > GAME.PLAYER_BASE.ATTACK_COOLDOWN) {
			this.onCooldown = false;
		}
	}
}

GAME.Player.prototype.update = function()
{
	if (this.movementDisabled) {
		return;
	}
	
	this.updateAttackCooldown();
	this.handleInput();
	this.animate();
}

GAME.Player.prototype.backout = function()
{
	this.position.x = this.previous.x;
	this.position.y = this.previous.y;
	
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
	
	this.bounds.x = this.position.x - this.width / 2;
	this.bounds.y = this.position.y - this.height / 2; 
	
	this.tileBounds.x = this.position.x + GAME.PLAYER_BASE.TILE_OFFSET_X;
	this.tileBounds.y = this.position.y + GAME.PLAYER_BASE.TILE_OFFSET_Y;
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
	
	this.adjustSlashBounds();
	
	this.healthbar.view.position.x = this.position.x - this.healthbar.view.width / 2;
	this.healthbar.view.position.y = this.position.y - this.height / 2 - this.healthbar.view.height;
	
	this.tileBounds.x = this.position.x + GAME.PLAYER_BASE.TILE_OFFSET_X;
	this.tileBounds.y = this.position.y + GAME.PLAYER_BASE.TILE_OFFSET_Y;
}

GAME.Player.prototype.calculateHit = function(monster)
{
	return this.attack - monster.defense;
}

GAME.Player.prototype.middleOfSlash = function()
{
	return this.attacking && this.view.currentFrame == 3;
}

GAME.Player.prototype.adjustSlashBounds = function() 
{
	if (this.facingRight()) {
		this.slashBounds.x = this.bounds.x + this.bounds.width, 
		this.slashBounds.y = this.bounds.y + this.bounds.height / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2;
	} else if (this.facingLeft()) {
		this.slashBounds.x = this.bounds.x - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE, 
		this.slashBounds.y = this.bounds.y + this.bounds.height / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2;
	} else if (this.facingUp()) {
		this.slashBounds.x = this.bounds.x + this.bounds.width / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2, 
		this.slashBounds.y = this.bounds.y - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE;
	} else if (this.facingDown()) {
		this.slashBounds.x = this.bounds.x + this.bounds.width / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2, 
		this.slashBounds.y = this.bounds.y + this.height;
	} else {
		alert("NOT FACING ANY DIRECTION??????");
	}
}

GAME.Player.prototype.moveX = function()
{
	this.move(this.vx, 0);
}

GAME.Player.prototype.moveY = function()
{
	this.move(0, this.vy);
}
