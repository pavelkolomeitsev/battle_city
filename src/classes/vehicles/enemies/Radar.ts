import { RADAR_ANIMATION, StartPosition } from "../../../utils/utils";

export default class Radar extends Phaser.GameObjects.Sprite {
    private _scene: Phaser.Scene = null;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = scene;
        this.init();
        this.runRadar();
    }

    private init(): void {
        this._scene.add.existing(this); // add sprite to the scene
        this._scene.physics.add.existing(this); // add sprite as physic object to Phaser engine
        this.body.enable = true; // the physic body of "dragon" will be available for physic impacts
        this.body.setImmovable(true);
    }

    private runRadar(): void {
        this.play(RADAR_ANIMATION);
    }

    public destroyRadar(): void {
        this._scene.events.emit("enemy_dead", true, false);
        this._scene = null;
        this.destroy();
    }
}