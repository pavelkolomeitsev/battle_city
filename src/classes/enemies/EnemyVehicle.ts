import { StartPosition } from "../../utils/utils";
import BangAnimation from "../BangAnimation";
import Map from "../Map";
import Player from "../Player";
import GroupOfShells from "../shells/GroupOfShells";
import Shell from "../shells/Shell";
import Vehicle from "../Vehicle";

export default class EnemyVehicle extends Vehicle {
    private _vehicleSpeed: number = 0;
    private _timer: Phaser.Time.TimerEvent = null;
    private _player: Player = null;
    private _groupOfShells: GroupOfShells;
    public isAppear: boolean = true;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, player: Player) {
        super(scene, position, atlasName, textureName, map);
        this._vehicleSpeed = 70;
        this._player = player;
        this._groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, this._map, "bulletDark1_outline");
        this._timer = this._scene.time.addEvent({
            delay: 4000,
            loop: true,
            callback: this.changeDirection,
            callbackScope: this
        });
        this._scene.physics.add.overlap(this._groupOfShells, this._player, this.shellsPlayerCollision, null, this);
        this._scene.events.on("update", this.fire, this);
    }

    public get velocity(): number {
        return this.getMaxSpeed();
    }

    protected getMaxSpeed(): number {
        return this._vehicleSpeed * this._map.getTileFriction(this);
    }

    public changeDirection(): void {
        if (this.isAppear) this.isAppear = false;
        const [x, y, angle] = this.getVehiclesDirection();
        this.body?.setVelocity(x, y); // set direction
        this.angle = angle; // set correct sprite`s angle
    }

    private getVehiclesDirection(): [number, number, number] { // x, y, angle
        const direction: number = Math.floor(Math.random() * 4) + 1; // get random value between 1 and 4
        switch (direction) {
            case 1:
                return [0, -this.velocity, 180]; // go up
            case 2:
                return [this.velocity, 0, -90]; // go right
            case 3:
                return [0, this.velocity, 0]; // go down
            case 4:
                return [-this.velocity, 0, 90]; // go left
            default:
                return [0, this.velocity, 0];
        }
    }

    public moveOut(): void {
        this.body?.setVelocity(0, this.velocity);
    }

    public fire(): void {
        if (this._groupOfShells) {
            this._groupOfShells.createFire(this);
        }
    }

    private shellsPlayerCollision(shell: Shell, player: Player): void {
        const position: StartPosition = { x: shell.x, y: shell.y };
        BangAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
        player.setAlive(false);
    }
}