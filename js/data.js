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
GAME.OBJECT = 2;
GAME.MONSTER = 3;
GAME.ITEM = 4;
GAME.SPAWN_POINT = 5;

GAME.MONSTER_DEATH_BASE_WIDTH = 30;
GAME.MONSTER_DEATH_BASE_HEIGHT = 30;

GAME.PER_LEVEL = 
{
	ATTACK: 1,
	DEFENSE: 0.5,
	EXP_MULTIPLIER: 2,
	HEALTH: 10
}

GAME.SONGS = ['path', 'dungeon', 'boss', 'powell'];
GAME.OBJECTS = ['img/bush.png', 'img/dark_gem.png', 'img/green_gem.png', 'img/cat.png'];

GAME.PLAYER_BASE =
{
	NAME: "No Name",
	HEALTH: 50,
	LEVEL: 1,
	EXP: 0,
	EXP_REQUIRED: 10,
	SPEED: 3.0,
	WALK_SPEED: 1.5,
	RUN_SPEED: 3.5,
	ATTACK: 7,
	DEFENSE: 1,
	WIDTH: 25,
	HEIGHT: 37,
	TILE_WIDTH: 20,
	TILE_HEIGHT: 15,
	TILE_OFFSET_X: -10,
	TILE_OFFSET_Y: 0,
	ATTACK_COOLDOWN: 1,
	SLASH_HITBOX_SIZE: 30,
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
	WIDTH: 22,
	HEIGHT: 22,
	STUN_DURATION: 1,
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
	],
	FRAMES: {
		attack_down : ['rabite_attack_0', 'rabite_attack_1', 'rabite_attack_2'],
		attack_left : ['rabite_attack_6', 'rabite_attack_7', 'rabite_attack_8'],
		attack_up : ['rabite_attack_3', 'rabite_attack_4', 'rabite_attack_5'],
		hit : ['rabite_hit_0'],
		move_down : ['rabite_move_0', 'rabite_move_1', 'rabite_move_2'],
		move_left : ['rabite_move_3', 'rabite_move_4', 'rabite_move_5'],
		move_up : ['rabite_move_6', 'rabite_move_7', 'rabite_move_8'],
		still_down : ['rabite_attack_2'],
		still_left : ['rabite_attack_8'],
		still_up : ['rabite_attack_5'],
		death : ['monster_death_0', 'monster_death_1', 'monster_death_2', 
			   'monster_death_3', 'monster_death_4', 'monster_death_5', 'monster_death_6'],
	},
	FRAME_DEFAULT: 'move_down'
};

GAME.MONSTERS['chobin'] = 
{
	NAME: "chobin",
	HEALTH: 36,
	EXP: 10,
	AGGRESSIVE: true,
	HEAVY: false,
	SPEED: 1.0,
	ATTACK: 8,
	DEFENSE: 1,
	WIDTH: 22,
	HEIGHT: 22,
	STUN_DURATION: 0.5,
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
			RATE: 1,
			QTY: 1
		}
	],
	FRAMES: {
		attack_down : ['rabite_attack_0', 'rabite_attack_1', 'rabite_attack_2'],
		attack_left : ['rabite_attack_6', 'rabite_attack_7', 'rabite_attack_8'],
		attack_up : ['rabite_attack_3', 'rabite_attack_4', 'rabite_attack_5'],
		hit : ['rabite_hit_0'],
		move_down : ['rabite_move_0', 'rabite_move_1', 'rabite_move_2'],
		move_left : ['rabite_move_3', 'rabite_move_4', 'rabite_move_5'],
		move_up : ['rabite_move_6', 'rabite_move_7', 'rabite_move_8'],
		still_down : ['rabite_attack_2'],
		still_left : ['rabite_attack_8'],
		still_up : ['rabite_attack_5'],
		death : ['monster_death_0', 'monster_death_1', 'monster_death_2', 
			   'monster_death_3', 'monster_death_4', 'monster_death_5', 'monster_death_6'],
	},
	FRAME_DEFAULT: 'move_down'
};

