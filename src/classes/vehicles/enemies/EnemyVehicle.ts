import { StartPosition, DIRECTION, ENEMY } from "../../../utils/utils";
import BangAnimation from "../../animation/BangAnimation";
import Map from "../../Map";
import Player from "../player/Player";
import GroupOfShells from "../../shells/GroupOfShells";
import Shell from "../../shells/Shell";
import SparkleAnimation from "../../animation/SparkleAnimation";
import Vehicle from "../Vehicle";

export default class EnemyVehicle extends Vehicle {
    private _vehicleSpeed: number = 0;
    private _type: string = "";
    private _armour: number = 0;
    private _timer: Phaser.Time.TimerEvent = null;
    private _player: Player = null;
    private _groupOfShells: GroupOfShells;
    public isAppear: boolean = true;
    public direction: string = DIRECTION.DOWN;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, player: Player) {
        super(scene, position, atlasName, textureName, map);

        const shellType: string = this.setEnemiesType(textureName);
        this._groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, this._map, shellType);
        this._timer = this._scene.time.addEvent({
            delay: 4500,
            loop: true,
            callback: this.changeDirection,
            callbackScope: this
        });

        this._player = player;
        this.direction = DIRECTION.DOWN;
        // enemy shoots player and boxes
        this._scene.physics.add.overlap(this._player, this._groupOfShells, this.shellsPlayerCollision, null, this);
        // enemy shoots boxes
        this._scene.physics.add.overlap(this._map.boxes, this._groupOfShells, this.shellsBoxesCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.shellsStoneCollision, null, this);
        this._scene.events.on("update", this.fire, this);
    }

    private setEnemiesType(textureName: string): string {
        let shellType: string = "";
        switch (textureName) {
            case "tank_blue": // enemy BTR
                this._type = ENEMY.BTR.TYPE;
                this._vehicleSpeed = ENEMY.BTR.SPEED;
                this._armour = ENEMY.BTR.ARMOUR;
                return shellType = ENEMY.BTR.SHELL_TYPE;
            case "tank_dark": // enemy BMP
                this._type = ENEMY.BMP.TYPE;
                this._vehicleSpeed = ENEMY.BMP.SPEED;
                this._armour = ENEMY.BMP.ARMOUR;
                return shellType = ENEMY.BMP.SHELL_TYPE;
            case "tank_sand": // enemy tank
                this._type = ENEMY.TANK.TYPE;
                this._vehicleSpeed = ENEMY.TANK.SPEED;
                this._armour = ENEMY.TANK.ARMOUR;
                return shellType = ENEMY.TANK.SHELL_TYPE;
        }
    }

    public destroyEnemy(shell: Shell): boolean {
        this._armour -= shell.damage;

        switch (this._type) {
            case ENEMY.TANK.TYPE:
                if ((this._armour <= 50) && (this._armour > 0)) {
                    // this.setTexture("objects", "tank_sand2");
                } else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this.destroy();
                    return true;
                }       
                break;
            case ENEMY.BMP.TYPE:
                if ((this._armour <= 35) && (this._armour > 0)) {
                    // this.setTexture("objects", "tank_sand2");
                } else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this.destroy();
                    return true;
                }       
                break;
            case ENEMY.BTR.TYPE:
                if ((this._armour <= 26) && (this._armour > 0)) {
                    // this.setTexture("objects", "tank_sand2");
                } else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this.destroy();
                    return true;
                }       
                break;
        }
        return false;
    }

    public get velocity(): number {
        return this.getMaxSpeed();
    }

    protected getMaxSpeed(): number {
        return this._vehicleSpeed * this._map.getTileFriction(this);
    }

    public changeDirection(): void {
        if (this.isAppear) this.isAppear = false; // first time to allow enemy tank to move out
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
        this.body?.setVelocity(0, this.velocity * 1.3);
    }

    public fire(): void {
        if (this._groupOfShells) {
            this._groupOfShells.createFire(this);
        }
        // if enemy comes close enough to player, it will shoot
        if ((Phaser.Math.Distance.BetweenPoints(this, this._player) < 300) && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player.x, this._player.y);
            this.rotation = angle - Math.PI / 2; // Math.PI / 2 - trick to turn tank`s barrel oposite to the player
        }
    }

    private shellsPlayerCollision(player: Player, shell: Shell): void {
        const position: StartPosition = { x: player.x, y: player.y };
        BangAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
        player.destroyPlayer(shell);
    }

    private shellsBoxesCollision(target: Phaser.GameObjects.Sprite, shell: Shell): void {
        const position: StartPosition = { x: target.x, y: target.y };
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