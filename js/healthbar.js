"use strict";

GAME.Healthbar = function() 
{
	this.max = 0;
	this.current = 0;
	
	this.border = new PIXI.Graphics();
	this.fill = new PIXI.Graphics();
	this.view = new Container();
	
	this.view.addChild(this.border);
	this.view.addChild(this.fill);
	
	this.width = 0;
	this.height = 0;
}

GAME.Healthbar.constructor = GAME.Healthbar;

GAME.Healthbar.prototype.create = function(borderColor, borderThickness, borderWidth, borderHeight, fillColor) 
{
	this.border.clear();
	this.fill.clear();
	
	// transparent background
	this.border.beginFill(0x000000, 0);
	// non-transparent edges
	this.border.lineStyle(borderThickness, borderColor, 0.75);
	this.border.drawRect(0, 0, borderWidth, borderHeight);
	
	// fill
	this.fill.beginFill(fillColor, 0.75);
	this.fill.lineStyle(1, 0xFFFFFF, 0.0);
	this.fill.drawRect(borderThickness, borderThickness, 
					   borderWidth - (borderThickness * 2), 
					   borderHeight - (borderThickness * 2));
	
	this.width = borderWidth;
	this.height = borderHeight;
}

GAME.Healthbar.prototype.damage = function(damage)
{
	if (this.current - damage < 0) {
		damage = this.current;
	}

	// put in view
	this.view.alpha = 1;
	
	var fromFill = this.current / this.max;
	var toFill = (this.current - damage) / this.max;
	
	// tween a flash fade in (white to dest color)
	TweenLite.to(this.view, 1, {
		alpha : 0.5 
	});
	
	// tween a scale decrease of the fill
	TweenLite.to(this.fill.scale, 0.75, {
		x : (this.current - damage) / this.max,
		ease : Cubic.easeOut
	});
	
	this.current = this.current - damage;
}

GAME.Healthbar.prototype.heal = function(heal)
{
	if (this.current + heal > this.max) {
		heal = this.max - this.current;
	}
	
	this.view.alpha = 1;
	
	var fromFill = this.current / this.max;
	var toFill = (this.current + heal) / this.max;
	
	// tween a flash fade in (light green to dest color)
	// tween a scale increase of the fill
	// tween a fade out after the scale increase
	
	this.setCurrent(this.current + heal);
}

GAME.Healthbar.prototype.setMax = function(maxHealth)
{
	this.max = maxHealth;
	this.fill.scale.x = this.current / this.max;
}

GAME.Healthbar.prototype.setCurrent = function(currentHealth)
{
	this.current = currentHealth;
	this.fill.scale.x = this.current / this.max;
}
