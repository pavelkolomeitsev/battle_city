import { SPEED, DIRECTIONS, TURNS } from "../utils/utils";
import GroupOfShells from "./GroupOfShells";
import Map from "./Map";

export default class Vehicle {
    protected _scene: Phaser.Scene = null;
    protected _map: Map = null;
    private _velocity: number;
    private _groupOfShells: GroupOfShells;
    public sprite: Phaser.Physics.Matter.Sprite = null;

    constructor(scene: Phaser.Scene, map: Map, config: any) {
        this._scene = scene;
        this._map = map;
        this._velocity = 0; // current car`s direction
        // this._checkpoint = 0;
        const player = this._map.getPlayer();
        this.sprite = this._scene.matter.add.sprite(player.x, player.y, "objects", config.sprite); // add sprite to the scene
        this.sprite.setFixedRotation(); // avoid the vehicle`s spinning on its axis
        this._groupOfShells = new GroupOfShells(this._scene, this, this._map);
    }

    protected get direction(): number {
        let direction = DIRECTIONS.NONE;

        // need implement separetly for AI, for human

        return direction;
    }

    // set the car`s speed
    protected get velocity(): number {
        const carSpeed = Math.abs(this._velocity); // make the speed absolute, without negative meaning

        const maxSpeed = this.getMaxSpeed();

        // if the player clicks on the key Up or Down and
        // current car`s speed is less than max speed (10)
        // increase the car`s speed by multipling acceleration with direction, which can be negative or positive
        if (this.direction && carSpeed < maxSpeed) {
            this._velocity += this.direction;
        } else if ((this.direction && carSpeed > maxSpeed) || (!this.direction && carSpeed > 0)) { // if the player doesn`t click on the key Up or Down and
            this._velocity -= this._velocity; // current car`s speed is more than max speed (10) ->
            // decrease the car`s speed by multipling acceleration with previous direction, which can be negative or positive
        }
        return this._velocity;
    }

    protected getMaxSpeed() {
        return SPEED.BASIC * this._map.getTileFriction(this.sprite);
    }

    protected get turn(): number {
        let turn = TURNS.NONE;

        // need implement separetly for AI, for human

        return turn;
    }

    // set the car`s angle, when the car is turning to the right or to the left
    protected get angle(): number {
        return this.sprite.angle + this.turn * SPEED.BASIC / 2;
    }

    private getVelocityFromAngle(): Phaser.Math.Vector2{ // get sprite`s speed with account of sprite`s angle
        const vector2 = new Phaser.Math.Vector2();
        // vector2 дает нам правильное смещение картинки/спрайта по оси х/у
        // первый параметр - текущий угол картинки (по умолчанию 90 град. то есть вправо). Машинка смотрит вверх, поэтому нужно подправить угол
        // второй параметр - ускорение картинки (положительное/отрицатильное). То есть или вперед, или назад
        return vector2.setToPolar(this.sprite.rotation - Math.PI/2, this.velocity);
    }

    public move(): void {
        this.checkOutOfBounds();

        // the car is moving with account of turn`s angle
        this.sprite.setAngle(this.angle);
        const velocity = this.getVelocityFromAngle();
        this.sprite.setVelocity(velocity.x, velocity.y);
        // this.checkPosition();
    }

    private checkOutOfBounds(): void {
        if (this.sprite.body.position.y > this._map.tilemap.heightInPixels) {
            this.sprite.body.position.y = this._map.tilemap.heightInPixels - 20;
        };
        if (this.sprite.body.position.y < 0) {
            this.sprite.body.position.y = 20;
        }
        if (this.sprite.body.position.x < 0) {
            this.sprite.body.position.x = 20;
        }
        if (this.sprite.body.position.x > this._map.tilemap.widthInPixels) {
            this.sprite.body.position.x = this._map.tilemap.widthInPixels - 20;
        }
    }

    protected fire(): void {
        if (this._groupOfShells) {
            this._groupOfShells.createFire();
        }
    }

    // private checkPosition(): void {
    //     // returns "1", "2", "3", "4" or false
    //     const checkpoint: number | boolean = this._map.getCheckpoint(this.car);
    //     if (checkpoint) {
    //         this.onCheckpoint(checkpoint as number);
    //     }
    // }

    // private onCheckpoint(checkpoint: number) {
    //     // when one lap is finished
    //     if (checkpoint === 1 && this._checkpoint === this._map.chekpoints.length) {
    //         this._checkpoint = 1;
    //         this.car.emit("lap"); // we trigger some event on the key "lap"
    //     } else if (checkpoint === this._checkpoint + 1) { // when the player is crossing one checkpoint
    //         ++this._checkpoint;
    //     }
    // }

    // public slide(): void {
    //     this.car.angle += SLIDE_ANGLE;
    // }
}