import { PLAYER, PLAYER_SPEED, StartPosition, TURNS } from "../../../utils/utils";
import Map from "../../Map";
import Player from "./Player";

export default class Player2 extends Player {
    private _controls = null;
    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, shellTexture: string) {
        super(scene, position, atlasName, textureName, map, shellTexture);
        this._controls = this._scene.input.keyboard.addKeys({"up": Phaser.Input.Keyboard.KeyCodes.W, "down": Phaser.Input.Keyboard.KeyCodes.S, "left": Phaser.Input.Keyboard.KeyCodes.A, "right": Phaser.Input.Keyboard.KeyCodes.D});
        this._fire = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    protected get direction(): number {
        let direction = PLAYER_SPEED.NONE;

        if (this._controls.up.isDown) direction = (this._vehicleType === "player_tank") ? PLAYER.TANK.SPEED : PLAYER.BMP.SPEED;
        else if (this._controls.down.isDown) direction = (this._vehicleType === "player_tank") ? -PLAYER.TANK.SPEED : -PLAYER.BMP.SPEED;
        
        return direction;
    }

    protected get turn(): number {
        let turn = TURNS.NONE;

        if (this._controls.right.isDown) turn = TURNS.RIGHT;
        else if (this._controls.left.isDown) turn = TURNS.LEFT;
        
        return turn;
    }
}