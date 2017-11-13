GAME.monster_behaviors = {};

GAME.monster_behaviors['rabite_passive'] = function (monster) 
{
	var player = GAME.player;
	if (monster.health < monster.maxHealth * 0.5) {
		GAME.ai.cardinalRunAway(monster, player);
	} else {
		GAME.ai.simpleCardinalPathing(monster);
	}
}

GAME.monster_behaviors['rabite_aggressive'] = function (monster)
{
	if (monster.attacking || monster.isHit || monster.dying) return;

	var player = GAME.player;
	if (monster.health > monster.maxHealth * 0.2) {
		if (distanceSquared(monster, player) < monster.range * monster.range) {
			monster.attacking = true;
			var dir = directionToward(monster, player);
			
			if (dir == 'right') {
				monster.view.textures = monster.frames['attack_left'];
				monster.view.scale.x = -1;
			} else {
				monster.view.textures = monster.frames['attack_' + directionToward(monster, player)];
				monster.view.scale.x = 1;
			}
			monster.view.loop = false;
			monster.view.onComplete = function () {
				monster.attacking = false;
			};
			monster.view.gotoAndPlay(0);
			return;
		}
	}

	if (monster.health < monster.maxHealth * 0.5) {
		GAME.ai.cardinalRunAway(monster, player);
	} else {
		GAME.ai.simpleAggress(monster, player);
	
		/*
		var pRow = Math.floor(player.bounds.x / GAME.level.TW);
		var pCol = Math.floor(player.bounds.y / GAME.level.TH);
		
		// only recalculate when the player moves to a new cell
		if (!(pRow == monster.destRow && pCol == monster.destCol)) {
			var dest = GAME.ai.findPath(monster, player, GAME.level);	
			monster.destPath = dest;
			monster.destRow = dest.x_index;
			monster.destCol = dest.y_index;
		} else {
			dest = monster.destPath;
		}
		
		if (!dest) {
			GAME.ai.simpleCardinalPathing(monster);
			return;
		}
		
		// get cell params
		var mRow = Math.floor(monster.bounds.x / GAME.level.TW);
		var mCol = Math.floor(monster.bounds.y / GAME.level.TH);
		
		// find our cell
		var cell = dest;
		var prev = dest;
		while (cell.x_index != mRow || cell.y_index != mCol) {
			prev = cell;
			cell = cell.parent;
			
			if (!cell) {
				break;
			}
		}
		
		// move in direction of next cell
		if (cell) {
			var xDir = prev.x_index - cell.x_index;
			var yDir = prev.y_index - cell.y_index;
			
			monster.vx = xDir * monster.speed;
			monster.vy = yDir * monster.speed;
			
			if (Math.abs(xDir) && Math.abs(yDir)) {
				monster.vx *= GAME.ROOTTWOOVERTWO;
				monster.vy *= GAME.ROOTTWOOVERTWO;
			}
		} else {
			GAME.ai.simpleCardinalPathing(monster);
		}
		*/
	}
}