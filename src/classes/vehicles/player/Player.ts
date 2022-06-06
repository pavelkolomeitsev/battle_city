import Vehicle from "../Vehicle";
import Map from "../../Map";
import { PLAYER_SPEED, SPEED, StartPosition, TURNS } from "../../../utils/utils";
import GroupOfShells from "../../shells/GroupOfShells";
import Shell from "../../shells/Shell";
import BangAnimation from "../../animation/BangAnimation";
import SparkleAnimation from "../../animation/SparkleAnimation";

export default class Player extends Vehicle {
    private _velocity: number;
    private _cursor: Phaser.Types.Input.Keyboard.CursorKeys = null;
    private _armour: number = 0;
    public groupOfShells: GroupOfShells = null;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, shellTexture: string, enemy: boolean) {
        super(scene, position, atlasName, textureName, map);
        this._velocity = 0;
        this._cursor = this._scene.input.keyboard.createCursorKeys(); // take control from keyboard, exactly up and down keys
        this.groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, this._map, shellTexture, false);
        this.setVehicleType(textureName);
        // handle shooting on boxes
        this._scene.physics.add.overlap(this._map.explosiveObjects, this.groupOfShells, this.boxesShellsCollision, null, this);
        // handle shooting on stones
        this._scene.physics.add.overlap(this._map.stones, this.groupOfShells, this.stonesShellsCollision, null, this);
    }

    private setVehicleType(textureName: string): void {
        switch (textureName) {
            case "player_tank":
                this._armour = 100;
                break;
            case "bmp_red":
                this._armour = 77;
                break;
        }
    }

    private boxesShellsCollision(box: Phaser.GameObjects.Sprite, shell: Shell): void {
        const position: StartPosition = { x: box.x, y: box.y };
        BangAnimation.generateBang(this._scene, position);
        box.destroy();
        shell.setAlive(false);
    }

    private stonesShellsCollision(stone: Phaser.GameObjects.Sprite, shell: Shell): void {
        const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(shell.angle + 270, +20); // +270 - trick to set sparkle just before the stone
        const position: StartPosition = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
    }

    protected get direction(): number {
        let direction = PLAYER_SPEED.NONE;

        if (this._cursor.up.isDown) direction = PLAYER_SPEED.FORWARD;
        else if (this._cursor.down.isDown) direction = PLAYER_SPEED.BACKWARD;
        
        return direction;
    }

    // set the vehicle`s speed
    protected get velocity(): number {
        const vehicleSpeed = Math.abs(this._velocity); // make the speed absolute, without negative meaning
        const maxSpeed = this.getMaxSpeed();
        // if the player clicks on the key Up or Down and
        // current vehicle`s speed is less than max speed (10)
        // increase the vehicle`s speed by multipling acceleration with direction, which can be negative or positive

        if (this.direction && vehicleSpeed < maxSpeed) {
            this._velocity += this.direction;
        }
        else if ((this.direction && vehicleSpeed > maxSpeed) || (!this.direction && vehicleSpeed > 0)) { // if the player doesn`t click on the key Up or Down and
            this._velocity -= this._velocity; // current vehicle`s speed is more than max speed (10) ->
            // decrease the vehicle`s speed by multipling acceleration with previous direction, which can be negative or positive
        }
        return this._velocity;
    }

    protected get turn(): number {
        let turn = TURNS.NONE;

        if (this._cursor.right.isDown) turn = TURNS.RIGHT;
        else if (this._cursor.left.isDown) turn = TURNS.LEFT;
        
        return turn;
    }

    protected getMaxSpeed(): number {
        return SPEED.BASIC * this._map.getTileFriction(this);
    }

    // set the vehicle`s angle, when the vehicle is turning to the right or to the left
    public getAngle(): number {
        return this.angle + this.turn;
    }

    private getVelocityFromAngle(): Phaser.Math.Vector2{ // get sprite`s speed with account of sprite`s angle
        const vector2 = new Phaser.Math.Vector2();
        // vector2 дает нам правильное смещение картинки/спрайта по оси х/у
        // первый параметр - текущий угол картинки (по умолчанию 90 град. то есть вправо). Машинка смотрит вверх, поэтому нужно подправить угол
        // второй параметр - ускорение картинки (положительное/отрицатильное). То есть или вперед, или назад
        return vector2.setToPolar(this.rotation - Math.PI/2, this.velocity);
    }

    public fire(): void {
        if (this.groupOfShells) {
            this.groupOfShells.createFire(this);
        }
    }

    public move(): void {
        // the vehicle is moving with account of turn`s angle
        this.setAngle(this.getAngle());
        const velocity = this.getVelocityFromAngle();
        this.body?.setVelocity(velocity.x, velocity.y);

        if (this._cursor.space.isDown && this) this.fire();
    }

    public setAlive(status: boolean): void {
        this.body.enable = status;
        this.setVisible(status);
        this.setActive(status);
    }

    public destroyPlayer(shell: Shell): void {
        this._armour -= shell.damage;
        if ((this._armour < 100) && (this._armour >= 50)) {
            this.setTexture("objects", "player_tank1");
        } else if ((this._armour < 50) && (this._armour > 0)) {
            this.setTexture("objects", "player_tank2");
        } else if (this._armour <= 0) {
            this.destroy();
        }
    }
}