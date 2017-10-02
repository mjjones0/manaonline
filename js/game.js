"use strict";

var Container 			= PIXI.Container,
    autoDetectRenderer 	= PIXI.autoDetectRenderer,
    loader 				= PIXI.loader,
    resources 			= PIXI.loader.resources,
    Sprite 				= PIXI.Sprite;

var isMobile = false;
var game;

document.addEventListener("DOMContentLoaded", function(event) { 
  load();
});

function load() {
	PIXI.loader
	  .add([
		"img/player_walk.json",
		"img/forest.png",
		"img/cat.png",
		"img/bush.png",
		"img/arrow_up.png",
		"img/arrow_down.png",
		"img/arrow_left.png",
		"img/arrow_right.png",
		"img/exit.png",
		"img/blacksquare.jpg",
		"img/mana_tree.png",
		"img/duran.json",
		"img/rabite.json",
		"img/run_icon.png"
	  ])
	  .load(init);
}

function init() {
	if (  (typeof window.orientation !== "undefined") || ( navigator.userAgent.indexOf('IEMobile') !== -1 )  ) isMobile = true;
	if (isMobile == false) PIXI.settings.SCALE_MODE = 1;
	
	//isMobile = true;
	
	game = new GAME.Engine();
	
	game.view.renderer.view.style.margin = "0 auto";
	game.view.renderer.view.style.display = "block";
	document.body.appendChild(game.view.renderer.view);
	
	resize();
	window.onresize = resize;
	window.onorientationchange = function() { setTimeout(resize, 100); };
	window.onmousedown = function(e) {
		if (e.button == 2) {
			GAME.input.release();
		}
	};
	
	game.start();
    gameLoop();
}

function resize() 
{
	if (window.innerWidth / window.innerHeight >= GAME.RATIO) {
        var w = window.innerHeight * GAME.RATIO;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / GAME.RATIO;
    }

	GAME.width = w;
	GAME.height = h;
 
	game.view.renderer.view.style.width = w + 'px';
    game.view.renderer.view.style.height = h + 'px';
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
	
    game.update();
}