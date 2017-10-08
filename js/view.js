"use strict";

GAME.View = function(engine)
{
	this.engine = engine;
	this.renderer = PIXI.autoDetectRenderer(GAME.BASEWIDTH, GAME.BASEHEIGHT);
	
	GAME.fade = new PIXI.Sprite.fromImage("img/blackSquare.jpg");
	GAME.fade.width = GAME.BASEWIDTH;
	GAME.fade.height = GAME.BASEHEIGHT;
	
	this.stage = new Container();
    this.hud = new Container();
    this.gameScene = new Container();
	
	this.stage.addChild(this.gameScene);
	this.stage.addChild(this.hud);
}

GAME.View.constructor = GAME.View;

GAME.View.prototype.clearScene = function()
{
	this.gameScene.removeChild(GAME.level.bg);
	
	for (var i = 0; i < GAME.level.exits.length; ++i) {
		this.gameScene.removeChild(GAME.level.exits[i]);
	}
	this.gameScene.removeChild(GAME.player.view);
	for (var i = 0; i < GAME.level.monsters.length; ++i) {
		this.gameScene.removeChild(GAME.level.monsters[i].view);
	}
	for (var i = 0; i < GAME.level.objects.length; ++i) {
		this.gameScene.removeChild(GAME.level.objects[i]);
	}
	for (var i = 0; i < GAME.level.monsters.length; ++i) {
		this.gameScene.removeChild(GAME.level.monsters[i].healthbar.view);
	}
	this.gameScene.removeChild(GAME.player.healthbar.view);
	if (isMobile) {
		this.hud.removeChild(OnScreenWheel);
		this.hud.removeChild(OnScreenRun);
		this.hud.removeChild(OnScreenAttack);
		this.hud.interactive = false;
	} else {
		this.hud.removeChild(OnScreenZ);
		this.hud.removeChild(OnScreenX);
	}
}

GAME.View.prototype.arcingText = function(text, startPosition, endPosition, durationInFrames, color) 
{
	var style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 12,
		fontStyle: 'normal',
		fontWeight: 'normal',
		fill: ['#ffffff', color],
		stroke: '#4a1850',
		strokeThickness: 2
	});

	var textSprite = new PIXI.Text(text, style);
	textSprite.position.x = startPosition.x;
	textSprite.position.y = startPosition.y;
	
	this.gameScene.addChild(textSprite);
	var gameScene = this.gameScene;
	
	TweenLite.to(textSprite.position, durationInFrames, {
		x : endPosition.x,
		y : endPosition.y,
		ease : Cubic.EaseOut,
		useFrames : true,
		onComplete : function () {
			gameScene.removeChild(textSprite);
		}
	});
} 

GAME.View.prototype.createScene = function()
{
	this.gameScene.addChild(GAME.level.bg);
	for (var i = 0; i < GAME.level.exits.length; ++i) {
		this.gameScene.addChild(GAME.level.exits[i]);
	}
	this.gameScene.addChild(GAME.player.view);
	for (var i = 0; i < GAME.level.monsters.length; ++i) {
		this.gameScene.addChild(GAME.level.monsters[i].view);
	}
	for (var i = 0; i < GAME.level.objects.length; ++i) {
		this.gameScene.addChild(GAME.level.objects[i]);
	}
	this.gameScene.addChild(GAME.level.fg);
	for (var i = 0; i < GAME.level.monsters.length; ++i) {
		this.gameScene.addChild(GAME.level.monsters[i].healthbar.view);
	}
	this.gameScene.addChild(GAME.player.healthbar.view);
	if (isMobile) {
		this.hud.addChild(OnScreenWheel);
		this.hud.addChild(OnScreenRun);
		this.hud.addChild(OnScreenAttack);
		this.hud.interactive = true;
	} else {
		this.hud.addChild(OnScreenZ);
		this.hud.addChild(OnScreenX);
	}
}

GAME.View.prototype.moveCamera = function()
{
	var scaledWidthHalved = GAME.BASEWIDTH / GAME.SCALE_X / 2.0;
	var scaledHeightHalved = GAME.BASEHEIGHT / GAME.SCALE_Y / 2.0;
	
	var zoomWidth = GAME.BASEWIDTH / GAME.SCALE_X;
	var zoomHeight = GAME.BASEHEIGHT / GAME.SCALE_Y;

	var stageWidth = GAME.level.width;
	var stageHeight = GAME.level.height;
	
	var scaledWidth = stageWidth / GAME.SCALE_X;
	var scaledHeight = stageHeight / GAME.SCALE_Y;
	
	this.gameScene.scale.x = GAME.SCALE_X;
	this.gameScene.scale.y = GAME.SCALE_Y;
	
	var fovX = scaledWidthHalved;
	var fovY = scaledHeightHalved;
	
	if (GAME.player.position.x >= fovX &&
		GAME.player.position.x <= stageWidth - fovX) {
		this.gameScene.position.x = (fovX - GAME.player.position.x) * GAME.SCALE_X;
	} else if (GAME.player.position.x < fovX) {
		this.gameScene.position.x = 0;
	} else {
		this.gameScene.position.x = (fovX - (stageWidth - fovX)) * GAME.SCALE_X; 
	}
	
	if (GAME.player.position.y >= fovY &&
		GAME.player.position.y <= stageHeight - fovY) {
		this.gameScene.position.y = (fovY - GAME.player.position.y) * GAME.SCALE_Y;
	} else if (GAME.player.position.y < fovY) {
		this.gameScene.position.y = 0;
	} else {
		this.gameScene.position.y = (fovY - (stageHeight - fovY)) * GAME.SCALE_Y;
	}
	
	if (stageWidth <= scaledWidthHalved * 2.0) {
		var diffHalved = (scaledWidthHalved * 2.0 - stageWidth) / 2.0;
		this.gameScene.position.x = diffHalved * this.gameScene.scale.x;
	}
	
	if (stageHeight <= scaledHeightHalved * 2.0) {
		var diffHalved = (scaledHeightHalved * 2.0 - stageHeight) / 2.0;
		this.gameScene.position.y = diffHalved * this.gameScene.scale.y;
	}
}

GAME.View.prototype.update = function()
{
	this.moveCamera();

	this.renderer.render(this.stage);
}