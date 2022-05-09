export enum DIRECTIONS {
    NONE = 0,
    FORWARD = 1,
    BACKWARD = -1
};

export enum TURNS {
    NONE = 0,
    RIGHT = 1,
    LEFT = -1
};

export enum SPEED {
    BASIC = 3,
    FASTER = 5,
    FASTEST = 7
};

export const GROUND_FRICTION = 0.5;
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