"use strict";

GAME.Level = function(engine) 
{
	this.transitioning = false;
	this.engine = engine;
}

GAME.Level.constructor = GAME.Level;

GAME.Level.prototype.load = function(name, spawnX, spawnY)
{
	var data = GAME.LEVELS[name];
	this.data = data;
	
	// background
	this.bg = new Sprite(resources[data.BACKGROUND].texture);
    this.bg.width = data.BG_WIDTH;
    this.bg.height = data.BG_HEIGHT;
	this.width = data.BG_WIDTH;
	this.height = data.BG_HEIGHT;
	
	// music
	this.song = data.SONG;
	
	// create entity containers
	this.inanimates = [];
	this.inanimates_data = [];
	this.monsters = [];
	this.monsters_data = [];
	this.exits = [];
	this.exits_data = [];
	
	// process entities in level
	for (var i = 0; i < data.ENTITIES.length; ++i) {
		var entity = data.ENTITIES[i];
		
		if (entity.TYPE == GAME.INANIMATE) {
			var inanimate = new Sprite(resources[entity.TEXTURE].texture);
			inanimate.x = entity.X;
			inanimate.y = entity.Y;
			this.inanimates.push(inanimate);
			this.inanimates_data.push(entity);
		} else if (entity.TYPE == GAME.MONSTER) {
			var monster = new GAME.Enemy(entity.ID);
			monster.setPosition(entity.X, entity.Y);
			this.monsters.push(monster);
			this.monsters_data.push(entity);
		} else if (entity.TYPE == GAME.SPAWN_POINT) {
			this.spawn = new PIXI.Point(entity.X, entity.Y);
		} else if (entity.TYPE == GAME.EXIT_WELL) {
			var exit = new Sprite(resources[entity.TEXTURE].texture);
			exit.x = entity.X;
			exit.y = entity.Y;
			this.exits.push(exit);
			this.exits_data.push(entity);
		}
	}
	
	if (spawnX) {
		GAME.player.setPosition(spawnX, spawnY);
	} else {
		GAME.player.setPosition(this.spawn.x, this.spawn.y);
	}
	
	this.bounds = {
        x: 0,
        y: 0,
        width: this.data.BG_WIDTH,
		height: this.data.BG_HEIGHT
    };
	
	GAME.audio.playMusic(this.song, true, 0.3);
	
	this.engine.view.createScene();
}

GAME.Level.prototype.changeLevel = function(name, x, y, duration)
{
	this.monsters.forEach(function (monster) {
		monster.movementDisabled = true;
	});
	GAME.player.movementDisabled = true;
	GAME.player.view.stop();
	
	var engine = this.engine;
	var level = this;
	var monsters = this.monsters;
	
	this.transitioning = true;
	GAME.fade.alpha = 0;
	engine.view.stage.addChild(GAME.fade);
	TweenLite.to(GAME.fade, 0.5, {
		alpha : 1, 
		onComplete : function () 
		{
			engine.view.stage.removeChild(GAME.fade);
			engine.view.clearScene();
			level.load(name, x, y);
			engine.view.stage.addChild(GAME.fade);
			
			setTimeout( function () {
				level.transitioning = false;
				
				monsters.forEach(function (monster) {
					monster.movementDisabled = false;
				});
				GAME.player.movementDisabled = false;
				GAME.player.view.play();
				
				TweenLite.to(GAME.fade, 0.5, {
					alpha : 0,
					onComplete : function () 
					{
						engine.view.stage.removeChild(GAME.fade);
					}
				});
			}, duration);
		}
	});
}

GAME.Level.prototype.moveAndCollidePlayerX = function() 
{
	// move player X -> if we collide into a block, undo
	GAME.player.moveX();
	for (var i = 0; i < this.inanimates.length; ++i) {
		if (hitTestRectangleRote(GAME.player.bounds.x, GAME.player.bounds.y, GAME.player.bounds.width, GAME.player.bounds.height, 
							 this.inanimates[i].x, this.inanimates[i].y, this.inanimates[i].width, this.inanimates[i].height)) {
			GAME.player.backout();
			return;
		}
	}
	
	// for each monster
	for (var i = 0; i < this.monsters.length; ++i) {
		// if we collide
		if (hitTestRectangle(GAME.player.bounds, this.monsters[i].bounds)) {
			// if monster is heavy, stop
			if (this.monsters[i].heavy) {
				GAME.player.backout();
				return;
			// if they're not, move separate them from us along our direction of motion
			} else {
				var playerUnitDir = GAME.player.vx < 0 ? -1 : 1;
				var depth = axis_aligned_intersection_depth('x', GAME.player.bounds, this.monsters[i].bounds);
				//GAME.player.move(-1 * playerUnitDir * depth, 0);
				//GAME.player.move(playerUnitDir, 0);
				this.monsters[i].move(playerUnitDir * depth, 0);
				
				// if we push them into a block, however, undo everything
				for (var j = 0; j < this.inanimates.length; ++j) {
					if (hitTestRectangleRote(this.monsters[i].bounds.x, this.monsters[i].bounds.y, this.monsters[i].bounds.width, this.monsters[i].bounds.height, 
										 this.inanimates[j].x, this.inanimates[j].y, this.inanimates[j].width, this.inanimates[j].height)) {
						GAME.player.backout();
						this.monsters[i].backout();
						return;
					}
				}
				
				// if we push them out of bounds, undo everything
				if (out_of_bounds(this.monsters[i], this.bounds)) {
					GAME.player.backout();
					this.monsters[i].backout();
					return;
				}
			}
		}
	}
	
	contain(GAME.player, this.bounds);
}

