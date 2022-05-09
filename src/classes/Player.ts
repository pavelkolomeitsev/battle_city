import Vehicle from "./Vehicle";
import Map from "./Map";
import { DIRECTIONS, StartPosition, TURNS } from "../utils/utils";

export default class Player extends Vehicle {
    protected _scene: Phaser.Scene = null;
    protected _map: Map = null;
    private _cursor: Phaser.Types.Input.Keyboard.CursorKeys = null;

    constructor(scene: Phaser.Scene, position: StartPosition, texture: string, map: Map, shellTexture: string, enemy: boolean) {
        super(scene, position, texture, map, shellTexture, enemy);
        this._scene = scene;
        this._map = map;
        this._cursor = this._scene.input.keyboard.createCursorKeys(); // take control from keyboard, exactly up and down keys
    }

    protected get direction(): number {
        let direction = DIRECTIONS.NONE;

        if (this._cursor.up.isDown) direction = DIRECTIONS.FORWARD;
        else if (this._cursor.down.isDown) direction = DIRECTIONS.BACKWARD;

        return direction;
    }

    protected get turn(): number {
        let turn = TURNS.NONE;

        if (this._cursor.right.isDown) turn = TURNS.RIGHT;
        else if (this._cursor.left.isDown) turn = TURNS.LEFT;

        return turn;
    }

    public move(): void {
        super.move();
        if (this._cursor.space.isDown) this.fire();
    }
}