import { BANG_ANIMATION, StartPosition } from "../utils/utils";

export default class BangAnimation extends Phaser.GameObjects.GameObject {
    private _scene: Phaser.Scene = null;
    private _sprite: Phaser.Physics.Matter.Sprite = null;

    constructor(scene: Phaser.Scene, position: StartPosition) {
        super(scene, "objects");
        this._scene = scene;
        this._sprite = this._scene.matter.add.sprite(position.x, position.y, "objects", "explosion1");
        this._sprite.setSensor(true);
        this.bangAnimation();
    }

    private bangAnimation(): void {
        this._sprite.play(BANG_ANIMATION);
        this._sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            this._sprite.destroy();
            this.destroy();
        }, this);
    }

    public static generateBang(scene: Phaser.Scene, position: StartPosition): void {
        new BangAnimation(scene, position);
    }
}