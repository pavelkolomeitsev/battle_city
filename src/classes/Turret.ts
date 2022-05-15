import { StartPosition } from "../utils/utils";
import GroupOfShells from "./GroupOfShells";
import Map from "./Map";
import Player from "./Player";

export default class Turret {
    private _scene: Phaser.Scene = null;
    public groupOfShells: GroupOfShells;
    public platform: Phaser.GameObjects.Sprite = null;
    public turret: Phaser.GameObjects.Sprite = null;
    public isFiring: boolean = true;

    constructor(scene: Phaser.Scene, position: StartPosition, map: Map, shellTexture: string, enemy: boolean) {
        this._scene = scene;
        // this.init(position, map, shellTexture, enemy);
    }

    // private init(position: StartPosition, map: Map, shellTexture: string, enemy: boolean): void {
    //     this.platform = this._scene.add.existing(this._scene, position.x, position.y, "objects", "platform");
    //     this.platform.setStatic(true);
    //     this.turret = this._scene.matter.add.sprite(position.x, position.y, "objects", "turret");
    //     this.turret.setStatic(true);
    //     this.groupOfShells = new GroupOfShells(this._scene, this.turret, map, shellTexture, enemy);
    // }

    public runTurret(player: Player, isPlayerNear: boolean): void {
        isPlayerNear ? this.watchAndFire(player) : this.watch(player);
    }

    private watch(player: Player): void {
        this.getCorrectAngle(player);
    }

    private watchAndFire(player: Player): void {
        this.getCorrectAngle(player);
        this.fire();
    }

    private getCorrectAngle(player: Player): void {
        if (this.turret && player) {
            const angle = Phaser.Math.Angle.Between(this.turret.x, this.turret.y, player.x, player.y);
            this.turret.rotation = angle - Math.PI / 2; // Math.PI / 2 - trick to turn turret oposite to the tank
        }
    }

    private fire(): void {
        if (this.groupOfShells && this.isFiring) {
            this.groupOfShells.createFire();
        }
    }

    public destroyTurret(): void {
        this.turret.destroy();
        this.turret = null;
        this.platform.destroy();
        this.platform = null;
        // this.destroy();
    }
}