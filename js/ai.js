GAME.AIBehavior = function () {}

GAME.AIBehavior.constructor = GAME.AIBehavior;

/**
 Runs directly at the player with intent to collide/attack
 */
GAME.AIBehavior.prototype.simpleAggress = function (monster, player) 
{
	var distX = player.bounds.x - monster.bounds.x;
	var distY = player.bounds.y - monster.bounds.y;
	var toward = unit_vector(distX, distY);
	monster.vx = toward[0] * monster.speed; // * scalingFactorX;
	monster.vy = toward[1] * monster.speed; // * scalingFactorY;
}

/**
 Runs away blindly using simple reverse direction
 */
GAME.AIBehavior.prototype.simpleRunAway = function (monster, player)
{
	var distX = monster.bounds.x - player.bounds.x;
	var distY = monster.bounds.y - player.bounds.y;
	var toward = unit_vector(distX, distY);
	monster.vx = toward[0] * monster.speed; // * scalingFactorX;
	monster.vy = toward[1] * monster.speed; // * scalingFactorY;
}

/**
 Runs away and does some projection to decide when to pivot if we will hit a corner
 */
GAME.AIBehavior.prototype.cardinalRunAway = function (monster, player)
{
	var distX = monster.bounds.x - player.bounds.x;
	var distY = monster.bounds.y - player.bounds.y;
	var toward = unit_vector(distX, distY);
	
	// X axis longer
	if (Math.abs(toward[0]) > Math.abs(toward[1])) {
		// left
		if (toward[0] < 0) {
			monster.moveLeft();
		// right	
		} else {
			monster.moveRight();
		}
	// Y axis longer
	} else {
		// up
		if (toward[1] < 0) {
			monster.moveUp();
		// down	
		} else {
			monster.moveDown();
		}
	}
}

/**
 Paths toward the nearest adjacent section to the player within range
 */
GAME.AIBehavior.prototype.cardinalAggress = function (monster, player)
{
	var distX = player.bounds.x - monster.bounds.x;
	var distY = player.bounds.y - monster.bounds.y;
	var toward = unit_vector(distX, distY);
	
	// X axis longer
	if (Math.abs(toward[0]) > Math.abs(toward[1])) {
		// left
		if (toward[0] < 0) {
			monster.moveLeft();
		// right	
		} else {
			monster.moveRight();
		}
	// Y axis longer
	} else {
		// up
		if (toward[1] < 0) {
			monster.moveUp();
		// down	
		} else {
			monster.moveDown();
		}
	}
}

GAME.AIBehavior.prototype.strafe = function (monster, player) {
	var distX = player.bounds.x - monster.bounds.x;
	var distY = player.bounds.y - monster.bounds.y;
	var toward = unit_vector(distX, distY);
	
	// X axis longer
	if (Math.abs(toward[0]) > Math.abs(toward[1])) {
		// left
		if (toward[0] < 0) {
			monster.moveLeft();
		// right	
		} else {
			monster.moveRight();
		}
	// Y axis longer
	} else {
		// up
		if (toward[1] < 0) {
			monster.moveUp();
		// down	
		} else {
			monster.moveLeft();
		}
	}
}

GAME.AIBehavior.prototype.simpleCardinalPathing = function (monster) 
{
	if (monster.moveFramesLeft == 0) {
		monster.moveFramesLeft = randomInt(100, 200);
		monster.moveDirection = randomInt(1, 7);
		if (monster.moveDirection > 4) {
			monster.moveFramesLeft = 60;
		}
	} else {
		--monster.moveFramesLeft;
	}
	
	if (monster.moveDirection == 1) {
		monster.moveUp();
	} else if (monster.moveDirection == 2) {
		monster.moveLeft();
	} else if (monster.moveDirection == 3) {
		monster.moveDown();
	} else if (monster.moveDirection == 4) {
		monster.moveRight();
	} else {
		monster.stop();
	}
}

GAME.AIBehavior.prototype.simpleIntercardinalMovement = function (monster) 
{
	if (monster.moveFramesLeft == 0) {
		monster.moveFramesLeft = randomInt(100, 200);
		monster.moveDirection = randomInt(1, 11);
		if (monster.moveDirection > 8) {
			monster.moveFramesLeft = 60;
		}
	} else {
		--monster.moveFramesLeft;
	}
	
	if (monster.moveDirection == 1) {
		monster.moveUp();
	} else if (monster.moveDirection == 2) {
		monster.moveLeft();
	} else if (monster.moveDirection == 3) {
		monster.moveDown();
	} else if (monster.moveDirection == 4) {
		monster.moveRight();
	} else if (monster.moveDirection == 5) {
		monster.moveUpLeft();
	} else if (monster.moveDirection == 6) {
		monster.moveUpRight();
	} else if (monster.moveDirection == 7) {
		monster.moveDownLeft();
	} else if (monster.moveDirection == 8) {
		monster.moveDownRight();
	} else {
		monster.stop();
	}
}