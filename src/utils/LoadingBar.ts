export class LoadingBar {
    private scene: Phaser.Scene;
    private style: any;
    private progressBox: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.style = {
            boxColor: 0xD3D3D3,
            barColor: 0xFFF8DC,
            x: (this.scene.game.config.width) as number / 2 - 450,
            y: (this.scene.game.config.height) as number / 2 + 250,
            width: 900,
            height: 25
        };
        this.progressBox = new Phaser.GameObjects.Graphics(this.scene);
        this.progressBox = this.scene.add.graphics();
        this.progressBar = this.scene.add.graphics();

        this.showProgressBox();
        this.setEvents();
    }

    setEvents() {
        this.scene.load.on("progress", this.showProgressBar, this);
        this.scene.load.on("complete", this.onLoadComplete, this);
    }

    showProgressBox() {
        this.progressBox
            .fillStyle(this.style.boxColor) // grey color
            .fillRect(this.style.x, this.style.y, this.style.width, this.style.height);
    }

    showProgressBar(value: number) {
        this.progressBar
            .clear()
            .fillStyle(this.style.barColor) // yellow color
            .fillRect(this.style.x, this.style.y, this.style.width * value, this.style.height);
    }

    onLoadComplete() {
        this.progressBox.destroy();
        this.progressBar.destroy();
    }
}