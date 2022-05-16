import { SPEED, DIRECTIONS, TURNS, StartPosition } from "../utils/utils";
import GroupOfShells from "./GroupOfShells";
import Map from "./Map";

export default class Vehicle extends Phaser.GameObjects.Sprite {
    protected _scene: Phaser.Scene = null;
    protected _map: Map = null;
    private _velocity: number;
    public groupOfShells: GroupOfShells;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, shellTexture: string, enemy: boolean) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = scene;
        this._map = map;
        this._velocity = 0;
        this.groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, this, this._map, shellTexture, enemy);
        this.init();
    }
    
    protected init() {
        this._scene.add.existing(this); // add sprite to the scene
        this._scene.physics.add.existing(this); // add sprite as physic object to Phaser engine
        this.body.enable = true; // the physic body of "dragon" will be available for physic impacts
    }

    protected get direction(): number {
        let direction = DIRECTIONS.NONE;

        // need implement separetly for AI, for human

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

    protected getMaxSpeed() {
        return SPEED.BASIC * this._map.getTileFriction(this);
    }

    protected get turn(): number {
        let turn = TURNS.NONE;

        // need implement separetly for AI, for human

        return turn;
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

    public move(): void {
        this.checkOutOfBounds();
        // the vehicle is moving with account of turn`s angle
        this.setAngle(this.getAngle());
        const velocity = this.getVelocityFromAngle();
        this.body?.setVelocity(velocity.x, velocity.y);
        // this.checkPosition();
    }

    private checkOutOfBounds(): void {
        if (!this.body) return;

        if (this.body.y > this._map.tilemap.heightInPixels) {
            this.body.y = this._map.tilemap.heightInPixels - 20;
        };
        if (this.body.y < 0) {
            this.body.y = 20;
        }
        if (this.body.x < 0) {
            this.body.x = 20;
        }
        if (this.body.x > this._map.tilemap.widthInPixels) {
            this.body.x = this._map.tilemap.widthInPixels - 20;
        }
    }

    protected fire(): void {
        if (this.groupOfShells) {
            this.groupOfShells.createFire();
        }
    }

    // public destroy(): void {
    //     this.sprite.destroy();
    //     this.sprite = null;
    // }
}