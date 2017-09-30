"use strict";

GAME.LEVELS = {};
GAME.MONSTERS = {};

GAME.LIGHT_CRYSTAL = 0;
GAME.DARK_CRYSTAL = 1;
GAME.BERRY = 2;
GAME.MEAT = 3;
GAME.HIDE = 4;
GAME.BUCKLER = 5;

GAME.EXIT_WELL = 0;
GAME.RECOVERY_WELL = 1;
GAME.INANIMATE = 2;
GAME.MONSTER = 3;
GAME.ITEM = 4;
GAME.SPAWN_POINT = 5;

GAME.PER_LEVEL = 
{
	ATTACK: 1,
	DEFENSE: 0.5,
	EXP_MULTIPLIER: 2,
	HEALTH: 10
}

GAME.PLAYER_BASE =
{
	NAME: "No Name",
	HEALTH: 50,
	LEVEL: 1,
	EXP: 0,
	EXP_REQUIRED: 10,
	SPEED: 3.0,
	ATTACK: 7,
	DEFENSE: 1,
	WIDTH: 25,
	HEIGHT: 37,
	ITEMS: []
};
	
GAME.MONSTERS['rabite'] = 
{
	NAME: "rabite",
	HEALTH: 20,
	EXP: 5,
	AGGRESSIVE: false,
	HEAVY: false,
	SPEED: 0.75,
	ATTACK: 0,
	DEFENSE: 1,
	WIDTH: 30,
	HEIGHT: 27,
	HIT_FRAMES: 2,
	MOVE_FRAMES: 7,
	LOOT: [
		{
			TYPE: GAME.BERRY,
			RATE: 0.05,
			QTY: 1
		},
		{
			TYPE: GAME.MEAT,
			RATE: 0.1,
			QTY: 1
		},
		{
			TYPE: GAME.LIGHT_CRYSTAL,
			RATE: 0.5,
			QTY: 1
		}
	]
};

GAME.LEVELS['demo_room_0'] = 
{
	ENTITIES: [
	{
		X: 750,
		Y: 300,
		TYPE: GAME.EXIT_WELL,
		NEXT: 'demo_room_1',
		COST: 0,
		COMBAT_LOCKED: true,
		DEST_X: 50,
		DEST_Y: 290,
		ACTIVE: true,
		TEXTURE: "img/exit.png"
	},
	{
		X: 200,
		Y: 200,
		TYPE: GAME.SPAWN_POINT,
	},
	{
		X: 350,
		Y: 300,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 400,
		Y: 300,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 325,
		Y: 10,
		TYPE: GAME.INANIMATE,
		TEXTURE: "img/bush.png"
	},
	{
		X: 650,
		Y: 180,
		TYPE: GAME.INANIMATE,
		TEXTURE: "img/bush.png"
	},
	{
		X: 650,
		Y: 340,
		TYPE: GAME.INANIMATE,
		TEXTURE: "img/bush.png"
	},
	{
		X: 325,
		Y: 500,
		TYPE: GAME.INANIMATE,
		TEXTURE: "img/bush.png"
	},
	],
	BACKGROUND: "img/forest.png",
	BG_WIDTH: 800,
	BG_HEIGHT: 600,
	SONG: "path"
}

GAME.LEVELS['demo_room_1'] = 
{
	ENTITIES: [
	{
		X: 5,
		Y: 300,
		TYPE: GAME.EXIT_WELL,
		NEXT: 'demo_room_0',
		COST: 0,
		COMBAT_LOCKED: true,
		DEST_X: 705,
		DEST_Y: 290,
		ACTIVE: true,
		TEXTURE: "img/exit.png"
	},
	{
		X: 350,
		Y: 200,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 500,
		Y: 250,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 600,
		Y: 300,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 600,
		Y: 250,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 375,
		Y: 325,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 225,
		Y: 275,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 375,
		Y: 325,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 275,
		Y: 325,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 300,
		Y: 350,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 550,
		Y: 300,
		TYPE: GAME.MONSTER,
		ID: "rabite"
	},
	{
		X: 325,
		Y: 10,
		TYPE: GAME.INANIMATE,
		TEXTURE: "img/bush.png"
	},
	{
		X: 5,
		Y: 180,
		TYPE: GAME.INANIMATE,
		TEXTURE: "img/bush.png"
	},
	{
		X: 5,
		Y: 340,
		TYPE: GAME.INANIMATE,
		TEXTURE: "img/bush.png"
	},
	{
		X: 325,
		Y: 500,
		TYPE: GAME.INANIMATE,
		TEXTURE: "img/bush.png"
	},
	],
	BACKGROUND: "img/forest.png",
	BG_WIDTH: 800,
	BG_HEIGHT: 600,
	SONG: "path"
}