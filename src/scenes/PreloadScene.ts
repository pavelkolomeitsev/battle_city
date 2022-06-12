import { LoadingBar } from "../utils/LoadingBar";
import { BANG_ANIMATION, RADAR_ANIMATION, SPARKLE_ANIMATION, XPOINTS_1_ANIMATION, XPOINTS_2_ANIMATION, XPOINTS_3_ANIMATION } from "../utils/utils";

export default class PreloadScene extends Phaser.Scene {
    constructor() {super({key: "preload-scene"});}

    protected preload(): void {
        const sprite: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, "logo").setOrigin(0);
        sprite.setX(window.innerWidth / 2 - sprite.width / 2);
        sprite.setY(window.innerHeight / 2 - sprite.height / 2);
        new LoadingBar(this);

        // load images as a tileset
        this.load.spritesheet("tileset", "assets/images/tilemap.png", { frameWidth: 64, frameHeight: 64, margin: 0, spacing: 0 });
        this.load.tilemapTiledJSON("tilemap", "assets/images/tilemap.json");
        this.load.atlas("objects", "assets/images/objects.png", "assets/images/objects.json");

        this.load.audio("prelevelMelody", "assets/sounds/prelevelMelody.mp3");
        this.load.audio("mainMelody", "assets/sounds/mainMelody.mp3");
        this.load.audio("fightMelody", "assets/sounds/fightMelody.mp3");
        this.load.audio("playerIfvShooting", "assets/sounds/playerIfvShooting.mp3");
        this.load.audio("playerTankShooting", "assets/sounds/playerTankShooting.mp3");
        this.load.audio("simpleExplosion", "assets/sounds/simpleExplosion.mp3");
        this.load.audio("click", "assets/sounds/click.mp3");
    }

    protected create(): void {
        this.scene.start("start-scene");
        this.loadAnimation(); // loading all animation safely
    }

    private loadAnimation(): void {
        const bangFrames: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "explosion",
            start: 1,
            end: 5
        });
        this.anims.create({
            key: BANG_ANIMATION,
            frames: bangFrames,
            frameRate: 5,
            duration: 800, // miliseconds
            repeat: 0, // to play animation only once
        });

        const frames: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "platform",
            start: 1,
            end: 8
        });
        this.anims.create({
            key: RADAR_ANIMATION,
            frames: frames,
            frameRate: 7,
            duration: 1000, // miliseconds
            repeat: -1, // to play animation infinitely
        });

        const sparkleFrame: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "sparkle",
            start: 1,
            end: 1
        });
        this.anims.create({
            key: SPARKLE_ANIMATION,
            frames: sparkleFrame,
            frameRate: 7,
            duration: 350, // miliseconds
            repeat: 0, // to play animation only once
        });

        const xpoints1Frame: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            suffix: "xp",
            start: 1,
            end: 1
        });
        this.anims.create({
            key: XPOINTS_1_ANIMATION,
            frames: xpoints1Frame,
            frameRate: 1,
            duration: 2000, // miliseconds
            repeat: 0, // to play animation only once
        });

        const xpoints2Frame: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            suffix: "xp",
            start: 2,
            end: 2
        });
        this.anims.create({
            key: XPOINTS_2_ANIMATION,
            frames: xpoints2Frame,
            frameRate: 1,
            duration: 2000, // miliseconds
            repeat: 0, // to play animation only once
        });

        const xpoints3Frame: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            suffix: "xp",
            start: 3,
            end: 3
        });
        this.anims.create({
            key: XPOINTS_3_ANIMATION,
            frames: xpoints3Frame,
            frameRate: 1,
            duration: 2000, // miliseconds
            repeat: 0, // to play animation only once
        });
    }
}