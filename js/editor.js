// WARNING FOR LOCAL USE CURRENTLY:
// ALL ASSETS YOU WANT TO LOAD IN MUST BE IN THE IMG FOLDER JUST LIKE THE REST OF THE CONTENT IN THE GAME
// REASON BEING IS BROWSERS PREVENT YOU FROM SEEING ABSOLUTE FILE PATHS
// - THIS WILL PROBABLY CHANGE WHEN WE MOVE SERVER SIDE

var level = { 
	ID: '',
	NAME: '',
	SONG: '',
	FOREGROUND: '',
	BACKGROUND: '',
	TW: 0,
	TH: 0,
	ROWS: 0,
	COLS: 0,
	BG_WIDTH: 0,
	BG_HEIGHT: 0,
	COLLISIONS: [],
	ENTITIES: []
};

var DEFAULT_WIDTH = 800;
var DEFAULT_HEIGHT = 600;

var DEFAULT = 0;
var SET_COLLISIONS = 1;
var PLACE_ENTITY = 2;
var REMOVE_ENTITY = 3;
var editorState = DEFAULT;

var app, foregroundDisplayGroup, backgroundDisplayGroup, entityDisplayGroup;

var levelScaleX, levelScaleY;

var foreground, background, grid, tiles;
var entitySprites = {};

document.addEventListener("DOMContentLoaded", function(event) {
	PIXI.loader
		.add(["img/rabite_monster.png", "img/exit.png", "img/spawn.png", "img/object.png"])
		.load(init);
});

function init() {
	clearForm();
	bindEventHandlers();
	loadEntities();
	loadSongs();
	loadTextures();

	foregroundDisplayGroup = new PIXI.DisplayGroup(1, false);
	backgroundDisplayGroup = new PIXI.DisplayGroup(0, false);
	gridDisplayGroup = new PIXI.DisplayGroup(2, false);
	entityDisplayGroup = new PIXI.DisplayGroup(3, false);
	
	app = new PIXI.Application(DEFAULT_WIDTH, DEFAULT_HEIGHT, {backgroundColor: 0x061639});
	
	app.stage.displayList = new PIXI.DisplayList();
	
	app.view.style.margin = "0 auto";
	app.view.style.display = "block";
	document.getElementById('centerContent').appendChild(app.view);
	
	app.stage.interactive = true;
	app.stage.on('pointerdown', editorOnPointerDown);
}





function clearForm() {
	document.getElementById("loadFG").value = "";
	document.getElementById("loadBG").value = "";
	document.getElementById('tileWidth').value = 10;
	document.getElementById('tileHeight').value = 10;
	document.getElementById('title').value = "";
	hideExitSettings();
}

function loadSongs() {
	var songs = document.getElementById('songs');
	
	for (var i = 0; i < GAME.SONGS.length; ++i) {
		console.log("loading song");
		var song = document.createElement('option');
		song.value = GAME.SONGS[i];
		song.innerHTML = GAME.SONGS[i];
		songs.appendChild(song);
	}
}

function loadTextures() {
	var objects = document.getElementById('objects');
	
	for (var i = 0; i < GAME.OBJECTS.length; ++i) {
		var obj = document.createElement('option');
		obj.value = GAME.OBJECTS[i];
		obj.innerHTML = GAME.OBJECTS[i];
		objects.appendChild(obj);
	}
}

function loadEntities() {
	var entities = document.getElementById('entities');
	
	var exit = document.createElement('option');
	exit.value = "exit";
	exit.innerHTML = "exit";
	entities.appendChild(exit);
	
	var spawn = document.createElement('option');
	spawn.value = "spawn";
	spawn.innerHTML = "spawn";
	entities.appendChild(spawn);
	
	var object = document.createElement('option');
	object.value = "object";
	object.innerHTML = "object";
	entities.appendChild(object);
	
	for (var key in GAME.MONSTERS) {
		if (GAME.MONSTERS.hasOwnProperty(key)) {
			var opt = document.createElement('option');
			opt.value = GAME.MONSTERS[key].NAME;
			opt.innerHTML = GAME.MONSTERS[key].NAME;
			entities.appendChild(opt);
		}
	}
}

