"use strict";

GAME.Player = function () 
{	
	GAME.Entity.call(this, null);

	this.running = false;
	this.attacking = false;
	this.cooldown = 0.0;
	this.onCooldown = false;
	this.isHit = false;
	this.hitTime = 0.0;
	this.dying = false;
	this.alive = true;

	this.health = GAME.PLAYER_BASE.HEALTH;
	this.attack = GAME.PLAYER_BASE.ATTACK;
	this.defense = GAME.PLAYER_BASE.DEFENSE;
	this.stunDuration = GAME.PLAYER_BASE.STUN_DURATION;
	
	this.inventory = {};
	this.bounds = {};
	this.sizes = {};
	
	this.frames = {};
	for (var key in GAME.PLAYER_BASE.FRAMES) {
		if (GAME.PLAYER_BASE.FRAMES.hasOwnProperty(key)) {
			this.frames[key] = [];
			for (var i = 0; i < GAME.PLAYER_BASE.FRAMES[key].length; ++i) {
				this.frames[key].push(PIXI.Texture.fromFrame(GAME.PLAYER_BASE.FRAMES[key][i] + ".png"));
			}
		}
	}
	
	this.currentAnimation = new PIXI.extras.AnimatedSprite(this.frames['still_down']);
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

	this.inputComponent = new GAME.PlayerInputComponent();
};

GAME.Player.constructor = GAME.Player;
GAME.Player.prototype = Object.create(GAME.Entity.prototype);

GAME.Player.prototype.setPosition = function(x, y)
{
	GAME.Entity.prototype.setPosition.call(this, x, y);
	
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
	
	this.bounds.x = this.position.x - this.width / 2;
	this.bounds.y = this.position.y - this.height / 2;

	this.tileBounds.x = this.position.x + GAME.PLAYER_BASE.TILE_OFFSET_X;
	this.tileBounds.y = this.position.y + GAME.PLAYER_BASE.TILE_OFFSET_Y;
	
	this.adjustSlashBounds();
	this.adjustHealthBar(this.position.x, this.position.y);
}

GAME.Player.prototype.adjustHealthBar = function(x, y) 
{
	this.healthbar.view.position.x = x - this.healthbar.view.width / 2;
	this.healthbar.view.position.y = y - this.height / 2 - this.healthbar.view.height;
}

GAME.Player.prototype.reset = function() 
{
	this.alive = true;
	this.dying = false;
	this.health = GAME.PLAYER_BASE.HEALTH;
	this.healthbar.setMax(GAME.PLAYER_BASE.HEALTH);
	this.healthbar.setCurrent(this.health);
	this.view.textures = this.frames['walk_down'];
	this.direction = GAME.DIRECTION.DOWN;
	this.view.animationSpeed = 0.15;
}

GAME.Player.prototype.animate = function() 
{
	if (this.isHit || this.dying) { 
		return;
	}

	if (this.vx == 0 && this.vy == 0 && !this.attacking) {
		this.view.stop();
		
		if (this.direction == GAME.DIRECTION.RIGHT) {
			this.view.textures = this.frames['still_right'];
			this.view.scale.x = 1;
		} else if (this.direction == GAME.DIRECTION.DOWN) {
			this.view.textures = this.frames['still_down'];
			this.view.scale.x = 1;
		} else if (this.direction == GAME.DIRECTION.UP) {
			this.view.textures = this.frames['still_up'];
			this.view.scale.x = 1;
		} else if (this.direction == GAME.DIRECTION.LEFT) {
			this.view.textures = this.frames['still_right'];
			this.view.scale.x = -1;
		}

	} else if (!this.attacking) {
		var newFrames;
		this.view.loop = true;

		var moveStr = this.running ? 'run_' : 'walk_';
		var moveLeft = 1;
		var dirStr = '';
		if (this.direction == GAME.DIRECTION.UP) {
			dirStr = 'up';
		} else if (this.direction == GAME.DIRECTION.LEFT) {
			dirStr = 'right';
			moveLeft = -1;
		} else if (this.direction == GAME.DIRECTION.DOWN) {
			dirStr = 'down';
		} else if (this.direction == GAME.DIRECTION.RIGHT) {
			dirStr = 'right';
		}

		newFrames = this.frames[moveStr.concat(dirStr)];
		this.view.scale.x = moveLeft;
		
		if (this.view.textures != newFrames) {
			this.view.textures = newFrames;
		}
		
		this.view.play();
	
	} else if (this.attacking) {
		var newFrames;
		this.view.loop = false;
	
		if (this.direction == GAME.DIRECTION.UP) {
			newFrames = this.frames['attack_up_0'];
			this.view.scale.x = 1;
		} else if (this.direction == GAME.DIRECTION.RIGHT) {
			newFrames = this.frames['attack_right_0'];
			this.view.scale.x = 1;
		} else if (this.direction == GAME.DIRECTION.LEFT) {
			newFrames = this.frames['attack_right_0'];
			this.view.scale.x = -1;
		} else if (this.direction == GAME.DIRECTION.DOWN) {
			newFrames = this.frames['attack_down_0'];
			this.view.scale.x = 1;
		}
		
		var player = this;
		if (this.view.textures != newFrames) {
			this.view.textures = newFrames;
			this.view.gotoAndPlay(0);
		} else {
			this.view.play();
		}
	}
}

