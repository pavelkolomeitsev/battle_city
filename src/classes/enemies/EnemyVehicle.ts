import { StartPosition, DIRECTION } from "../../utils/utils";
import BangAnimation from "../BangAnimation";
import Map from "../Map";
import Player from "../Player";
import GroupOfShells from "../shells/GroupOfShells";
import Shell from "../shells/Shell";
import SparkleAnimation from "../SparkleAnimation";
import Vehicle from "../Vehicle";

export default class EnemyVehicle extends Vehicle {
    private _vehicleSpeed: number = 0;
    private _timer: Phaser.Time.TimerEvent = null;
    private _player: Player = null;
    private _groupOfShells: GroupOfShells;
    public isAppear: boolean = true;
    public direction: string = DIRECTION.DOWN;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, player: Player) {
        super(scene, position, atlasName, textureName, map);
        this._vehicleSpeed = 70;
        this._player = player;
        this.direction = "down";
        this._groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, this._map, "bulletDark1_outline");
        this._timer = this._scene.time.addEvent({
            delay: 4000,
            loop: true,
            callback: this.changeDirection,
            callbackScope: this
        });
        // enemy shoots player and boxes
        this._scene.physics.add.overlap([this._player, ...this._map.boxes], this._groupOfShells, this.shellsPlayerCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.shellsStoneCollision, null, this);
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
                this.direction = DIRECTION.UP;
                return [0, -this.velocity, 180]; // go up
            case 2:
                this.direction = DIRECTION.RIGHT;
                return [this.velocity, 0, -90]; // go right
            case 3:
                this.direction = DIRECTION.DOWN;
                return [0, this.velocity, 0]; // go down
            case 4:
                this.direction = DIRECTION.LEFT;
                return [-this.velocity, 0, 90]; // go left
            default:
                this.direction = DIRECTION.DOWN;
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
        if ((Phaser.Math.Distance.BetweenPoints(this, this._player) < 300) && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player.x, this._player.y);
            this.rotation = angle - Math.PI / 2; // Math.PI / 2 - trick to turn tank`s barrel oposite to the player
        }
    }

    private shellsPlayerCollision(target: Phaser.GameObjects.Sprite, shell: Shell): void {
        const position: StartPosition = { x: shell.x, y: shell.y };
        BangAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
        target.destroy();
    }

    private shellsStoneCollision(target: Phaser.GameObjects.Sprite, shell: Shell): void {
        const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(shell.angle + 270, -20); // +270 - trick to set sparkle just before the stone
        const position: StartPosition = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
    }
}