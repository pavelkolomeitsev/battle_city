import EnemyVehicle from "../classes/vehicles/enemies/EnemyVehicle";

export enum PLAYER_SPEED {
    NONE = 0,
    FORWARD = 100,
    BACKWARD = -100
};

export enum TURNS {
    NONE = 0,
    RIGHT = 1,
    LEFT = -1
};

export enum SPEED {
    BASIC = 150,
    FASTER = 690, // enemy shell`s speed
    FASTEST = 1000 // player shell`s speed
};

export const GROUND_FRICTION = 0.5;
export const FRICTIONS = {
    "lake": 0.1,
    "road": 1
};

export const TANKS = {
    RED: {
        sprite: "tank_red",
        position: "player"
    },
    BLUE: {
        sprite: "tank_green",
        position: "player"
    }
};

export type StartPosition = {
    x: number,
    y: number
};

export const BANG_ANIMATION: string = "BANG_ANIMATION";
export const RADAR_ANIMATION: string = "RADAR_ANIMATION";
export const SPARKLE_ANIMATION: string = "SPARKLE_ANIMATION";
export const SHOOTING_ANIMATION: string = "SHOOTING_ANIMATION";

export default class Checkpoint extends Phaser.Geom.Rectangle{
    public index: string;
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
    }
}

export enum DIRECTION {
    RIGHT = "RIGHT",
    DOWN = "DOWN",
    LEFT = "LEFT",
    UP = "UP"
};

export const ENEMY = {
    TANK: {
        TYPE: "TANK",
        SPEED: 60,
        ARMOUR: 150,
        SHELL_POWER: 45,
        SHELL_TYPE: "bulletDark3"
    },
    BMP: {
        TYPE: "BMP",
        SPEED: 120,
        ARMOUR: 70,
        SHELL_POWER: 26,
        SHELL_TYPE: "bulletDark2"
    },
    BTR: {
        TYPE: "BTR",
        SPEED: 190,
        ARMOUR: 56,
        SHELL_POWER: 13,
        SHELL_TYPE: "bulletDark1"
    },
    TURRET: {
        ARMOUR: 200,
        SHELL_POWER: 45,
        SHELL_TYPE: "bulletDark3"
    }
};

export const PLAYER = {
    TANK: {
        // SPEED: 60,
        ARMOUR: 100,
        SHELL_POWER: 60,
        SHELL_TYPE: "bulletRed2"
    },
    BMP: {
        // SPEED: 120,
        ARMOUR: 77,
        SHELL_POWER: 30,
        SHELL_TYPE: "bulletRed1"
    },
};

export function handleDirection(enemy: EnemyVehicle): void {
    switch (enemy.direction) {
        case DIRECTION.DOWN:
            enemy.body.y -= 10;
            break;
        case DIRECTION.LEFT:
            enemy.body.x += 10;
            break;
        case DIRECTION.UP:
            enemy.body.y += 10;
            break;
        case DIRECTION.RIGHT:
            enemy.body.x -= 10;
            break;
    }
}