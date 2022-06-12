import { BANG_ANIMATION, StartPosition } from "../../utils/utils";

export default class BangAnimation extends Phaser.GameObjects.Sprite {
    private _scene: Phaser.Scene = null;
    private _bangSound: Phaser.Sound.BaseSound = null;
    
    constructor(scene: Phaser.Scene, position: StartPosition, textureType: string) {
        super(scene, position.x, position.y, textureType);
        this._scene = scene;
        this._scene.add.existing(this);
        this._bangSound = this._scene.sound.add('simpleExplosion', {volume: 0.9});
        this.bangAnimation();
    }

    private bangAnimation(): void {
        this.play(BANG_ANIMATION);
        this._bangSound.play();
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.destroy(), this);
    }

    public static generateBang(scene: Phaser.Scene, position: StartPosition): void {
        new BangAnimation(scene, position, "explosion1");
    }
}