function loadLevel() {
	
}

function loadFG(){
    var path = document.getElementById("loadFG").value;
	path = 'img/' + path.substring(path.indexOf("fakepath") + 9);
	
	if (foreground) {
		app.stage.removeChild(foreground);
	}
	
	var onLoaded = function () {
		foreground = new PIXI.Sprite(PIXI.Texture.fromImage(path));
		scaleToStage(foreground);
		foreground.displayGroup = foregroundDisplayGroup;
		app.stage.addChild(foreground);
		level.FOREGROUND = path;
	};
		
	if (!(path in PIXI.loader.resources)) {
		PIXI.loader.add([path]).load(onLoaded);
	} else {
		onLoaded();
	}
}

function loadBG(){
    var path = document.getElementById("loadBG").value;
	path = 'img/' + path.substring(path.indexOf("fakepath") + 9);
	
	if (background) {
		app.stage.removeChild(background);
	}
		
	var onLoaded = function () {
		background = new PIXI.Sprite(PIXI.Texture.fromImage(path));
		level.BG_WIDTH = background.width;
		level.BG_HEIGHT = background.height;
		scaleToStage(background);
		levelScaleX = background.scale.x;
		levelScaleY = background.scale.y;
		background.displayGroup = backgroundDisplayGroup;
		app.stage.addChild(background);
		level.BACKGROUND = path;
	};
	
	if (!(path in PIXI.loader.resources)) {
		PIXI.loader.add([path]).load(onLoaded);
	} else {
		onLoaded();
	}
}

function setTileWidth() {
	var value = document.getElementById('tileWidth').value;

	if (!parseInt(value, 10)) {
		alert("TILE WIDTH MUST BE A NUMBER");
	} else {
		level.TW = parseInt(value, 10);
		
		if (level.TH && level.TW && background) {
			drawTileGrid();
		}
	}
}

function setTileHeight() {
	var value = document.getElementById('tileHeight').value;

	if (!parseInt(value, 10)) {
		alert("TILE HEIGHT MUST BE A NUMBER");
	} else {
		level.TH = parseInt(value, 10);
		
		if (level.TH && level.TW && background) {
			drawTileGrid();
		}
	}
}

function setTitle() {
	level.NAME = document.getElementById('title').value;
}

function setSong() {
	level.SONG = document.getElementById('songs').value;
}

function setCollisions() {
	if (editorState != SET_COLLISIONS) {
		editorState = SET_COLLISIONS;
		document.getElementById('collisions').innerHTML = "Finish collisions";
	} else {
		editorState = DEFAULT;
		document.getElementById('collisions').innerHTML = "Set collisions";
	}
}

function addEntity() {
	// if state is collisions do nothing and show a message indicating why
	if (editorState == SET_COLLISIONS) {
		alert("You cannot add entities while selecting collision tiles!");
		return;
	}
	
	// get select drop-down entity selection and put into the center of the stage
	var entityDescriptor = document.getElementById('entities').value;
	var entitySprite = createEntitySprite(entityDescriptor);
	
	// bind event handlers to it
	subscribe(entitySprite);
	
	// move into center
	entitySprite.position.x = (app.stage.width / 2 - entitySprite.width / 2);
	entitySprite.position.y = (app.stage.height / 2 - entitySprite.height / 2);
	
	if (entityDescriptor != "spawn" && entityDescriptor != "object") {
		entitySprite.scale.x = levelScaleX;
		entitySprite.scale.y = levelScaleY;
	}
	
	displayEntitySettings(entitySprite, entityDescriptor);
	
	app.stage.addChild(entitySprite);
}

