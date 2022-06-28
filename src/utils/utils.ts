import EnemyVehicle from "../classes/vehicles/enemies/EnemyVehicle";

export enum PLAYER_SPEED {
    NONE = 0,
    FORWARD = 100,
    BACKWARD = -100
};

export enum TURNS {
    NONE = 0,
    RIGHT = 1.3,
    LEFT = -1.3
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

export type StartPosition = {
    x: number,
    y: number
};

export type LevelData = {
    nextLevelNumber: string,
    nextLevelName: string,
    multiplayerGame: boolean,
    firstPlayer: {
        vehicle: string,
        shellType: string,
        experience: number,
        tanksPerLevel: number,
        bmpPerLevel: number,
        btrPerLevel: number,
        turretsPerLevel: number,
        radarPerLevel: number
    },
    secondPlayer: {
        vehicle: string,
        shellType: string,
        experience: number,
        tanksPerLevel: number,
        bmpPerLevel: number,
        btrPerLevel: number,
        turretsPerLevel: number,
        radarPerLevel: number
    }
};

export const BANG_ANIMATION: string = "BANG_ANIMATION";
export const RADAR_ANIMATION: string = "RADAR_ANIMATION";
export const SPARKLE_ANIMATION: string = "SPARKLE_ANIMATION";
export const SHOOTING_ANIMATION: string = "SHOOTING_ANIMATION";
export const XPOINTS_1_ANIMATION: string = "XPOINTS_1_ANIMATION";
export const XPOINTS_2_ANIMATION: string = "XPOINTS_2_ANIMATION";
export const XPOINTS_3_ANIMATION: string = "XPOINTS_3_ANIMATION";

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
        SPEED: 100,
        ARMOUR: 100,
        SHELL_POWER: 60,
        SHELL_TYPE: "bulletRed2"
    },
    BMP: {
        SPEED: 140,
        ARMOUR: 77,
        SHELL_POWER: 30,
        SHELL_TYPE: "bulletSand1"
    },
};

export function handleDirection(enemy: EnemyVehicle): void {
    switch (enemy.direction) {
        case DIRECTION.DOWN:
            enemy.body.y -= 5;
            break;
        case DIRECTION.LEFT:
            enemy.body.x += 5;
            break;
        case DIRECTION.UP:
            enemy.body.y += 5;
            break;
        case DIRECTION.RIGHT:
            enemy.body.x -= 5;
            break;
    }
}

export function goToOpositeDirection(enemy: EnemyVehicle): void {
    switch (enemy.direction) {
        case DIRECTION.DOWN:
            // go up
            enemy.body?.setVelocity(0, -enemy.velocity); // set direction
            enemy.angle = 180; // set correct sprite`s angle
            break;
        case DIRECTION.LEFT:
            // go right
            enemy.body?.setVelocity(enemy.velocity, 0); // set direction
            enemy.angle = -90; // set correct sprite`s angle
            break;
        case DIRECTION.UP:
            // go down
            enemy.body?.setVelocity(0, enemy.velocity); // set direction
            enemy.angle = 0; // set correct sprite`s angle
            break;
        case DIRECTION.RIGHT:
            enemy.body?.setVelocity(-enemy.velocity, 0); // set direction
            enemy.angle = 90; // set correct sprite`s angle
            break;
    }
}

export function createText(scene: Phaser.Scene, positionX: number, positionY: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): Phaser.GameObjects.Text {
    return scene.add.text(positionX, positionY, text, style).setOrigin(0);
}

export function createTextButton(scene: Phaser.Scene, height: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle, textButtonWidth?: number): Phaser.GameObjects.Text {
    const textButton: Phaser.GameObjects.Text = createText(scene, 0, 0, text, style);
    const width: number = textButtonWidth ? textButtonWidth : textButton.width;
    textButton.setX(window.innerWidth / 2 - width / 2);
    textButton.setY(window.innerHeight / 2 + height);
    textButton.setInteractive({ useHandCursor: true });
    return textButton;
}

export function createRectangleFrame(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Graphics {
    const rectFrame: Phaser.GameObjects.Graphics = scene.add.graphics();
    rectFrame.lineStyle(8, 0xE7590D, 1);
    rectFrame.strokeRoundedRect(x, y, 80, 100, 8);
    rectFrame.visible = false;
    return rectFrame;
}

export function createLevelText(scene: Phaser.Scene, positionX: number, positionY: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): Phaser.GameObjects.Text {
    const levelText: Phaser.GameObjects.Text = createText(scene, positionX, positionY, text, style);
    levelText.depth = 10;
    return levelText;
}

export function getPlayersRank(experience: number): string {
    if ((experience >= 10) && (experience < 20)) {
        return "lieutenant";
    } else if ((experience >= 20) && (experience < 30)) {
        return "captain";
    } else if ((experience >= 30) && (experience < 50)) {
        return "major";
    } else if ((experience >= 50) && (experience < 75)) {
        return "lieutenant_colonel";
    } else if ((experience >= 75) && (experience < 100)) {
        return "colonel";
    } else if ((experience >= 100) && (experience < 150)) {
        return "brigadier";
    } else if ((experience >= 150) && (experience < 200)) {
        return "major_general";
    } else if (experience > 200) {
        return "lieutenant_general";
    } else return "second_lieutenant";
}

export function showPlayerExperience(scene: Phaser.Scene, style: Phaser.Types.GameObjects.Text.TextStyle, isFirst: boolean, experience: number) {
    const width: number = scene.sys.game.canvas.width;
    const rank: string = getPlayersRank(experience);
    let sprite: Phaser.GameObjects.Sprite = null;
    if (isFirst) {
        createLevelText(scene, width - 80, 30, "1st", style);
        sprite = scene.add.sprite(width - 40, 130, "objects", rank);
    } else {
        createLevelText(scene, width - 90, 200, "2nd", style);
        sprite = scene.add.sprite(width - 40, 300, "objects", rank);
    }
    sprite.depth = 10;
}