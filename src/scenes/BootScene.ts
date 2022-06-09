export default class BootScene extends Phaser.Scene {
    constructor() {super({key: "boot-scene"});}

    protected preload(): void {
        this.load.image("logo", "assets/images/logo.png");
    }

    protected create(): void {
        this.scene.start("preload-scene");
    }
}