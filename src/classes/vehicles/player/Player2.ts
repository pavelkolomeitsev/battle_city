import { PLAYER, PLAYER_SPEED, StartPosition, TURNS } from "../../../utils/utils";
import Map from "../../Map";
import Shell from "../../shells/Shell";
import Player from "./Player";

export default class Player2 extends Player {
    private _controls = null;
    public id: string = "P2";
    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, shellTexture: string, experience: number) {
        super(scene, position, atlasName, textureName, map, shellTexture, experience);
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

    public destroyPlayer(shell: Shell): void {
        this._armour -= shell.damage;
        if (this._vehicleType === "player_tank") {
            if ((this._armour < 100) && (this._armour >= 50)) {
                this.setTexture("objects", "player_tank1");
            } else if ((this._armour < 50) && (this._armour > 0)) {
                this.setTexture("objects", "player_tank2");
            } else if (this._armour <= 0) {
                this._scene.events.emit("second_player_dead");
                this.destroy();
            }
        } else if (this._vehicleType === "player_ifv") {
            if ((this._armour < 77) && (this._armour >= 40)) {
                this.setTexture("objects", "player_ifv1");
            } else if ((this._armour < 40) && (this._armour > 0)) {
                this.setTexture("objects", "player_ifv2");
            } else if (this._armour <= 0) {
                this._scene.events.emit("second_player_dead");
                this.destroy();
            }
        }
    }
}