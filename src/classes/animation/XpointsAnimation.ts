import { StartPosition } from "../../utils/utils";

export default class XpointsAnimation extends Phaser.GameObjects.Sprite {
    private _scene: Phaser.Scene = null;
    
    constructor(scene: Phaser.Scene, position: StartPosition, textureType: string, spriteNumber: number) {
        super(scene, position.x, position.y, textureType);
        this._scene = scene;
        this._scene.add.existing(this);
        this.xpointsAnimation(spriteNumber);
    }

    private xpointsAnimation(spriteNumber: number): void {
        this.play(`XPOINTS_${spriteNumber}_ANIMATION`);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.destroy(), this);
    }

    public static generateAnimation(scene: Phaser.Scene, position: StartPosition, spriteNumber: number): void {
        const texture: string = `${spriteNumber}xp`;
        new XpointsAnimation(scene, position, texture, spriteNumber);
    }
}