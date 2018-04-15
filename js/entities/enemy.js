"use strict";

GAME.Enemy = function(name, aggressive) 
{
	GAME.Entity.call(this);

	var data = GAME.MONSTERS[name];
	if (!data) { alert('no data for monster: ' + name); }
	
	this.isHit = false;
	this.hitTime = 0.0;
	
	this.key = name;
	this.name = data.NAME;
	this.exp = data.EXP;
	this.health = data.HEALTH;
	this.maxHealth = data.HEALTH;
	this.range = data.RANGE;
	this.speed = data.SPEED;
	this.loot = data.LOOT;
	this.aggressive = aggressive;
	this.attack = data.ATTACK;
	this.defense = data.DEFENSE;
	this.heavy = data.HEAVY;
	this.stunDuration = data.STUN_DURATION;
	this.basicAttackCooldown = data.BASIC_ATTACK_COOLDOWN;
	this.behavior = GAME.monster_behaviors[(this.aggressive ? this.name + "_aggressive" : this.name + "_passive")];
	
	this.damage = 0;
	this.moveFramesLeft = 0;
	this.moveDirection = 0;
	this.justStartedAnimation = true;
	
	this.dying = false;
	this.alive = true;
	
	this.width = data.WIDTH;
	this.height = data.HEIGHT;
	
	this.frames = {};
	
	for (var key in data.FRAMES) {
		if (data.FRAMES.hasOwnProperty(key)) {
			this.frames[key] = [];
			for (var i = 0; i < data.FRAMES[key].length; ++i) {
				this.frames[key].push(PIXI.Texture.fromFrame(data.FRAMES[key][i] + ".png"));
			}
		}
	}
	
	this.currentAnimation = new PIXI.extras.AnimatedSprite(this.frames[data.FRAME_DEFAULT]);
	this.currentAnimation.animationSpeed = 0.08;
	this.view = this.currentAnimation;
	this.view.anchor.x = 0.5;
	this.view.anchor.y = 0.5;
	
	this.bounds = {x: this.position.x, y: this.position.y, width: this.width, height: this.height};
	
	this.healthbar = new GAME.Healthbar();
	this.healthbar.create(0xFFFF00, 1, 30, 8, 0xFF0000);
	this.healthbar.setMax(data.HEALTH);
	this.healthbar.setCurrent(this.health);
	this.healthbar.view.alpha = 0.5;
	
	//this.aura = new PIXI.Sprite(resources["img/passive_aura.png"].texture);
}

GAME.Enemy.constructor = GAME.Enemy;
GAME.Enemy.prototype = Object.create(GAME.Entity.prototype);

GAME.Enemy.prototype.setPosition = function(x, y)
{
	GAME.Entity.prototype.setPosition.call(this, x, y);
	
	this.view.position.x = this.position.x;
	this.view.position.y = this.position.y;
	
	this.bounds.x = this.position.x - this.width / 2;
	this.bounds.y = this.position.y - this.height / 2;
	
	this.healthbar.view.position.x = this.position.x - this.healthbar.view.width / 2;
	this.healthbar.view.position.y = this.position.y - this.height / 2 - this.healthbar.view.height;
}

GAME.Enemy.prototype.getHit = function(damage)
{
	if (this.dying || !this.alive) return;
	
	console.log(damage);
	
	if (!this.isHit) {
		GAME.audio.playSound('slashed_1', 0.2);
		GAME.level.engine.view.spawnDamageText(damage.toString(), 0.75, 14, 0xFFFF00, false, this);
	}

	if (!this.isHit && this.stunDuration > 0.01) {
		this.view.textures = this.frames['hit'];
		this.isHit = true;
		this.hitTime = 0.0;
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
		
		var monster = this;
		setTimeout(function () {
			monster.isHit = false;
			monster.healthbar.view.alpha = 0.5;
			
			if (monster.health <= 0) {
				monster.die();
			}
		}, monster.stunDuration * 1000);
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

GAME.Enemy.prototype.animate = function() 
{
	if (this.isHit || this.dying || this.attacking) { 
		return;
	}

	if (this.vx < 0.01 && this.vy < 0.01 && this.vx > -0.01 && this.vy > -0.01) {
		this.view.stop();
		
		if (this.view.textures == this.frames['move_left']) {
			this.view.textures = this.frames['still_left'];
		} else if (this.view.textures == this.frames['move_down']) {
			this.view.textures = this.frames['still_down'];
		} else if (this.view.textures == this.frames['move_up']) {
			this.view.textures = this.frames['still_up'];
		}
	} else {
		var newFrames;
		var angle = Math.atan2(this.vy, this.vx) * GAME.RADIANSTOANGLE;
		
		// assumes enemies have sprites for up, left, and down only - may need to revise later
		if (angle > -45 && angle < 45) {
			newFrames = this.frames['move_left'];
			this.view.scale.x = -1;
		} else if (angle < -45 && angle > -135) {
			newFrames = this.frames['move_up'];
			this.view.scale.x = 1;
		} else if (angle < -135 || angle > 135) {
			newFrames = this.frames['move_left'];
			this.view.scale.x = 1;
		} else if (angle < 135 && angle > 45) {
			newFrames = this.frames['move_down'];
			this.view.scale.x = 1;
		} else {
			console.log(angle);
			alert("BAD ANGLE ON MOVEMENT FOR ANIMATION PLEASE EXPLORE");
		}
		
		if (this.view.textures != newFrames) {
			this.view.loop = true;
			this.view.textures = newFrames;
			this.view.gotoAndPlay(0);
			this.justStartedAnimation = true;
		} else {
			this.justStartedAnimation = false;
			this.view.play();
		}
	}
}

GAME.Enemy.prototype.changeDirection = function()
{
	this.moveFramesLeft = 0;
}

GAME.Enemy.prototype.behave = function() 
{
	if (this.isHit || this.dying) return;
	this.behavior(this);
}

GAME.Enemy.prototype.calculateHit = function(entity)
{
	return this.attack - entity.defense;
}

GAME.Enemy.prototype.die = function()
{
	this.dying = true;
	
	GAME.audio.playSound('monster_death_1', 0.2);
	
	this.healthbar.view.alpha = 0;
	
	this.view.loop = false;
	this.view.textures = this.frames['death'];
	this.view.animationSpeed = 0.20;
	this.view.width = this.view.width * (this.width / GAME.MONSTER_DEATH_BASE_WIDTH); 
	this.view.height = this.view.height * (this.height / GAME.MONSTER_DEATH_BASE_HEIGHT);
	
	var monster = this;
	this.view.onComplete = function() {
		TweenLite.to(monster.view, 1.0, {
			alpha: 0,
			onComplete: function() {
				monster.alive = false;
				monster.setPosition(-1000, -1000);
				monster.movementDisabled = true;
			}
		});
	}
	
	this.view.gotoAndPlay(0);
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