import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import StartScene from "./scenes/StartScene";
import Level_1 from "./scenes/Level_1";
import PostStartScene from "./scenes/PostStartScene";
import HelpScene from "./scenes/HelpScene";
import PrelevelScene from "./scenes/PrelevelScene";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // set according to background image size / map`s size!!!
    height: window.innerHeight, // set according to background image size / map`s size!!!
    scene: [
        new BootScene(),
        new PreloadScene(),
        new StartScene(),
        new PostStartScene(),
        new HelpScene(),
        new PrelevelScene(),
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