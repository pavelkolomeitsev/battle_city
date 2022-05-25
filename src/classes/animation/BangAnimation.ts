import { BANG_ANIMATION, StartPosition } from "../../utils/utils";

export default class BangAnimation extends Phaser.GameObjects.Sprite {
    private _scene: Phaser.Scene = null;
    
    constructor(scene: Phaser.Scene, position: StartPosition, textureType: string) {
        super(scene, position.x, position.y, textureType);
        this._scene = scene;
        this._scene.add.existing(this);
        this.bangAnimation();
    }

    private bangAnimation(): void {
        this.play(BANG_ANIMATION);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.destroy(), this);
    }

    public static generateBang(scene: Phaser.Scene, position: StartPosition): void {
        new BangAnimation(scene, position, "explosion1");
    }
}