import { StartPosition } from "../utils/utils";
import GroupOfShells from "./GroupOfShells";
import Map from "./Map";
import Player from "./Player";

export default class Turret extends Phaser.GameObjects.GameObject {
    private _scene: Phaser.Scene = null;
    private _groupOfShells: GroupOfShells;
    public _platform: Phaser.Physics.Matter.Sprite = null;
    public _turret: Phaser.Physics.Matter.Sprite = null;

    constructor(scene: Phaser.Scene, position: StartPosition, map: Map, shellTexture: string, enemy: boolean) {
        super(scene, "platform");
        this._scene = scene;
        this.init(position, map, shellTexture, enemy);
    }

    private init(position: StartPosition, map: Map, shellTexture: string, enemy: boolean): void {
        this._platform = this._scene.matter.add.sprite(position.x, position.y, "objects", "platform");
        this._platform.setStatic(true);
        this._turret = this._scene.matter.add.sprite(position.x, position.y, "objects", "turret");
        this._turret.setStatic(true);
        this._groupOfShells = new GroupOfShells(this._scene, this._turret, map, shellTexture, enemy);
    }

    public watch(player: Player): void {
        const angle = Phaser.Math.Angle.Between(this._turret.x, this._turret.y, player.sprite.x, player.sprite.y);
        this._turret.rotation = angle - Math.PI / 2; // Math.PI / 2 - trick to turn turret oposite to the tank

        this.fire();
    }

    private fire(): void {
        if (this._groupOfShells) {
            this._groupOfShells.createFire();
        }
    }
}