GAME.Player.prototype.update = function() 
{
	if (this.movementDisabled) {
		return;
	}

	this.inputComponent.update(this);
	this.animate();
}

GAME.Player.prototype.getHit = function(damage)
{
	if (this.dying || !this.alive) return;
	
	if (!this.isHit) {
		GAME.audio.playSound('hit_1', 0.2);
		GAME.level.engine.view.spawnDamageText(damage.toString(), 0.75, 14, 0xFFFF00, true, this);
	}

	if (!this.isHit && this.stunDuration > 0.01) {
		this.isHit = true;
		this.vx = 0;
		this.vy = 0;
		this.healthbar.damage(damage);
		this.health -= damage;
		if (this.attacking) {
			this.attacking = false;
		}
		
		if (this.health <= 0) {
			this.health = 0;
		}
		
		var entity = this;
		setTimeout(function () {
			entity.isHit = false;
			entity.healthbar.view.alpha = 0.5;
			
			if (entity.health <= 0) {
				entity.die();
			}
		}, entity.stunDuration * 1000);
	} else if (!this.isHit) {
		this.isHit = true;
		this.hitTime = 0.0;
		
		this.healthbar.damage(damage);
		this.health -= damage;
		
		if (this.health <= 0) {
			this.health = 0;
		}
	}
}

GAME.Player.prototype.calculateHit = function(monster)
{
	return this.attack - monster.defense;
}

GAME.Player.prototype.die = function()
{
	this.dying = true;
	
	GAME.audio.playSound('hit_1', 0.4);
	
	this.playDeathAnimation();

	var player = this;
	this.view.onComplete = function () {
		TweenLite.to(player.view, 1.0, {
			alpha: 0
		});

		TweenLite.to(player.healthbar.view, 1.0, {
			alpha: 0
		});

		setTimeout(function() {
			player.onDeath();
		}, 1000);
	}
}

GAME.Player.prototype.playDeathAnimation = function()
{
	this.view.loop = false;
	this.view.textures = this.frames['death'];
	this.view.animationSpeed = 0.20;
	this.view.gotoAndPlay(0);
}

GAME.Player.prototype.onDeath = function()
{
	this.alive = false;
	this.movementDisabled = true;
}

GAME.Player.prototype.middleOfSlash = function()
{
	return this.attacking && this.view.currentFrame == 3;
}

GAME.Player.prototype.adjustSlashBounds = function() 
{
	if (this.dying) return;

	if (this.direction == GAME.DIRECTION.RIGHT) {
		this.slashBounds.x = this.bounds.x + this.bounds.width, 
		this.slashBounds.y = this.bounds.y + this.bounds.height / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2;
	} else if (this.direction == GAME.DIRECTION.LEFT) {
		this.slashBounds.x = this.bounds.x - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE, 
		this.slashBounds.y = this.bounds.y + this.bounds.height / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2;
	} else if (this.direction == GAME.DIRECTION.UP) {
		this.slashBounds.x = this.bounds.x + this.bounds.width / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2, 
		this.slashBounds.y = this.bounds.y - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE;
	} else if (this.direction == GAME.DIRECTION.DOWN) {
		this.slashBounds.x = this.bounds.x + this.bounds.width / 2 - GAME.PLAYER_BASE.SLASH_HITBOX_SIZE / 2, 
		this.slashBounds.y = this.bounds.y + this.height;
	}
}
