import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import StartScene from "./scenes/StartScene";
import Level_1 from "./scenes/levels/Level_1";
import PostStartScene from "./scenes/PostStartScene";
import HelpScene from "./scenes/HelpScene";
import PrelevelScene from "./scenes/PrelevelScene";
import PostlevelScene from "./scenes/PostlevelScene";
import GameOverScene from "./scenes/GameOverScene";
import Level_2 from "./scenes/levels/Level_2";
import Level_3 from "./scenes/levels/Level_5";
import Level_4 from "./scenes/levels/Level_3";
import Level_5 from "./scenes/levels/Level_4";
import Level_6 from "./scenes/levels/Level_6";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // set according to background image size / map`s size!!!
    height: window.innerHeight, // set according to background image size / map`s size!!!
    scene: [
        new BootScene(),
        new PreloadScene(),
        new StartScene(),
        new HelpScene(),
        new PostStartScene(),
        new PrelevelScene(),
        new PostlevelScene(),
        new Level_1(),
        new Level_2(),
        new Level_3(),
        new Level_4(),
        new Level_5(),
        new Level_6(),
        new GameOverScene()
    ],
    scale: {
        mode: Phaser.Scale.FIT, // auto scaling of all sprites
        autoCenter: Phaser.Scale.CENTER_BOTH // canvas centering in the center of the screen
    },
    physics: {
        default: "arcade",
        arcade: { debug: false} // if true -> shows objects` frames
    }
};

const game = new Phaser.Game(config);