function save() {
	// grab entities from the in-memory structure
	for (var key in entitySprites) {
		if (entitySprites.hasOwnProperty(key) && entitySprites[key]) {
			level.ENTITIES.push(getEntityObject(entitySprites[key]));
		}
	}
	
	// get rows and cols if present
	if (!level.COLLISIONS[0]) {
		alert("Warning! No collisions have been set for the level!");
	} else {
		level.ROWS = level.COLLISIONS.length;
		level.COLS = level.COLLISIONS[0].length;
	}

	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(level));
	window.open(url, '_blank');
	window.focus();
}

function clear() {
	app.stage.removeChildren();
	
	level = { 
		ID: '',
		NAME: '',
		SONG: '',
		FOREGROUND: '',
		BACKGROUND: '',
		TW: 0,
		TH: 0,
		ROWS: 0,
		COLS: 0,
		COLLISIONS: [],
		ENTITIES: []
	};
	
	editorState = DEFAULT;
	
	clearForm();
	
	grid = undefined;
	tiles = undefined;
	entitySprites = {};
}



function hideObjectSettings() {
	document.getElementById('objectSettings').style.display = 'none';
}

function showObjectSettings(entity) {
	document.getElementById('objectSettings').style.display = 'block';
	
	document.getElementById('objects').addEventListener('change', function () {
		var object = document.getElementById('objects').value;
		entity.textureName = object;
		console.log(entity.textureName);
	}, false);
}

function showExitSettings(entity) {
	// show exit settings block
	document.getElementById('exitSettings').style.display = 'block';

	// remove old stages shown
	var stages = document.getElementById('stages');
	stages.innerHTML = "";
	
	// add stages from data
	for (var key in GAME.LEVELS) {
		if (GAME.LEVELS.hasOwnProperty(key)) {
			var stage = document.createElement('option');
			stage.value = key;
			stage.innerHTML = GAME.LEVELS[key].NAME;
			stages.appendChild(stage);
		}
	}
	
	// set values if they're present on the entity
	document.getElementById('destX').value = entity.destX;
	document.getElementById('destY').value = entity.destY;
	if (entity.destStage) {
		stages.value = entity.destStage;
	}
	
	// bind event handlers to mutate the entity's settings
	document.getElementById('destX').oninput = function () {
		var value = document.getElementById('destX').value;
		
		if (!parseInt(value, 10)) {
			alert("DEST X MUST BE A NUMBER");
			return;
		}
		
		entity.destX = parseInt(value, 10);
		
		console.log(entity.destX);
	};
	document.getElementById('destY').oninput = function () {
		var value = document.getElementById('destY').value;
		
		if (!parseInt(value, 10)) {
			alert("DEST Y MUST BE A NUMBER");
			return;
		}
		
		entity.destY = parseInt(value, 10);
		
		console.log(entity.destY);
	};
	document.getElementById('stages').addEventListener('change', function () {
		showDestExits();
		var stage = document.getElementById('stages').value;
		entity.destStage = stage;
		
		console.log(entity.destStage);
	}, false);
}

function hideExitSettings() {
	document.getElementById('exitSettings').style.display = 'none';
}

function showDestExits() {
	var stage = document.getElementById('stages').value;
	
	var exits = document.getElementById('destExits');
	exits.innerHTML = "";
	
	var level = GAME.LEVELS[stage];
	for (var i = 0; i < level.ENTITIES.length; ++i) {
		if (level.ENTITIES[i].TYPE == GAME.EXIT_WELL) {
			var exit = document.createElement('li');
			exit.innerHTML = "Next: " + level.ENTITIES[i].NEXT + ", X: " + level.ENTITIES[i].X + 
							 ", Y: " + level.ENTITIES[i].Y;
			exits.appendChild(exit);
		}
	}
}

