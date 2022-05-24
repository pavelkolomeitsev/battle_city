import BangAnimation from "../classes/BangAnimation";
import Map from "../classes/Map";
import Player from "../classes/Player";
import Radar from "../classes/enemies/Radar";
import Shell from "../classes/shells/Shell";
import Turret from "../classes/enemies/Turret";
import { BANG_ANIMATION, handleDirection, RADAR_ANIMATION, SPARKLE_ANIMATION, StartPosition, TANKS } from "../utils/utils";
import GroupOfEnemies from "../classes/enemies/GroupOfEnemies";
import EnemyVehicle from "../classes/enemies/EnemyVehicle";
import SparkleAnimation from "../classes/SparkleAnimation";

export default class GameScene extends Phaser.Scene {
    private _map: Map = null;
    private _player1: Player = null;
    // testing turret
    private _turret: Turret = null;
    private _radar: Radar = null;
    private _enemies: GroupOfEnemies = null;
    
    constructor() {super({key: "game-scene"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this.loadAnimation();
    }

    protected create(): void {
        this._map = new Map(this);

        // const vehicle: any = this.getVehicleConfig();
        // add player
        const player = this._map.getPlayer();
        const position: StartPosition = {x: player.x, y: player.y};
        this._player1 = new Player(this, position, "objects", "tank_red", this._map, "bulletRed1_outline", false);

        // add all enemies
        this._turret = new Turret(this, this._map.getTurretPosition(), this._map, "bulletDark1_outline");
        this._radar = new Radar(this, this._map.getRadarPosition(), "objects", "platform1");
        this._enemies = new GroupOfEnemies(this.physics.world, this, this._map, 20, this._player1);
        this.handleCollisions();
        
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this.cameras.main.startFollow(this._player1); // set camera to center on the player`s tank
    }

    private handleCollisions(): void {
        // player shoots all enemies
        this.physics.add.overlap([this._turret.platform, this._radar], this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);
        this.physics.add.overlap(this._enemies, this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);

        // player shoots boxes
        this.physics.add.overlap(this._map.boxes, [this._player1.groupOfShells, this._turret.groupOfShells], this.boxesShellsCollision, null, this);
        this.physics.add.overlap(this._map.stones, [this._player1.groupOfShells, this._turret.groupOfShells], this.stonesShellsCollision, null, this);

        // turret shoots player
        this.physics.add.overlap(this._turret.groupOfShells, this._player1, this.shellsPlayerCollision, null, this);

        // handle enemies vs simple collision (not move objects)
        this.physics.add.collider([this._turret.platform, this._radar, this._player1, ...this._map.boxes, ...this._map.stones], this._enemies, this.handleEnemiesCollision, null, this);
        this.physics.add.collider([this._turret.platform, this._radar, ...this._enemies.children.getArray(), ...this._map.boxes, ...this._map.stones], this._player1, this.handlePlayerCollision, null, this);
    }

    private boxesShellsCollision(box: Phaser.GameObjects.Sprite, shell: Shell): void {
        const position: StartPosition = { x: box.x, y: box.y };
        BangAnimation.generateBang(this, position);
        box.destroy();
        shell.setAlive(false);
    }

    private stonesShellsCollision(stone: Phaser.GameObjects.Sprite, shell: Shell): void {
        const vector: Phaser.Math.Vector2 = this.physics.velocityFromAngle(shell.angle + 270, +20); // +270 - trick to set sparkle just before the stone
        const position: StartPosition = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation.generateBang(this, position);
        shell.setAlive(false);
    }

    private shellsPlayerCollision(shell: Shell, player: Player): void {
        const position: StartPosition = { x: shell.x, y: shell.y };
        BangAnimation.generateBang(this, position);
        shell.setAlive(false);
        player.setAlive(false);
        // this._player1 = null; ?
    }

    private shellsEnemiesCollision(enemy: Phaser.GameObjects.Sprite, shell: Shell): void {
        const position: StartPosition = { x: enemy.x, y: enemy.y };
        BangAnimation.generateBang(this, position);

        if (enemy instanceof Radar) {
            this._radar.destroy();
        } else if (enemy.frame.name === "platform") {
            this._turret.destroyTurret();
        } else if (enemy instanceof EnemyVehicle) {
            enemy.scene.events.off("update", enemy.fire, enemy);
            enemy.destroy();
            --this._enemies.counter;
        }
        
        shell.setAlive(false);
    }

    private handleEnemiesCollision(gameObject: Phaser.GameObjects.Sprite, enemy: EnemyVehicle): void {
        handleDirection(enemy);
        enemy.changeDirection();
    }

    private handlePlayerCollision(gameObject: Phaser.GameObjects.Sprite, player: Player): void {
        // gameObject.body.setImmovable(true);
        player.body.stop();
    }

    // see docs -> Scene.Methods
    update(time: number, delta: number): void {
        if (this._player1.active) this._player1.move();
        if (this._turret.turret && this._player1.active) {
            const isPlayerNear: boolean = this._map.checkPlayersPosition(this._radar, this._player1);
            this._turret.runTurret(this._player1, isPlayerNear);
        }
        this.checkMapBounds([this._player1, ...this._enemies.getChildren()]);
    }

    private getVehicleConfig(): any {
        // config for the first player
        let config: any = { player1: TANKS.RED, player2: TANKS.BLUE };
        // if (this._client && !this._client._isFirst) {
        //     // config for the second player
        //     config = { player1: CARS.BLUE, player2: CARS.RED };
        // }
        return config;
    }

    private checkMapBounds(vehicles: Phaser.GameObjects.GameObject[]): void {
        if (vehicles && vehicles.length > 0) {
            for (let i = 0; i < vehicles.length; i++) {
                if (!vehicles[i].body) continue;
        
                if (vehicles[i].body.y > this._map.tilemap.heightInPixels - 30) {
                    vehicles[i].body.y = this._map.tilemap.heightInPixels - 30 - 20;
                }
                if (vehicles[i].body.y < 0) {
                    vehicles[i].body.y = 20;
                }
                if (vehicles[i].body.x < 0) {
                    vehicles[i].body.x = 20;
                }
                if (vehicles[i].body.x > this._map.tilemap.widthInPixels - 30) {
                    vehicles[i].body.x = this._map.tilemap.widthInPixels - 30 - 20;
                }
            }
        }
    }

    private loadAnimation(): void {
        // to garantee safe and correct loading of animation
        const bangFrames: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "explosion",
            start: 1,
            end: 5
        });
        this.anims.create({
            key: BANG_ANIMATION,
            frames: bangFrames,
            frameRate: 5,
            duration: 800, // miliseconds
            repeat: 0, // to play animation only once
        });

        // to garantee safe and correct loading of animation
        const frames: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "platform",
            start: 1,
            end: 8
        });
        this.anims.create({
            key: RADAR_ANIMATION,
            frames: frames,
            frameRate: 7,
            duration: 1000, // miliseconds
            repeat: -1, // to play animation infinitely
        });

        // to garantee safe and correct loading of animation
        const sparkleFrame: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "sparkle",
            start: 1,
            end: 1
        });
        this.anims.create({
            key: SPARKLE_ANIMATION,
            frames: sparkleFrame,
            frameRate: 7,
            duration: 500, // miliseconds
            repeat: 0, // to play animation only once
        });
    }
}