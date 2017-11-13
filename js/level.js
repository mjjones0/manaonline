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
	
	this.fg = new Sprite(resources[data.FOREGROUND].texture);
	this.fg.width = data.BG_WIDTH;
	this.fg.height = data.BG_HEIGHT;
	
	// music
	this.song = data.SONG;
	
	// create entity containers
	this.objects = [];
	this.objects_data = [];
	this.monsters = [];
	this.monsters_data = [];
	this.exits = [];
	this.exits_data = [];
	
	// process entities in level
	for (var i = 0; i < data.ENTITIES.length; ++i) {
		var entity = data.ENTITIES[i];
		
		if (entity.TYPE == GAME.OBJECT) {
			var object = new Sprite(resources[entity.TEXTURE].texture);
			object.x = entity.X;
			object.y = entity.Y;
			this.objects.push(object);
			this.objects_data.push(entity);
		} else if (entity.TYPE == GAME.MONSTER) {
			var monster = new GAME.Enemy(entity.ID, entity.AGGRESSIVE);
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
	
	// collision stuff
	this.collisions = this.data.COLLISIONS;
	this.rows = this.data.ROWS;
	this.cols = this.data.COLS;
	this.TW = this.data.TW;
	this.TH = this.data.TH;
	
	this.bounds = {
		x: 0,
		y: 0,
		width: this.data.BG_WIDTH,
		height: this.data.BG_HEIGHT
  };
	
	GAME.audio.playMusic(this.song, true, 0.3);
	
	this.engine.view.createScene();
	
	this.showTitle(GAME.LEVELS[name].NAME, 3, 0.5);
}

GAME.Level.prototype.changeLevel = function(name, duration, x, y)
{
	this.monsters.forEach(function (monster) {
		monster.movementDisabled = true;
	});
	GAME.player.movementDisabled = true;
	GAME.player.view.stop();
	
	if (this.titleContainer) {
		this.engine.view.hud.removeChild(this.titleContainer);
	}
	
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

GAME.Level.prototype.showTitle = function(title, showDuration, fadeDuration)
{
	var titleContainer = new Container;

	var style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 24,
		fontStyle: 'normal',
		fontWeight: 'normal',
		fill: ['#ffffff', '#ffff00'], // gradient
		stroke: '#4a1850',
		strokeThickness: 3,
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 440
	});

	var titleSprite = new PIXI.Text(title, style);
	
	var fillColor = 0x111111;
	var borderColor = 0x665D1E;
	var borderWidth = 500;
	var borderHeight = 40;
	var borderThickness = 2;
	
	var border = new PIXI.Graphics();
	border.beginFill(0x000000, 0);
	border.lineStyle(borderThickness, borderColor, 0.5);
	border.drawRect(0, 0, borderWidth, borderHeight);
	
	var fill = new PIXI.Graphics();
	fill.beginFill(fillColor, 0.5);
	fill.lineStyle(1, 0xFFFFFF, 0.0);
	fill.drawRect(borderThickness, borderThickness, 
				  borderWidth 	- (borderThickness * 2), 
				  borderHeight 	- (borderThickness * 2));
				  
	titleSprite.position.x = borderWidth / 2 - titleSprite.width / 2;
	titleSprite.position.y = borderHeight / 2 - titleSprite.height / 2 + 3;
				  
	titleContainer.addChild(fill);
	titleContainer.addChild(border);
	titleContainer.addChild(titleSprite);
	
	titleContainer.position.x = GAME.BASEWIDTH / 2 - titleContainer.width / 2;
	titleContainer.position.y = 4;
	
	var hud = this.engine.view.hud;
	hud.addChild(titleContainer);
	
	this.titleContainer = titleContainer;
	
	// transition out
	setTimeout(function () {
		TweenLite.to(titleContainer, fadeDuration, {
			alpha : 0,
			onComplete: function() {
				hud.removeChild(titleContainer);
			}
		});
		TweenLite.to(titleContainer.position, fadeDuration, {
			x : GAME.BASEWIDTH
		});
	}, showDuration * 1000);
}

GAME.Level.prototype.levelCollide = function(tileRect) 
{
	var colMin = Math.floor(tileRect.x / this.TW);
	var colMax = Math.floor((tileRect.x + tileRect.width) / this.TW);
	
	var rowMin = Math.floor(tileRect.y / this.TH);
	var rowMax = Math.floor((tileRect.y + tileRect.height) / this.TH);
	
	if (colMax > this.cols - 1 || rowMax > this.rows - 1 || colMin < 0 || rowMin < 0) {
		return true;
	}
	
	for (var i = rowMin; i <= rowMax; ++i) {
		for (var j = colMin; j <= colMax; ++j) {
			if (this.collisions[i][j] == 1) {
				return true;
			}
		}
	}
	
	return false;
}

