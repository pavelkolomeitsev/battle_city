import Vehicle from "./Vehicle";
import Map from "./Map";
import { DIRECTIONS, StartPosition, TURNS } from "../utils/utils";

export default class Player extends Vehicle {
    private _cursor: Phaser.Types.Input.Keyboard.CursorKeys = null;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, shellTexture: string, enemy: boolean) {
        super(scene, position, atlasName, textureName, map, shellTexture, enemy);
        this._cursor = this._scene.input.keyboard.createCursorKeys(); // take control from keyboard, exactly up and down keys
        // this._scene.events.on("update", this.update, this);
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
        // if (!this.active) return;
        super.move();
        if (this._cursor.space.isDown && this) this.fire();
    }

    public setAlive(status: boolean): void {
        this.body. enable = status;
        this.setVisible(status);
        this.setActive(status);
        // this.emit("player_killed");
    }
}