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
 Executes a basic attack in range
 */
GAME.AIBehavior.prototype.simpleAttack = function (monster, player) 
{
	
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
GAME.AIBehavior.prototype.runAwayAvoidCorners = function (monster, player)
{
	
}

/**
 Paths toward the nearest adjacent section to the player within range
 */
GAME.AIBehavior.prototype.aggressIntoCardinalRange = function (monster, player)
{
	
}

/**
 Attacks from the monster's range as long as it is adjacent to the player and not diagonal
 */
GAME.AIBehavior.prototype.attackFromCardinalRange = function (monster, player)
{
	
}

/**
 Simple random pathing algorithm that factors in pauses
 */
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