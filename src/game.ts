import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import Level_1 from "./scenes/Level_1";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // set according to background image size / map`s size!!!
    height: window.innerHeight, // set according to background image size / map`s size!!!
    scene: [
        new BootScene(),
        new PreloadScene(),
        // new StartScene(),
        new Level_1()
    ],
    scale: {
        mode: Phaser.Scale.FIT, // auto scaling of all sprites
        autoCenter: Phaser.Scale.CENTER_BOTH // canvas centering in the center of the screen
    },
    physics: {
        default: "arcade",
        arcade: { debug: false} // if true -> shows objects` frames
        // default: "matter",
        // matter: {
        //     debug: false,
        //     gravity: { x: 0, y: 0 }
        // }
    }
};

const game = new Phaser.Game(config);