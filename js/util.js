"use strict";

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function contain(sprite, container) {
    var collision = undefined;

    //Left
    if (sprite.position.x < container.x) {
		sprite.move(container.x - sprite.position.x, 0);
        collision = "left";
    }

    //Top
    if (sprite.position.y < container.y) {
		sprite.move(0, container.y - sprite.position.y);
        collision = "top";
    }

    //Right
    if (sprite.position.x + sprite.width > container.width) {
		sprite.move(-1 * (sprite.position.x + sprite.width - container.width), 0);
        collision = "right";
    }

    //Bottom
    if (sprite.position.y + sprite.height > container.height) {
		sprite.move(0, -1 * (sprite.position.y + sprite.height - container.height));
        collision = "bottom";
    }

    // Return the `collision` value
    return collision;
}

function contain_pixels(sprite, container) {

}

function out_of_bounds(sprite, container) {
    //Left
    if (sprite.position.x < container.x) {
		return true;
    }

    //Top
    if (sprite.position.y < container.y) {
		return true;
    }

    //Right
    if (sprite.position.x + sprite.width > container.width) {
		return true;
    }

    //Bottom
    if (sprite.position.y + sprite.height > container.height) {
        return true;
    }

    // Return the `collision` value
    return false;
}

function axis_aligned_intersection_depth(axis, rectA, rectB) {
	if (axis == 'x') {
		var centerAX = rectA.x + rectA.width / 2;
		var centerBX = rectB.x + rectB.width / 2;
		var sumOfHalfWidths = rectA.width / 2 + rectB.width / 2;
		
		return sumOfHalfWidths - Math.abs(centerBX - centerAX);
	// assume 'y'
	} else {
		var centerAY = rectA.y + rectA.height / 2;
		var centerBY = rectB.y + rectB.height / 2;
		var sumOfHalfHeights = rectA.height / 2 + rectB.height / 2;
		
		return sumOfHalfHeights - Math.abs(centerBY - centerAY);
	}
}

function vector_length(x, y) {
	return Math.sqrt(x*x + y*y);
}

function unit_vector(x, y) {
	return [x / vector_length(x,y), y / vector_length(x,y)];
}

function rectContains(r1, x, y) {
	return x >= r1.x && x <= r1.x + r1.width && 
		   y >= r1.y && y <= r1.y + r1.height;
}

function circleContains(cx, cy, radius, x, y) {
	var dX = x - cx;
	var dY = y - cy;
	var dSq = dX * dX + dY * dY;
	var radiusSq = radius * radius;
	return radiusSq >= dSq;
}

function hitTestRectangleRote(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    // Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    // hit will determine whether there's a collision
    hit = false;

    // Find the center points of each sprite
    var r1cX = r1x + r1w / 2;
    var r1cY = r1y + r1h / 2;
    var r2cX = r2x + r2w / 2;
    var r2cY = r2y + r2h / 2;

    // Find the half-widths and half-heights of each sprite
    var r1hW = r1w / 2;
    var r1hH = r1h / 2;
    var r2hW = r2w / 2;
    var r2hH = r2h / 2;

    // Calculate the distance vector between the sprites
    vx = r1cX - r2cX;
    vy = r1cY - r2cY;

    // Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1hW + r2hW;
    combinedHalfHeights = r1hH + r2hH;

    // if distance between centers along X axis or Y axis is less than the sum of the half-lengths of either axis,
    // there is a collision
    return Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights;
};

function hitTestRectangle(r1, r2) {
    // Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    // hit will determine whether there's a collision
    hit = false;

    // Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    // Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    // Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    // Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    // if distance between centers along X axis or Y axis is less than the sum of the half-lengths of either axis,
    // there is a collision
    return Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights;
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );

    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}