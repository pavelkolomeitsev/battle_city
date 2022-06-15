import { StartPosition, DIRECTION, ENEMY } from "../../../utils/utils";
import BangAnimation from "../../animation/BangAnimation";
import Map from "../../Map";
import Player from "../player/Player";
import GroupOfShells from "../../shells/GroupOfShells";
import Shell from "../../shells/Shell";
import SparkleAnimation from "../../animation/SparkleAnimation";
import Vehicle from "../Vehicle";
import Player2 from "../player/Player2";
import XpointsAnimation from "../../animation/XpointsAnimation";

export default class EnemyVehicle extends Vehicle {
    private _vehicleSpeed: number = 0;
    private _type: string = "";
    private _armour: number = 0;
    private _timer: Phaser.Time.TimerEvent = null;
    private _player1: Player = null;
    private _player2: Player2 = null;
    private _groupOfShells: GroupOfShells;
    private _bases: StartPosition[] = [];
    public direction: string = DIRECTION.DOWN;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, player1: Player, player2: Player2 = null) {
        super(scene, position, atlasName, textureName, map);

        const shellType: string = this.setEnemiesType(textureName);
        this._groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, this._map, shellType);
        this._timer = this._scene.time.addEvent({
            delay: 4000,
            loop: true,
            callback: this.changeDirection,
            callbackScope: this
        });
        this.initBases(map);
        this._player1 = player1;
        this._player2 = player2;
        this.direction = DIRECTION.DOWN;
        // enemy shoots players
        this._scene.physics.add.overlap(this._player2 ? [this._player2, this._player1] : this._player1, this._groupOfShells, this.shellsPlayerCollision, null, this);
        // enemy shoots boxes
        this._scene.physics.add.overlap(this._map.explosiveObjects, this._groupOfShells, this.shellsBoxesCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.shellsStoneCollision, null, this);
        this._scene.events.on("update", this.fire, this);
    }

    private setEnemiesType(textureName: string): string {
        switch (textureName) {
            case "enemy_btr": // enemy BTR
                this._type = ENEMY.BTR.TYPE;
                this._vehicleSpeed = ENEMY.BTR.SPEED;
                this._armour = ENEMY.BTR.ARMOUR;
                return ENEMY.BTR.SHELL_TYPE;
            case "enemy": // enemy BMP
                this._type = ENEMY.BMP.TYPE;
                this._vehicleSpeed = ENEMY.BMP.SPEED;
                this._armour = ENEMY.BMP.ARMOUR;
                return ENEMY.BMP.SHELL_TYPE;
            case "enemy_tank": // enemy tank
                this._type = ENEMY.TANK.TYPE;
                this._vehicleSpeed = ENEMY.TANK.SPEED;
                this._armour = ENEMY.TANK.ARMOUR;
                return ENEMY.TANK.SHELL_TYPE;
        }
    }

    private initBases(map: Map): void {
        for (let i = 1; i < 4; i++) { // there are always 3 enemy`s bases
            this._bases.push(map.getBasePosition(i));
        }
    }

    public destroyEnemy(shell: Shell): boolean {
        this._armour -= shell.damage;
        const id: string = (shell.parentSprite as Player).id;
        switch (this._type) {
            case ENEMY.TANK.TYPE:
                if ((this._armour < 150) && (this._armour >= 80)) {
                    this.setTexture("objects", "enemy_tank1");
                } else if ((this._armour < 80) && (this._armour > 0)) {
                    this.setTexture("objects", "enemy_tank2");
                } else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this._timer.remove();
                    this.destroy();
                    const position: StartPosition = { x: shell.x, y: shell.y };
                    XpointsAnimation.generateAnimation(this._scene, position, 3);
                    this.calculateExperiencePoints(id, 1.1, ENEMY.TANK.TYPE);
                    return true;
                }
                break;
            case ENEMY.BMP.TYPE:
                if ((this._armour <= 35) && (this._armour > 0)) {
                    this.setTexture("objects", "enemy_bmp1");
                } else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this._timer.remove();
                    this.destroy();
                    const position: StartPosition = { x: shell.x, y: shell.y };
                    XpointsAnimation.generateAnimation(this._scene, position, 2);
                    this.calculateExperiencePoints(id, 0.7, ENEMY.BMP.TYPE);
                    return true;
                }       
                break;
            case ENEMY.BTR.TYPE:
                if ((this._armour <= 26) && (this._armour > 0)) {
                    this.setTexture("objects", "enemy_btr1");
                } else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this._timer.remove();
                    this.destroy();
                    const position: StartPosition = { x: shell.x, y: shell.y };
                    XpointsAnimation.generateAnimation(this._scene, position, 1);
                    this.calculateExperiencePoints(id, 0.4, ENEMY.BTR.TYPE);
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
        this.body?.setVelocity(0, this.velocity * 1.5); // * 1.3 - trick to run out quicker
    }

    public fire(): void {
        if (this._groupOfShells) {
            this._groupOfShells.createFire(this); // start shooting
        }
        this._bases.forEach((base: StartPosition) => { // send enemy down if it comes close to the base
            if ((Phaser.Math.Distance.BetweenPoints(this, base) < 80) && this.body) {
                this.body?.setVelocity(0, this.velocity * 1.5);
                this.angle = 0;
            }
        });
        if (!this._player1) return;
        // if enemy comes close enough to player, it will shoot
        if ((this._type !== ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._player1) < 350) && this._player1.body && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player1.x, this._player1.y);
            this.rotation = angle - Math.PI / 2; // Math.PI / 2 - trick to turn tank`s barrel oposite to the player
        } else if ((this._type === ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._player1) < 550) && this._player1.body && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player1.x, this._player1.y);
            this.rotation = angle - Math.PI / 2; // Math.PI / 2 - trick to turn tank`s barrel oposite to the player
        }

        if (!this._player2) return;
        if ((this._type !== ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._player2) < 350) && this._player2.body && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player2.x, this._player2.y);
            this.rotation = angle - Math.PI / 2; // Math.PI / 2 - trick to turn tank`s barrel oposite to the player
        } else if ((this._type === ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._player2) < 550) && this._player2.body && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player2.x, this._player2.y);
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

    private calculateExperiencePoints(id: string, points: number, enemyType: string): void {
        if (this._player1 && id === "P1") {
            this._player1.experience += points;
            this.calculateDestroyedEnemies(this._player1, enemyType);
        } else if (this._player2 && id === "P2") {
            this._player2.experience += points;
            this.calculateDestroyedEnemies(this._player2, enemyType);
        }
    }

    private calculateDestroyedEnemies(player: Player, enemyType: string): void {
        switch (enemyType) {
            case ENEMY.TANK.TYPE:
                player.tanksPerLevel++;
                break;
            case ENEMY.BMP.TYPE:
                player.bmpPerLevel++;
                break;
            case ENEMY.BTR.TYPE:
                player.btrPerLevel++;
                break;
        }
    }
}