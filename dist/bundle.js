/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scene: [],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1300,
        height: 700
    },
    physics: {
        default: "arcade",
        arcade: { debug: false }
    }
};
const game = new Phaser.Game(config);

/******/ })()
;
//# sourceMappingURL=bundle.js.map