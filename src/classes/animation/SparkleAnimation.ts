import { SPARKLE_ANIMATION, StartPosition } from "../../utils/utils";

export default class SparkleAnimation extends Phaser.GameObjects.Sprite {
    private _scene: Phaser.Scene = null;
    
    constructor(scene: Phaser.Scene, position: StartPosition, textureType: string) {
        super(scene, position.x, position.y, textureType);
        this._scene = scene;
        this._scene.add.existing(this);
        this.sparkleAnimation();
    }

    private sparkleAnimation(): void {
        this.play(SPARKLE_ANIMATION);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.destroy(), this);
    }

    public static generateBang(scene: Phaser.Scene, position: StartPosition): void {
        new SparkleAnimation(scene, position, "sparkle1");
    }
}