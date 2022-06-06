import { LoadingBar } from "../utils/LoadingBar";

export default class PreloadScene extends Phaser.Scene {
    constructor() {super({key: "preload-scene"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
        new LoadingBar(this);

        // load images as a tileset
        this.load.spritesheet("tileset", "assets/images/tilemap.png", { frameWidth: 64, frameHeight: 64, margin: 0, spacing: 0 });
        this.load.tilemapTiledJSON("tilemap", "assets/images/tilemap.json");
        this.load.atlas("objects", "assets/images/objects.png", "assets/images/objects.json");
    }

    protected create(): void {
        this.scene.start("level-1");
    }
}