function getEntityObject(entity) {
	// convert coords to level space
	var x = entity.x / levelScaleX;
	var y = entity.y / levelScaleY;

	if (entity.entityType == "spawn") {
		return getSpawnPointObject(x, y);
	} else if (entity.entityType == "exit") {
		var destX = 0, destY = 0, destStage = "";
		if (entity.destX) destX = entity.destX;
		if (entity.destY) destY = entity.destY;
		if (entity.destStage) destStage = entity.destStage;
		return getExitPointObject(destX, destY, destStage, x, y);
	} else if (entity.entityType == "object") {
		var textureName = "";
		if (entity.textureName) textureName = entity.textureName;
		return getGenericObject(textureName, x, y);
	// monsters have lots of different names
	} else {
		return getMonsterObject(entity.entityType, x, y);
	}
}	

function getMonsterObject(entityName, x, y) {
	return {
		X: Math.floor(x),
		Y: Math.floor(y),
		TYPE: GAME.MONSTER,
		ID: entityName
	};
}

function getSpawnPointObject(x, y) {
	return {
		X: Math.floor(x),
		Y: Math.floor(y),
		TYPE: GAME.SPAWN_POINT
	};
}

function getGenericObject(textureName, x, y) {
	return {
		X: Math.floor(x),
		Y: Math.floor(y),
		TYPE: GAME.OBJECT,
		TEXTURE: textureName
	};
}

function getExitPointObject(destX, destY, destStage, x, y) {
	return {
		X: Math.floor(x),
		Y: Math.floor(y),
		TYPE: GAME.EXIT_WELL,
		NEXT: destStage,
		DEST_X: Math.floor(destX),
		DEST_Y: Math.floor(destY),
		TEXTURE: "img/exit.png"
	};
}

function bindEventHandlers() {
	document.getElementById('clear').addEventListener('click', clear);					//X
	document.getElementById('loadBG').addEventListener('change', loadBG, false);		//X
	document.getElementById('loadFG').addEventListener('change', loadFG, false);		//X
	document.getElementById('tileWidth').oninput = setTileWidth;						//X
	document.getElementById('tileHeight').oninput = setTileHeight;						//X
	
	document.getElementById('title').oninput = setTitle;								//X
	
	document.getElementById('loadLevel').addEventListener('click', loadLevel);			//X
	document.getElementById('songs').addEventListener('click', setSong);				//X
	document.getElementById('collisions').addEventListener('click', setCollisions);		//X
	document.getElementById('addEntity').addEventListener('click', addEntity);			//X
	document.getElementById('save').addEventListener('click', save);					//X
}

function subscribe(obj) {
    obj.interactive = true;
    obj.on('mousedown', 		onDragStart)
       .on('touchstart', 		onDragStart)
       .on('mouseup', 			onDragEnd)
       .on('mouseupoutside', 	onDragEnd)
       .on('touchend', 			onDragEnd)
       .on('touchendoutside', 	onDragEnd)
       .on('mousemove', 		onDragMove)
       .on('touchmove', 		onDragMove);
}

function createEntitySprite(entity) {
	var entitySprite = PIXI.Sprite.fromImage("img/" + entity + ".png");
	entitySprite.displayGroup = entityDisplayGroup;
	entitySprite.entityType = entity; // necessary for use
	entitySprite.id = Date.now( ); // create unique ID
	entitySprites[entitySprite.id] = entitySprite; // store 
	return entitySprite;
}

function scaleToStage(levelSprite) {
	levelSprite.scale.x = DEFAULT_WIDTH / levelSprite.width;
	levelSprite.scale.y = DEFAULT_HEIGHT / levelSprite.height;
}