GAME.Level.prototype.moveAndCollidePlayerY = function()
{
	// move y direction
	GAME.player.moveY();
	// if we collide with a block, undo and return
	for (var i = 0; i < this.inanimates.length; ++i) {
		if (hitTestRectangleRote(GAME.player.bounds.x, GAME.player.bounds.y, GAME.player.bounds.width, GAME.player.bounds.height, 
							 this.inanimates[i].x, this.inanimates[i].y, this.inanimates[i].width, this.inanimates[i].height)) {
			GAME.player.backout();
			return;
		}
	}
	
	// for each monster
	for (var i = 0; i < this.monsters.length; ++i) {
		// if we collide
		if (hitTestRectangle(GAME.player.bounds, this.monsters[i].bounds)) {
			// if monster is heavy, stop
			if (this.monsters[i].heavy) {
				GAME.player.backout();
				return;
			// if they're not, move separate them from us along our direction of motion
			} else {
				var playerUnitDir = GAME.player.vy < 0 ? -1 : 1;
				var depth = axis_aligned_intersection_depth('y', GAME.player.bounds, this.monsters[i].bounds);
				
				//GAME.player.move(0, -1 * playerUnitDir * depth);
				//GAME.player.move(0, playerUnitDir);
				
				this.monsters[i].move(0, playerUnitDir * depth);
				
				// if we push them into a block, however, undo everything
				for (var j = 0; j < this.inanimates.length; ++j) {
					if (hitTestRectangleRote(this.monsters[i].bounds.x, this.monsters[i].bounds.y, this.monsters[i].bounds.width, this.monsters[i].bounds.height, 
										 this.inanimates[j].x, this.inanimates[j].y, this.inanimates[j].width, this.inanimates[j].height)) {
						GAME.player.backout();
						this.monsters[i].backout();
						return;
					}
				}
				
				// if we push them out of bounds, undo everything
				if (out_of_bounds(this.monsters[i], this.bounds)) {
					GAME.player.backout();
					this.monsters[i].backout();
					return;
				}
			}
		}
	}
	
	contain(GAME.player, this.bounds);
}

GAME.Level.prototype.moveAndCollideMonsters = function()
{
	for (var i = 0; i < this.monsters.length; ++i) {
		this.monsters[i].update();
		
		// if we escape level, undo and change direction
		if (contain(this.monsters[i], this.bounds)) {
			this.monsters[i].changeDirection();
			continue;
		}
		
		// if we hit the player, undo
		if (hitTestRectangle(this.monsters[i].bounds, GAME.player.bounds)) {
			if (this.monsters[i].heavy) {
				var todo = true;
			} else {
				this.monsters[i].backout();
				continue;
			}
		}
		
		// check for attacking player
		if (GAME.player.attacking && hitTestRectangle(GAME.player.slashBounds, this.monsters[i].bounds)) {
			this.monsters[i].getHit();
		}
		
		// if we hit an inanimate, undo and change direction
		for (var j = 0; j < this.inanimates.length; ++j) {
			if (hitTestRectangleRote(this.monsters[i].bounds.x, this.monsters[i].bounds.y, this.monsters[i].bounds.width, this.monsters[i].bounds.height, 
								 this.inanimates[j].x, this.inanimates[j].y, this.inanimates[j].width, this.inanimates[j].height)) {
				this.monsters[i].backout();
				this.monsters[i].changeDirection();
				break;
			}
		}
	}
}

GAME.Level.prototype.collideWithExit = function()
{
	for (var i = 0; i < this.exits.length; ++i) {
		var exit = this.exits[i];
		var exitRect = { x: exit.x, y: exit.y, width: exit.width, height: exit.height };
	
		if (hitTestRectangle(GAME.player.bounds, exitRect) && 
			rectContains(exitRect, GAME.player.bounds.x + GAME.player.bounds.width / 2, GAME.player.bounds.y + GAME.player.bounds.height * 0.75)) {
			
			// check if cost is met
			var costMet = false;
			
			if (this.exits_data[i].COST < 1) {
				costMet = true;
			} else {
				if ('light_crystal' in GAME.player.inventory) {
					if (this.exits_data[i].COST <= GAME.player.inventory['light_crystal'].quantity) {
						costMet = true;
					} else {
						costMet = false;
					}
				}
			}
			
			// change level fade out etc
			if (costMet) {
				// LATER - if so, set cost met flag and position for view to userAgent
				
				// fade into new level
				this.changeLevel(this.exits_data[i].NEXT, this.exits_data[i].DEST_X, this.exits_data[i].DEST_Y, 500);
			}
		}
	};
}

GAME.Level.prototype.update = function()
{
	if (this.transitioning) {
		return;
	}
	
	GAME.player.update();
	this.moveAndCollidePlayerX();
	this.moveAndCollidePlayerY();
	this.moveAndCollideMonsters();
	this.collideWithExit();
}