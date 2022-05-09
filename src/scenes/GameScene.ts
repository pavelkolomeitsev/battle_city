import BangAnimation from "../classes/BangAnimation";
import Map from "../classes/Map";
import Player from "../classes/Player";
import Turret from "../classes/Turret";
import { BANG_ANIMATION, StartPosition, TANKS } from "../utils/utils";

export default class GameScene extends Phaser.Scene {
    private _map: Map = null;
    private _player1: Player = null;
    // testing turret
    private _turret: Turret = null;

    constructor() {super({key: "game-scene"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);

        // to garantee safe and correct loading of animation
        const frames: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "explosion",
            start: 1,
            end: 5
        });
        this.anims.create({
            key: BANG_ANIMATION,
            frames: frames,
            frameRate: 5,
            duration: 800, // miliseconds
            repeat: 0, // to play animation only once
        });
    }

    protected create(): void {
        this._map = new Map(this);

        const vehicle: any = this.getVehicleConfig();
        const player = this._map.getPlayer();
        const position: StartPosition = {x: player.x, y: player.y};
        this._player1 = new Player(this, position, vehicle.player1.sprite, this._map, "bulletRed1_outline", false);
        this.matter.world.on("collisionstart", (event, box, shell) => {
            if (box.gameObject.frame.name === "crateWood" && shell.gameObject.frame.name === "bulletRed1_outline") {
                const position: StartPosition = box.position;
                box.gameObject.destroy();
                shell.gameObject.destroy();
                BangAnimation.generateBang(this, position);
            }
        }, this);
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this.cameras.main.startFollow(this._player1.sprite); // set camera to center on the player`s car

        // testing turret
        this._turret = new Turret(this, this._map.getTurretPosition(), this._map, "bulletDark1_outline", true);
    }

    // see docs -> Scene.Methods
    update(time: number, delta: number): void {
        this._player1.move();
        this._turret.watch(this._player1);
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