function drawTileGrid() {
	if (grid) {
		grid.clear();
		
		if (tiles.length && tiles[0].length) {
			for (var i = 0; i < tiles.length; ++i) {
				for (var j = 0; j < tiles[0].length; ++j) {
					if (tiles[i][j] != 0) {
						app.stage.removeChild(tiles[i][j]);
					}
				}
			}
		}
	}
	grid = new PIXI.Graphics();
	  
	var rows = background.height / levelScaleY / level.TH;
	var cols = background.width / levelScaleX / level.TW;
	
	grid.lineStyle(2, 0xFFFFFF, 0.25);
	
	console.log(background.width / levelScaleX + " " + background.height / levelScaleY);
	
	level.COLLISIONS = [];
	tiles = [];
	for (var i = 0; i < Math.ceil(rows); ++i) {
		tiles.push([]);
		level.COLLISIONS.push([]);
		for (var j = 0; j < Math.ceil(cols); ++j) {
			tiles[i].push(0);
			level.COLLISIONS[i].push(0);
		}
	}
	
	for (var i = 0; i < rows; ++i) {
		grid.moveTo(0, i * level.TH * levelScaleY);
		grid.lineTo(background.width, i * level.TH * levelScaleY);
	}
	for (var j = 0; j < cols; ++j) {
		grid.moveTo(j * level.TW * levelScaleX, 0);
		grid.lineTo(j * level.TW * levelScaleX, background.height);
	}
	
	grid.displayGroup = gridDisplayGroup;
	app.stage.addChild(grid);
}

function toggleTile(x, y, color) {
	if (!grid) return;
	
	// determine which tile
	var row = Math.floor(y / level.TH);
	var col = Math.floor(x / level.TW);
	
	// remove old one if it's there
	if (tiles[row][col] != 0) {
		app.stage.removeChild(tiles[row][col]);
		tiles[row][col].destroy();
		tiles[row][col] = 0;
		return;
	}
	
	// draw rectangle
	var tile = new PIXI.Graphics();
	tile.beginFill(color, 0.5);
	tile.lineStyle(1, 0xFFFFFF, 0.0);
	tile.drawRect(0, 0, (level.TW), (level.TH));
	
	// store in-memory tile structure
	tiles[row][col] = tile;
	
	// adjust into position and size
	tile.position.x = col * level.TW * levelScaleX;
	tile.position.y = row * level.TH * levelScaleY;
	tile.scale.x = levelScaleX;
	tile.scale.y = levelScaleY;
		
	// put into the level
	tile.displayGroup = gridDisplayGroup;
	app.stage.addChild(tile);
}

function editorOnPointerDown(eventData) {
	var pX = eventData.data.global.x;
	var pY = eventData.data.global.y;

	// translate to level coordinates
	pX /= levelScaleX;
	pY /= levelScaleY;
	
	if (editorState == SET_COLLISIONS) {
		toggleTile(pX, pY, 0xFF00FF);
		var row = Math.floor(pY / level.TH);
		var col = Math.floor(pX / level.TW);
		level.COLLISIONS[row][col] = level.COLLISIONS[row][col] ? 0 : 1;
	}
}

function displayEntitySettings(entity, type) {
	hideExitSettings();
	hideObjectSettings();
	if (type == "exit") showExitSettings(entity);
	if (type == "object") showObjectSettings(entity);
}

function onDragStart(event) {
    if (!this.dragging) {
        this.data = event.data;
        this.dragging = true;
		displayEntitySettings(this, this.entityType);
        this.scale.x *= 1.1;
        this.scale.y *= 1.1;
        this.dragPoint = event.data.getLocalPosition(this.parent);
        this.dragPoint.x -= this.x;
        this.dragPoint.y -= this.y;
    }
}

function onDragEnd() {
    if (this.dragging) {
        this.dragging = false;
        this.scale.x /= 1.1;
        this.scale.y /= 1.1;
        this.data = null;
    }
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x - this.dragPoint.x;
        this.y = newPosition.y - this.dragPoint.y;
		
		if ((this.x < -10) || (this.y < -10) || (this.x > DEFAULT_WIDTH + 10 || this.y > DEFAULT_HEIGHT + 10)) {
			entitySprites[this.id] = undefined;
			app.stage.removeChild(this);
		}
    }
}