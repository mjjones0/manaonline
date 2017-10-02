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
	for (var i = 0; i < GAME.level.inanimates.length; ++i) {
		this.gameScene.removeChild(GAME.level.inanimates[i]);
	}
	if (isMobile) {
		for (var i = 0; i < OnScreenDPad.length; ++i) {
			this.hud.removeChild(OnScreenDPad[i]);
		}
		
		this.hud.interactive = false;
	}
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
	for (var i = 0; i < GAME.level.inanimates.length; ++i) {
		this.gameScene.addChild(GAME.level.inanimates[i]);
	}
	if (isMobile) {
	/*
		for (var i = 0; i < OnScreenDPad.length; ++i) {
			this.hud.addChild(OnScreenDPad[i]);
		}
		*/
		this.hud.addChild(OnScreenWheel);
		
		GAME.input.bindToContainer(this.hud);
	}
}

GAME.View.prototype.moveCamera = function()
{
	var scaledWidthHalved = GAME.BASEWIDTH / GAME.SCALE_X / 2.0;
	var scaledHeightHalved = GAME.BASEHEIGHT / GAME.SCALE_Y / 2.0;

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
}

GAME.View.prototype.update = function()
{
	this.moveCamera();

	this.renderer.render(this.stage);
}