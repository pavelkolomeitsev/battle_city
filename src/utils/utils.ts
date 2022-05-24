import EnemyVehicle from "../classes/enemies/EnemyVehicle";

export enum DIRECTIONS {
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
    FASTER = 200,
    FASTEST = 300
};

export const GROUND_FRICTION = 0.4;
export const ROADS_FRICTION = {
    road: 1
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