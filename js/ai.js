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

GAME.AIBehavior.prototype.basicAttackInCardinalRange = function (monster, player)
{
	if (distanceSquared(monster, player) <= monster.range) {
		monster.basicAttack(directionToward(monster, player));
	}
}

GAME.AIBehavior.prototype.nodeThingy = function(traversable, x_index, y_index) 
{
	var obj = {};
  obj.x_index = x_index;
  obj.y_index = y_index;
  obj.f_cost = null;
  obj.g_cost = null;
  obj.h_cost = null;
  obj.parent = null;
	return obj;
}

GAME.AIBehavior.prototype.findPath = function(monster, player, level) 
{
  var rows = level.collisions.length;
  var cols = level.collisions[0].length;
  var startRow = Math.floor(monster.bounds.x / level.TW);
  var startCol = Math.floor(monster.bounds.y / level.TH);
  var endRow = Math.floor(player.bounds.x / level.TW);
  var endCol = Math.floor(player.bounds.y / level.TH);

  var openList = new Array();
  var closedList = new Array();

  startNode = this.nodeThingy(0, startRow, startCol);
	
  startNode.f_cost = 0;
  startNode.g_cost = 14 * Math.abs(startRow - endRow) + 10 * Math.abs(startCol - endCol); 
  startNode.h_cost = startNode.f_cost + startNode.g_cost;

  openList.push(startNode);

  while (true) {
    // If there just isn't any path return
    if (openList.length == 0) {
      return;
    }

    // Set "current" as the node in openList with lowest F score
    var low_index = 0;
    var h_low = 1000000;
		var g_low = 1000000;

    for (var i = 0; i < openList.length; i++) {
      if (openList[i].h_cost <= h_low && openList[i].g_cost < g_low) {
        low_index = i;
				g_low = openList[i].g_cost;
				h_low = openList[i].h_cost;
      }
    }
		
    current = openList[low_index];
    closedList.push(current); 
    openList.splice(low_index, 1);

		// This node has parents that link all the way back
    if (current.x_index == endRow && current.y_index == endCol) {
      return current;
    }

    // UP                                            
    if (current.y_index < (cols - 1) && !(level.collisions[current.x_index][current.y_index + 1] == 1)) {
      newNode = this.nodeThingy(0, current.x_index, current.y_index + 1);
			
			var closed = false;
      for (var i = 0; i < closedList.length; i++) {
        if (closedList[i].x_index == newNode.x_index && closedList[i].y_index == newNode.y_index) {
          closed = true;
					break;
        }
      }
			
			if (!closed) {
				newNode.f_cost = 14 * Math.abs(startRow - newNode.x_index) + 10 * Math.abs(startCol - newNode.y_index); 
				newNode.g_cost = 14 * Math.abs(endRow - newNode.x_index) + 10 * Math.abs(endCol - newNode.y_index); 
				newNode.h_cost = newNode.f_cost + newNode.g_cost; 
				newNode.parent = current; 
				openList.push(newNode);
			}
    }

    // RIGHT
    if (current.x_index < (rows - 1) && !(level.collisions[current.x_index + 1][current.y_index] == 1)) {
      newNode = this.nodeThingy(0, current.x_index + 1, current.y_index);
			
			var closed = false;
      for (var i = 0; i < closedList.length; i++) {
        if (closedList[i].x_index == newNode.x_index && closedList[i].y_index == newNode.y_index) {
          closed = true;
					break;
        }
      }
			
			if (!closed) {
				newNode.f_cost = 14 * Math.abs(startRow - newNode.x_index) + 10 * Math.abs(startCol - newNode.y_index);
				newNode.g_cost = 14 * Math.abs(endRow - newNode.x_index) + 10 * Math.abs(endCol - newNode.y_index);
				newNode.h_cost = newNode.f_cost + newNode.g_cost;
				newNode.parent = current;
				openList.push(newNode);
			}
    }

    // DOWN
    if (current.y_index > 0 && !(level.collisions[current.x_index][current.y_index - 1] == 1)) {
      newNode = this.nodeThingy(0, current.x_index, current.y_index - 1);
			
			var closed = false;
      for (var i = 0; i < closedList.length; i++) {
        if (closedList[i].x_index == newNode.x_index && closedList[i].y_index == newNode.y_index) {
          closed = true;
					break;
        }
      }
			
			if (!closed) {
				newNode.f_cost = 14 * Math.abs(startRow - newNode.x_index) + 10 * Math.abs(startCol - newNode.y_index);
				newNode.g_cost = 14 * Math.abs(endRow - newNode.x_index) + 10 * Math.abs(endCol - newNode.y_index);
				newNode.h_cost = newNode.f_cost + newNode.g_cost;
				newNode.parent = current;
				openList.push(newNode);
			}
    }

    // LEFT
    if (current.x_index > 0 && !(level.collisions[current.x_index - 1][current.y_index] == 1)) {
      newNode = this.nodeThingy(0, current.x_index - 1, current.y_index);
			
			var closed = false;
      for (var i = 0; i < closedList.length; i++) {
        if (closedList[i].x_index == newNode.x_index && closedList[i].y_index == newNode.y_index) {
					closed = true;
					break;
        }
      }
			
			if (!closed) {
				newNode.f_cost = 14 * Math.abs(startRow - newNode.x_index) + 10 * Math.abs(startCol - newNode.y_index);
				newNode.g_cost = 14 * Math.abs(endRow - newNode.x_index) + 10 * Math.abs(endCol - newNode.y_index);
				newNode.h_cost = newNode.f_cost + newNode.g_cost;
				newNode.parent = current;
				openList.push(newNode);
			}
    }
  }
}