GAME.LEVELS['demo_room_0'] = 
{
	ENTITIES: [
	{
		X: 750,
		Y: 300,
		TYPE: GAME.EXIT_WELL,
		NEXT: 'demo_room_1',
		DEST_X: 50,
		DEST_Y: 300,
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
		TYPE: GAME.OBJECT,
		TEXTURE: "img/bush.png"
	},
	{
		X: 650,
		Y: 170,
		TYPE: GAME.OBJECT,
		TEXTURE: "img/bush.png"
	},
	{
		X: 650,
		Y: 340,
		TYPE: GAME.OBJECT,
		TEXTURE: "img/bush.png"
	},
	{
		X: 325,
		Y: 500,
		TYPE: GAME.OBJECT,
		TEXTURE: "img/bush.png"
	},
	],
	BACKGROUND: "img/forest.png",
	BG_WIDTH: 800,
	BG_HEIGHT: 600,
	SONG: "path",
	NAME: "Demo Room 0"
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
		DEST_X: 725,
		DEST_Y: 300,
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
		TYPE: GAME.OBJECT,
		TEXTURE: "img/bush.png"
	},
	{
		X: 5,
		Y: 170,
		TYPE: GAME.OBJECT,
		TEXTURE: "img/bush.png"
	},
	{
		X: 5,
		Y: 340,
		TYPE: GAME.OBJECT,
		TEXTURE: "img/bush.png"
	},
	{
		X: 325,
		Y: 500,
		TYPE: GAME.OBJECT,
		TEXTURE: "img/bush.png"
	},
	],
	BACKGROUND: "img/forest.png",
	BG_WIDTH: 800,
	BG_HEIGHT: 600,
	SONG: "path",
	NAME: "Demo Room 1"
}

GAME.LEVELS['forest_coast'] = 
{
    "NAME": "Forest Coast",
    "SONG": "powell",
    "FOREGROUND": "img/foreground_forest_0.png",
    "BACKGROUND": "img/background_forest_0.png",
    "TW": 20,
    "TH": 20,
    "ROWS": 15,
    "COLS": 23,
	"BG_WIDTH" : 442,
	"BG_HEIGHT" : 300,
    "COLLISIONS": [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "ENTITIES": [
	{
        "X": 2,
        "Y": 92,
        "TYPE": GAME.EXIT_WELL,
        "NEXT": "forest_riverways",
        "DEST_X": 330,
        "DEST_Y": 270,
        "TEXTURE": "img/exit.png"
    }, 
	{
        "X": 219,
        "Y": 142,
        "TYPE": GAME.SPAWN_POINT
    }
	]
}

GAME.LEVELS['forest_riverways'] = 
{
    "NAME": "Forest Riverways",
    "SONG": "powell",
    "FOREGROUND": "img/foreground_forest_1.png",
    "BACKGROUND": "img/background_forest_1.png",
    "TW": 20,
    "TH": 20,
    "ROWS": 20,
    "COLS": 20,
	"BG_WIDTH" : 400,
	"BG_HEIGHT" : 398,
    "COLLISIONS": [
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "ENTITIES": [{
        "X": 368,
        "Y": 269,
        "TYPE": 0,
        "NEXT": "forest_coast",
        "DEST_X": 32,
        "DEST_Y": 90,
        "TEXTURE": "img/exit.png"
    },
	{
        "X": 188,
        "Y": 8,
        "TYPE": 0,
        "NEXT": "forest_statue",
        "DEST_X": 208,
        "DEST_Y": 244,
        "TEXTURE": "img/exit.png"
    },	
	//{
    //    "X": 187,
    //    "Y": 10.613333333333333,
    //    "TYPE": 0,
    //    "NEXT": "",
    //    "DEST_X": 0,
    //    "DEST_Y": 0,
    //    "TEXTURE": "img/exit.png"
    //}, 
	{
        "X": 98,
        "Y": 130,
        "TYPE": GAME.MONSTER,
        "ID": "rabite"
    }, {
        "X": 153,
        "Y": 85,
        "TYPE": GAME.MONSTER,
        "ID": "rabite"
    }]
}

GAME.LEVELS['forest_statue'] =
{
    "NAME": "Forest Statue",
    "SONG": "powell",
    "FOREGROUND": "img/foreground_forest_statue.png",
    "BACKGROUND": "img/background_forest_statue.png",
    "TW": 12,
    "TH": 12,
    "ROWS": 25,
    "COLS": 51,
    "COLLISIONS": [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "ENTITIES": [{
        "X": 208,
        "Y": 274,
        "TYPE": 0,
        "NEXT": "forest_riverways",
        "DEST_X": 188,
        "DEST_Y": 38,
        "TEXTURE": "img/exit.png"
    }, {
        "X": 248,
        "Y": 159,
        "TYPE": 3,
        "ID": "rabite"
    }],
    "BG_WIDTH": 605,
    "BG_HEIGHT": 300
}