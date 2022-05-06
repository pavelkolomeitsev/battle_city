import Map from "../classes/Map";
import Player from "../classes/Player";
import { TANKS } from "../utils/utils";

export default class GameScene extends Phaser.Scene {
    private _map: Map = null;
    private _player1: Player = null;

    constructor() {super({key: "game-scene"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
    }

    protected create(): void {
        this._map = new Map(this);

        const vehicle: any = this.getVehicleConfig();
        this._player1 = new Player(this, this._map, vehicle.player1);
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this.cameras.main.startFollow(this._player1.sprite); // set camera to center on the player`s car

        // this.input.on("pointerdown", function () {
        //     if (this._player1) this._player1.fire();
        // }, this);
    }

    // see docs -> Scene.Methods
    update(time: number, delta: number): void {
        this._player1.move();
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