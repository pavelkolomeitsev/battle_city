import { StartPosition } from "../../utils/utils";
import GroupOfShells from "../shells/GroupOfShells";
import Map from "../Map";
import Player from "../Player";

export default class Turret {
    private _scene: Phaser.Scene = null;
    private _health: number = 0;
    public groupOfShells: GroupOfShells;
    public platform: Phaser.GameObjects.Sprite = null;
    public turret: Phaser.GameObjects.Sprite = null;
    public isFiring: boolean = true;

    constructor(scene: Phaser.Scene, position: StartPosition, map: Map, shellTexture: string) {
        this._scene = scene;
        this._health = 3;
        this.init(position, map, shellTexture);
    }

    private init(position: StartPosition, map: Map, shellTexture: string): void {
        this.platform = new Phaser.GameObjects.Sprite(this._scene, position.x, position.y, "objects", "platform");
        this._scene.add.existing(this.platform);
        this._scene.physics.add.existing(this.platform);
        this.platform.body.enable = true;
        this.turret = new Phaser.GameObjects.Sprite(this._scene, position.x, position.y, "objects", "turret");
        this._scene.add.existing(this.turret);
        this._scene.physics.add.existing(this.turret);
        this.turret.body.enable = true;
        this.groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, map, shellTexture);
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
        if (this.groupOfShells && this.isFiring) this.groupOfShells.createFire(this.turret);
    }

    public destroyTurret(): void {
        --this._health;
        // this.turret.body.enable = false;
        // this.turret.setVisible(false);
        // this.turret.setActive(false);
        if (this._health > 0) {
            this.turret.setTexture("objects", `turret_${this._health}`);
        } else {
            this.turret.destroy();
            this.turret = null;
            this.platform.destroy();
            this.platform = null;
            this._scene = null;
            this.groupOfShells = null;
        }
        // this.platform.body.enable = false;
        // this.platform.setVisible(false);
        // this.platform.setActive(false);
    }
}