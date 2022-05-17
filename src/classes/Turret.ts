import { StartPosition } from "../utils/utils";
import GroupOfShells from "./GroupOfShells";
import Map from "./Map";
import Player from "./Player";
import Radar from "./Radar";

export default class Turret {
    private _scene: Phaser.Scene = null;
    public groupOfShells: GroupOfShells;
    public platform: Phaser.GameObjects.Sprite = null;
    public turret: Phaser.GameObjects.Sprite = null;
    public isFiring: boolean = true;

    constructor(scene: Phaser.Scene, position: StartPosition, map: Map, shellTexture: string, enemy: boolean) {
        this._scene = scene;
        this.init(position, map, shellTexture, enemy);
    }

    private init(position: StartPosition, map: Map, shellTexture: string, enemy: boolean): void {
        this.platform = new Phaser.GameObjects.Sprite(this._scene, position.x, position.y, "objects", "platform");
        this._scene.add.existing(this.platform);
        this._scene.physics.add.existing(this.platform);
        this.platform.body.enable = true;
        this.turret = new Phaser.GameObjects.Sprite(this._scene, position.x, position.y, "objects", "turret");
        this._scene.add.existing(this.turret);
        this._scene.physics.add.existing(this.turret);
        this.turret.body.enable = true;
        this.groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, this.turret, map, shellTexture, enemy);
    }

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
        if (this.groupOfShells && this.isFiring) this.groupOfShells.createFire();
    }

    public destroyTurret(): void {
        // this.turret.body.enable = false;
        // this.turret.setVisible(false);
        // this.turret.setActive(false);

        this.turret.destroy();
        this.turret = null;
        this.platform.destroy();
        this.platform = null;
        // this.platform.body.enable = false;
        // this.platform.setVisible(false);
        // this.platform.setActive(false);

        this._scene = null;
        this.groupOfShells = null;
    }
}