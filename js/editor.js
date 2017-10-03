document.addEventListener("DOMContentLoaded", function(event) {
	// load data
	
	var entities = [];
	entities.push({});
	entities.push({});
	entities.push({});
	for (var i = 0; i < data.MONSTERS.length; ++i) {
		entities.push(data.MONSTERS[i]);
	}
	
	// editor state
	
	var DEFAULT_WIDTH = 800;
	var DEFAULT_HEIGHT = 600;
	
	var DEFAULT = 0;
	var SET_COLLISIONS = 1;
	var PLACE_ENTITY = 2;
	var REMOVE_ENTITY = 3;
	var editorState = DEFAULT;
	
	var renderer;
	var editorStage;
	
	// sprites
	
	var foreGround, backGround;
	var entitySprites = [];
	
	// forms for each entity type - monster, exit, inanimate, startingPoint

	// event handlers
	
	function load() {
		PIXI.loader
			.add(["img/rabite.json"])
			.load(init);
	}
	
	function init() {
		renderer = PIXI.autoDetectRenderer(DEFAULT_WIDTH, DEFAULT_HEIGHT);
		editorStage = new PIXI.Container();
		renderer.view.style.margin = "0 auto";
		renderer.view.style.display = "block";
		document.getElementById("centerContent").appendChild(renderer.view);
	}
	
	function loadFG() {
		
	}
	
	function loadBG() {
		
	}
	
	function setTileWidth() {
		
	}
	
	function setTileHeight() {
		
	}
	
	function setTitle() {
		
	}
	
	function editorOnPointerDown() {
		if (editorState == SET_COLLISIONS) {
			// marks or unmarks tile as collidable
		} else if (editorState == PLACE_ENTITY) {
			// places entity
		} else if (editorState == REMOVE_ENTITY) {
			// removes entity located on this tile, if there is one
		}
	}
});