GAME.Level.prototype.moveAndCollidePlayerX = function() 
{
	// move player X -> if we collide into a block, undo
	GAME.player.moveX();
	for (var i = 0; i < this.objects.length; ++i) {
		if (hitTestRectangleRote(GAME.player.bounds.x, GAME.player.bounds.y, GAME.player.bounds.width, GAME.player.bounds.height, 
							 this.objects[i].x, this.objects[i].y, this.objects[i].width, this.objects[i].height)) {
			GAME.player.backout();
			return;
		}
	}
	
	// for each monster
	for (var i = 0; i < this.monsters.length; ++i) {
		if (!this.monsters[i].alive) continue;
		
		// attack collision has wider bounds than other collisions
		if (this.monsters[i].attacking && hitTestRectangle(GAME.player.bounds, this.monsters[i].view)) {
			var damage = this.monsters[i].calculateHit(GAME.player);
			console.log("DAMAGED BY " + damage);
			GAME.player.getHit(damage);
		}
		
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
				for (var j = 0; j < this.objects.length; ++j) {
					if (hitTestRectangleRote(this.monsters[i].bounds.x, this.monsters[i].bounds.y, this.monsters[i].bounds.width, this.monsters[i].bounds.height, 
										 this.objects[j].x, this.objects[j].y, this.objects[j].width, this.objects[j].height)) {
						GAME.player.backout();
						this.monsters[i].backout();
						return;
					}
				}
				
				// if we push them out of bounds, undo everything
				if (this.levelCollide(this.monsters[i].bounds)) {
					GAME.player.backout();
					this.monsters[i].backout();
					return;
				}
			}
		}
	}
	
	if (this.levelCollide(GAME.player.tileBounds)) {
		GAME.player.backout();
	}
}

GAME.Level.prototype.moveAndCollidePlayerY = function()
{
	// move y direction
	GAME.player.moveY();
	// if we collide with a block, undo and return
	for (var i = 0; i < this.objects.length; ++i) {
		if (hitTestRectangleRote(GAME.player.bounds.x, GAME.player.bounds.y, GAME.player.bounds.width, GAME.player.bounds.height, 
							 this.objects[i].x, this.objects[i].y, this.objects[i].width, this.objects[i].height)) {
			GAME.player.backout();
			return;
		}
	}
	
	// for each monster
	for (var i = 0; i < this.monsters.length; ++i) {
		if (!this.monsters[i].alive) continue;
		
		// attack collision has wider bounds than other collisions
		if (this.monsters[i].attacking && hitTestRectangle(GAME.player.bounds, this.monsters[i].view)) {
			var damage = this.monsters[i].calculateHit(GAME.player);
			console.log("DAMAGED BY " + damage);
			GAME.player.getHit(damage);
		}
		
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
				for (var j = 0; j < this.objects.length; ++j) {
					if (hitTestRectangleRote(this.monsters[i].bounds.x, this.monsters[i].bounds.y, this.monsters[i].bounds.width, this.monsters[i].bounds.height, 
										 this.objects[j].x, this.objects[j].y, this.objects[j].width, this.objects[j].height)) {
						GAME.player.backout();
						this.monsters[i].backout();
						return;
					}
				}
				
				// if we push them out of bounds, undo everything
				if (this.levelCollide(this.monsters[i].bounds)) {
					GAME.player.backout();
					this.monsters[i].backout();
					return;
				}
			}
		}
	}
	
	if (this.levelCollide(GAME.player.tileBounds)) {
		GAME.player.backout();
	}
}

GAME.Level.prototype.moveAndCollideMonsters = function()
{
	for (var i = 0; i < this.monsters.length; ++i) {
		this.monsters[i].update();
		
		if (!this.monsters[i].alive) continue;
		
		// check for attacking player
		if (GAME.player.attacking && hitTestRectangle(GAME.player.slashBounds, this.monsters[i].bounds) &&
			GAME.player.middleOfSlash()) {
			this.monsters[i].getHit(GAME.player.calculateHit(this.monsters[i]));
		}
		
		if (this.levelCollide(this.monsters[i].bounds)) {
			this.monsters[i].backout();
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
		
		// if we hit an object, undo and change direction
		for (var j = 0; j < this.objects.length; ++j) {
			if (hitTestRectangleRote(this.monsters[i].bounds.x, this.monsters[i].bounds.y, this.monsters[i].bounds.width, this.monsters[i].bounds.height, 
								 this.objects[j].x, this.objects[j].y, this.objects[j].width, this.objects[j].height)) {
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
			this.changeLevel(this.exits_data[i].NEXT, 500, this.exits_data[i].DEST_X, this.exits_data[i].DEST_Y);
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