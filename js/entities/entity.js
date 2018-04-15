"use strict";

GAME.Entity = function () {
    this.position = new PIXI.Point();
	this.previous = new PIXI.Point();
	
	this.vx = 0;
    this.vy = 0;

	this.speed = 0;
	this.direction = GAME.DIRECTION.NONE;
}

GAME.Entity.constructor = GAME.Entity;

GAME.Entity.prototype.setPosition = function(x, y)
{
    this.previous.x = this.position.x;
	this.previous.y = this.position.y;
	
	this.position.x = x;
	this.position.y = y;
}

GAME.Entity.prototype.moveX = function()
{
	this.move(this.vx, 0);
}

GAME.Entity.prototype.moveY = function()
{
	this.move(0, this.vy);
}

GAME.Entity.prototype.backout = function()
{
	this.setPosition(this.previous.x, this.previous.y);
}

GAME.Entity.prototype.move = function(x, y)
{
	this.setPosition(this.position.x + x, this.position.y + y);
}

GAME.Entity.prototype.moveUp = function()
{
	this.vx = 0;
	this.vy = -this.speed;
}

GAME.Entity.prototype.moveRight = function()
{
	this.vy = 0;
	this.vx = this.speed;
}

GAME.Entity.prototype.moveDown = function()
{
	this.vx = 0;
	this.vy = this.speed;
}

GAME.Entity.prototype.moveLeft = function()
{
	this.vy = 0;
	this.vx = -this.speed;
}

GAME.Entity.prototype.moveUpLeft = function()
{
	this.vy = -this.speed * GAME.ROOTTWOOVERTWO;
	this.vx = -this.speed * GAME.ROOTTWOOVERTWO;
}

GAME.Entity.prototype.moveUpRight = function()
{
	this.vy = -this.speed * GAME.ROOTTWOOVERTWO;
	this.vx = this.speed * GAME.ROOTTWOOVERTWO;
}

GAME.Entity.prototype.moveDownLeft = function()
{
	this.vy = this.speed * GAME.ROOTTWOOVERTWO;
	this.vx = -this.speed * GAME.ROOTTWOOVERTWO;
}

GAME.Entity.prototype.moveDownRight = function()
{
	this.vy = this.speed * GAME.ROOTTWOOVERTWO;
	this.vx = this.speed * GAME.ROOTTWOOVERTWO;
}

GAME.Entity.prototype.stop = function()
{
    this.vx = 0;
    this.vy = 0;
}