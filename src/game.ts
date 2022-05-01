const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    // width: 1280, // need to config!!!
    // height: 720, // need to config!!!
    scene: [
        // new BootScene(),
        // new PreloadScene(),
        // new StartScene(),
        // new GameScene()
    ],
    scale: {
        mode: Phaser.Scale.FIT, // auto scaling of all sprites
        autoCenter: Phaser.Scale.CENTER_BOTH, // canvas centering in the center of the screen
        width: 1300,
        height: 700
    },
    physics: {
        default: "arcade",
        arcade: { debug: false} // if true -> shows objects` frames
    }
};

const game = new Phaser.Game(config);