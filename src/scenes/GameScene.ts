import BangAnimation from "../classes/BangAnimation";
import Map from "../classes/Map";
import Player from "../classes/Player";
import Radar from "../classes/Radar";
import Shell from "../classes/Shell";
import Turret from "../classes/Turret";
import { BANG_ANIMATION, RADAR_ANIMATION, StartPosition, TANKS } from "../utils/utils";

export default class GameScene extends Phaser.Scene {
    private _map: Map = null;
    private _player1: Player = null;
    // testing turret
    private _turret: Turret = null;
    private _radar: Radar = null;

    constructor() {super({key: "game-scene"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);

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
            repeat: -1, // to play animation only once
        });
    }

    protected create(): void {
        this._map = new Map(this);

        const vehicle: any = this.getVehicleConfig();
        const player = this._map.getPlayer();
        const position: StartPosition = {x: player.x, y: player.y};
        this._player1 = new Player(this, position, "objects", "tank_red", this._map, "bulletRed1_outline", false);

        // testing turret
        this._turret = new Turret(this, this._map.getTurretPosition(), this._map, "bulletDark1_outline", true);
        this._radar = new Radar(this, this._map.getRadarPosition(), "objects", "platform1");

        this.handleCollisions();
        
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this.cameras.main.startFollow(this._player1); // set camera to center on the player`s car
    }

    private handleCollisions(): void {
        this.physics.add.overlap([this._turret.platform, this._radar], this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);
        this.physics.add.overlap(this._map.boxes, [this._player1.groupOfShells, this._turret.groupOfShells], this.boxesShellsCollision, null, this);
        this.physics.add.overlap(this._turret.groupOfShells, this._player1, this.shellsPlayerCollision, null, this);
    }

    private boxesShellsCollision(box: Phaser.GameObjects.Sprite, shell: Shell): void {
        const position: StartPosition = { x: box.x, y: box.y };
        BangAnimation.generateBang(this, position);
        box.destroy();
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
        }
        
        shell.setAlive(false);
    }

    // see docs -> Scene.Methods
    update(time: number, delta: number): void {
        if (this._player1.active) this._player1.move();
        if (this._turret.turret && this._player1.active) {
            const isPlayerNear: boolean = this._map.checkPlayersPosition(this._radar, this._player1);
            this._turret.runTurret(this._player1, isPlayerNear);
        }
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
}