"use strict";

GAME.PlayerInputComponent = function () {}

GAME.PlayerInputComponent.constructor = GAME.PlayerInputComponent;

GAME.PlayerInputComponent.prototype.update = function(player) 
{
	this.updateInputRunning(player);
    this.updateInputAttack(player);
    this.updateInputDirectionalMovement(player);
}

GAME.PlayerInputComponent.prototype.updateInputAttack = function(player)
{
    if (xPressed && !player.attacking && !player.onCooldown) {
		player.attacking = true;
        GAME.audio.playSound('slash_1', 0.2);
        setTimeout(function () {
            player.attacking = false;
            player.onCooldown = false; 
        }, GAME.PLAYER_BASE.ATTACK_COOLDOWN);
	}
}

GAME.PlayerInputComponent.prototype.updateInputRunning = function(player)
{
    if (zPressed) {
        player.running = true;
        player.speed = GAME.PLAYER_BASE.RUN_SPEED;
	} else {
        player.running = false;
        player.speed = GAME.PLAYER_BASE.WALK_SPEED;
	}
}

GAME.PlayerInputComponent.prototype.updateInputDirectionalMovement = function(player)
{
    var top = GAME.dirs.length - 1;
    var twoInputs = GAME.dirs.length > 1;
    
	if (GAME.dirs.length) {
		if (GAME.dirs[top] == up) {
            player.direction = GAME.DIRECTION.UP;
			if (twoInputs) {
				if (GAME.dirs[top - 1] == left) {
					player.moveUpLeft();
				} else if (GAME.dirs[top - 1] == right) {
					player.moveUpRight();
				} else {
					player.moveUp();
				}
			} else {
				player.moveUp();
			}
		} else if (GAME.dirs[top] == left) {
            player.direction = GAME.DIRECTION.LEFT;
			if (twoInputs) {
				if (GAME.dirs[top - 1] == down) {
					player.moveDownLeft();
				} else if (GAME.dirs[top - 1] == up) {
					player.moveUpLeft();
				} else {
					player.moveLeft();
				}
			} else {
				player.moveLeft();
			}
		} else if (GAME.dirs[top] == down) {
            player.direction = GAME.DIRECTION.DOWN;
			if (twoInputs) {
				if (GAME.dirs[top - 1] == left) {
					player.moveDownLeft();
				} else if (GAME.dirs[top - 1] == right) {
					player.moveDownRight();
				} else {
					player.moveDown();
				}
			} else {
				player.moveDown();
			}
		} else if (GAME.dirs[top] == right) {
            player.direction = GAME.DIRECTION.RIGHT;
			if (twoInputs) {
				if (GAME.dirs[top - 1] == down) {
					player.moveDownRight();
				} else if (GAME.dirs[top - 1] == up) {
					player.moveUpRight();
				} else {
					player.moveRight();
				}
			} else {
				player.moveRight();
			}
		}
	} else {
		player.stop();
	}
}


