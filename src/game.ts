import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import GameScene from "./scenes/GameScene";

const config = {
    type: Phaser.AUTO,
    width: 1280, // set according to background image size / map`s size!!!
    height: 750, // set according to background image size / map`s size!!!
    scene: [
        new BootScene(),
        new PreloadScene(),
        // new StartScene(),
        new GameScene()
    ],
    scale: {
        mode: Phaser.Scale.FIT, // auto scaling of all sprites
        autoCenter: Phaser.Scale.CENTER_BOTH // canvas centering in the center of the screen
    },
    physics: {
        // default: "arcade",
        // arcade: { debug: false} // if true -> shows objects` frames
        default: "matter",
        matter: {
            debug: false,
            gravity: { x: 0, y: 0 }
        }
    }
};

const game = new Phaser.Game(config);