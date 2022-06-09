import { LoadingBar } from "../utils/LoadingBar";

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
    }

    protected create(): void {
        this.scene.start("start-scene");
    }
}