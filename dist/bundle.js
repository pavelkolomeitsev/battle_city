/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/BangAnimation.ts":
/*!**************************************!*\
  !*** ./src/classes/BangAnimation.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class BangAnimation extends Phaser.GameObjects.GameObject {
    constructor(scene, position) {
        super(scene, "objects");
        this._scene = null;
        this._sprite = null;
        this._scene = scene;
        this._sprite = this._scene.matter.add.sprite(position.x, position.y, "objects", "explosion1");
        this._sprite.setSensor(true);
        this.bangAnimation();
    }
    bangAnimation() {
        this._sprite.play(utils_1.BANG_ANIMATION);
        this._sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            this._sprite.destroy();
            this.destroy();
        }, this);
    }
    static generateBang(scene, position) {
        new BangAnimation(scene, position);
    }
}
exports["default"] = BangAnimation;


/***/ }),

/***/ "./src/classes/GroupOfShells.ts":
/*!**************************************!*\
  !*** ./src/classes/GroupOfShells.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shell_1 = __importDefault(__webpack_require__(/*! ./Shell */ "./src/classes/Shell.ts"));
class GroupOfShells extends Phaser.GameObjects.Group {
    constructor(scene, parentSprite, map, texture, enemy = true) {
        super(scene);
        this._scene = null;
        this._parentSprite = null;
        this._map = null;
        this._texture = "";
        this._enemy = 1;
        this._nextShoot = 0;
        this._scene = scene;
        this._parentSprite = parentSprite;
        this._map = map;
        this._texture = texture;
        this._enemy = enemy ? 1 : -1;
    }
    createFire() {
        if (this._nextShoot > this._scene.time.now)
            return;
        let shell = this.getFirstDead();
        if (!shell) {
            shell = new Shell_1.default(this._scene, this._parentSprite, this._map, this._texture);
            this.add(shell);
        }
        else {
            shell.reset();
        }
        shell.flyOut(this._enemy);
        this._nextShoot = this._scene.time.now + 500;
    }
}
exports["default"] = GroupOfShells;


/***/ }),

/***/ "./src/classes/Map.ts":
/*!****************************!*\
  !*** ./src/classes/Map.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class Map {
    constructor(scene) {
        this._scene = null;
        this._tileset = null;
        this.tilemap = null;
        this._scene = scene;
        this.init();
        this.create();
    }
    init() {
        this.tilemap = this._scene.make.tilemap({ key: "tilemap" });
        this._tileset = this.tilemap.addTilesetImage("tilemap", "tileset", 64, 64, 0, 0);
    }
    create() {
        this.createLayers();
        this.createCollisions();
    }
    createLayers() {
        this.tilemap.createLayer("ground", this._tileset);
        this.tilemap.createLayer("road", this._tileset);
    }
    createCollisions() {
        this.tilemap.findObject("collisions", collisionObject => {
            const castedObject = collisionObject;
            const sprite = this._scene.matter.add.sprite(castedObject.x + castedObject.width / 2, castedObject.y - castedObject.height / 2, "objects", collisionObject.name);
            sprite.setStatic(true);
        });
    }
    createChekpoints() {
    }
    getPlayer() {
        return this.tilemap.findObject("player", playerObject => playerObject.name === "player");
    }
    getTurretPosition() {
        const turret = this.tilemap.findObject("enemy", playerObject => playerObject.name === "enemy");
        const position = { x: turret.x, y: turret.y };
        return position;
    }
    getTileFriction(car) {
        for (const roadType in utils_1.ROADS_FRICTION) {
            const tile = this.tilemap.getTileAtWorldXY(car.x, car.y, false, this._scene.cameras.main, roadType);
            if (tile)
                return utils_1.ROADS_FRICTION[roadType];
        }
        return utils_1.GROUND_FRICTION;
    }
}
exports["default"] = Map;


/***/ }),

/***/ "./src/classes/Player.ts":
/*!*******************************!*\
  !*** ./src/classes/Player.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vehicle_1 = __importDefault(__webpack_require__(/*! ./Vehicle */ "./src/classes/Vehicle.ts"));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class Player extends Vehicle_1.default {
    constructor(scene, position, texture, map, shellTexture, enemy) {
        super(scene, position, texture, map, shellTexture, enemy);
        this._scene = null;
        this._map = null;
        this._cursor = null;
        this._scene = scene;
        this._map = map;
        this._cursor = this._scene.input.keyboard.createCursorKeys();
    }
    get direction() {
        let direction = utils_1.DIRECTIONS.NONE;
        if (this._cursor.up.isDown)
            direction = utils_1.DIRECTIONS.FORWARD;
        else if (this._cursor.down.isDown)
            direction = utils_1.DIRECTIONS.BACKWARD;
        return direction;
    }
    get turn() {
        let turn = utils_1.TURNS.NONE;
        if (this._cursor.right.isDown)
            turn = utils_1.TURNS.RIGHT;
        else if (this._cursor.left.isDown)
            turn = utils_1.TURNS.LEFT;
        return turn;
    }
    move() {
        super.move();
        if (this._cursor.space.isDown)
            this.fire();
    }
}
exports["default"] = Player;


/***/ }),

/***/ "./src/classes/Shell.ts":
/*!******************************!*\
  !*** ./src/classes/Shell.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Shell extends Phaser.GameObjects.GameObject {
    constructor(scene, parentSprite, map, texture) {
        super(scene, texture);
        this._scene = null;
        this._parentSprite = null;
        this._map = null;
        this._texture = "";
        this._sprite = null;
        this._scene = scene;
        this._parentSprite = parentSprite;
        this._map = map;
        this._texture = texture;
        this._scene.events.on("update", this.update, this);
    }
    update() {
        if (this._sprite.active && (this._sprite.x < -20 ||
            this._sprite.x > this._map.tilemap.widthInPixels + 20 ||
            this._sprite.y < -20 ||
            this._sprite.y > this._map.tilemap.heightInPixels + 20))
            this.setAlive(false);
    }
    setAlive(status) {
        this._sprite.body.enable = status;
        this._sprite.setVisible(status);
        this._sprite.setActive(status);
        this.setActive(status);
    }
    flyOut(direction) {
        const vector = new Phaser.Math.Vector2();
        vector.setToPolar(this._parentSprite.rotation + (direction * Math.PI / 2), 30);
        this._sprite = this._scene.matter.add.sprite(this._parentSprite.x + vector.x, this._parentSprite.y + vector.y, "objects", this._texture);
        this._sprite.angle = this._parentSprite.angle;
        this._sprite.setVelocity(vector.x * 0.9, vector.y * 0.9);
    }
    reset() {
        this.setAlive(true);
    }
}
exports["default"] = Shell;


/***/ }),

/***/ "./src/classes/Turret.ts":
/*!*******************************!*\
  !*** ./src/classes/Turret.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const GroupOfShells_1 = __importDefault(__webpack_require__(/*! ./GroupOfShells */ "./src/classes/GroupOfShells.ts"));
class Turret extends Phaser.GameObjects.GameObject {
    constructor(scene, position, map, shellTexture, enemy) {
        super(scene, "platform");
        this._scene = null;
        this._platform = null;
        this._turret = null;
        this._scene = scene;
        this.init(position, map, shellTexture, enemy);
    }
    init(position, map, shellTexture, enemy) {
        this._platform = this._scene.matter.add.sprite(position.x, position.y, "objects", "platform");
        this._platform.setStatic(true);
        this._turret = this._scene.matter.add.sprite(position.x, position.y, "objects", "turret");
        this._turret.setStatic(true);
        this._groupOfShells = new GroupOfShells_1.default(this._scene, this._turret, map, shellTexture, enemy);
    }
    watch(player) {
        const angle = Phaser.Math.Angle.Between(this._turret.x, this._turret.y, player.sprite.x, player.sprite.y);
        this._turret.rotation = angle - Math.PI / 2;
        this.fire();
    }
    fire() {
        if (this._groupOfShells) {
            this._groupOfShells.createFire();
        }
    }
}
exports["default"] = Turret;


/***/ }),

/***/ "./src/classes/Vehicle.ts":
/*!********************************!*\
  !*** ./src/classes/Vehicle.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
const GroupOfShells_1 = __importDefault(__webpack_require__(/*! ./GroupOfShells */ "./src/classes/GroupOfShells.ts"));
class Vehicle {
    constructor(scene, position, texture, map, shellTexture, enemy) {
        this._scene = null;
        this._map = null;
        this.sprite = null;
        this._scene = scene;
        this._map = map;
        this._velocity = 0;
        this.sprite = this._scene.matter.add.sprite(position.x, position.y, "objects", texture);
        this.sprite.setFixedRotation();
        this._groupOfShells = new GroupOfShells_1.default(this._scene, this.sprite, this._map, shellTexture, enemy);
    }
    get direction() {
        let direction = utils_1.DIRECTIONS.NONE;
        return direction;
    }
    get velocity() {
        const carSpeed = Math.abs(this._velocity);
        const maxSpeed = this.getMaxSpeed();
        if (this.direction && carSpeed < maxSpeed) {
            this._velocity += this.direction;
        }
        else if ((this.direction && carSpeed > maxSpeed) || (!this.direction && carSpeed > 0)) {
            this._velocity -= this._velocity;
        }
        return this._velocity;
    }
    getMaxSpeed() {
        return utils_1.SPEED.BASIC * this._map.getTileFriction(this.sprite);
    }
    get turn() {
        let turn = utils_1.TURNS.NONE;
        return turn;
    }
    get angle() {
        return this.sprite.angle + this.turn * utils_1.SPEED.BASIC / 2;
    }
    getVelocityFromAngle() {
        const vector2 = new Phaser.Math.Vector2();
        return vector2.setToPolar(this.sprite.rotation - Math.PI / 2, this.velocity);
    }
    move() {
        this.checkOutOfBounds();
        this.sprite.setAngle(this.angle);
        const velocity = this.getVelocityFromAngle();
        this.sprite.setVelocity(velocity.x, velocity.y);
    }
    checkOutOfBounds() {
        if (this.sprite.body.position.y > this._map.tilemap.heightInPixels) {
            this.sprite.body.position.y = this._map.tilemap.heightInPixels - 20;
        }
        ;
        if (this.sprite.body.position.y < 0) {
            this.sprite.body.position.y = 20;
        }
        if (this.sprite.body.position.x < 0) {
            this.sprite.body.position.x = 20;
        }
        if (this.sprite.body.position.x > this._map.tilemap.widthInPixels) {
            this.sprite.body.position.x = this._map.tilemap.widthInPixels - 20;
        }
    }
    fire() {
        if (this._groupOfShells) {
            this._groupOfShells.createFire();
        }
    }
}
exports["default"] = Vehicle;


/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BootScene_1 = __importDefault(__webpack_require__(/*! ./scenes/BootScene */ "./src/scenes/BootScene.ts"));
const PreloadScene_1 = __importDefault(__webpack_require__(/*! ./scenes/PreloadScene */ "./src/scenes/PreloadScene.ts"));
const GameScene_1 = __importDefault(__webpack_require__(/*! ./scenes/GameScene */ "./src/scenes/GameScene.ts"));
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 750,
    scene: [
        new BootScene_1.default(),
        new PreloadScene_1.default(),
        new GameScene_1.default()
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "matter",
        matter: {
            debug: false,
            gravity: { x: 0, y: 0 }
        }
    }
};
const game = new Phaser.Game(config);


/***/ }),

/***/ "./src/scenes/BootScene.ts":
/*!*********************************!*\
  !*** ./src/scenes/BootScene.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class BootScene extends Phaser.Scene {
    constructor() { super({ key: "boot-scene" }); }
    preload() {
        this.load.image("background", "assets/images/background.png");
    }
    create() {
        this.scene.start("preload-scene");
    }
}
exports["default"] = BootScene;


/***/ }),

/***/ "./src/scenes/GameScene.ts":
/*!*********************************!*\
  !*** ./src/scenes/GameScene.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BangAnimation_1 = __importDefault(__webpack_require__(/*! ../classes/BangAnimation */ "./src/classes/BangAnimation.ts"));
const Map_1 = __importDefault(__webpack_require__(/*! ../classes/Map */ "./src/classes/Map.ts"));
const Player_1 = __importDefault(__webpack_require__(/*! ../classes/Player */ "./src/classes/Player.ts"));
const Turret_1 = __importDefault(__webpack_require__(/*! ../classes/Turret */ "./src/classes/Turret.ts"));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "game-scene" });
        this._map = null;
        this._player1 = null;
        this._turret = null;
    }
    preload() {
        this.add.sprite(0, 0, "background").setOrigin(0);
        const frames = this.anims.generateFrameNames("objects", {
            prefix: "explosion",
            start: 1,
            end: 5
        });
        this.anims.create({
            key: utils_1.BANG_ANIMATION,
            frames: frames,
            frameRate: 5,
            duration: 800,
            repeat: 0,
        });
    }
    create() {
        this._map = new Map_1.default(this);
        const vehicle = this.getVehicleConfig();
        const player = this._map.getPlayer();
        const position = { x: player.x, y: player.y };
        this._player1 = new Player_1.default(this, position, vehicle.player1.sprite, this._map, "bulletRed1_outline", false);
        this.matter.world.on("collisionstart", (event, box, shell) => {
            if (box.gameObject.frame.name === "crateWood" && shell.gameObject.frame.name === "bulletRed1_outline") {
                const position = box.position;
                box.gameObject.destroy();
                shell.gameObject.destroy();
                BangAnimation_1.default.generateBang(this, position);
            }
        }, this);
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this.cameras.main.startFollow(this._player1.sprite);
        this._turret = new Turret_1.default(this, this._map.getTurretPosition(), this._map, "bulletDark1_outline", true);
    }
    update(time, delta) {
        this._player1.move();
        this._turret.watch(this._player1);
    }
    getVehicleConfig() {
        let config = { player1: utils_1.TANKS.RED, player2: utils_1.TANKS.BLUE };
        return config;
    }
}
exports["default"] = GameScene;


/***/ }),

/***/ "./src/scenes/PreloadScene.ts":
/*!************************************!*\
  !*** ./src/scenes/PreloadScene.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const LoadingBar_1 = __webpack_require__(/*! ../utils/LoadingBar */ "./src/utils/LoadingBar.ts");
class PreloadScene extends Phaser.Scene {
    constructor() { super({ key: "preload-scene" }); }
    preload() {
        this.add.sprite(0, 0, "background").setOrigin(0);
        new LoadingBar_1.LoadingBar(this);
        this.load.spritesheet("tileset", "assets/images/tilemap.png", { frameWidth: 64, frameHeight: 64 });
        this.load.tilemapTiledJSON("tilemap", "assets/images/tilemap.json");
        this.load.atlas("objects", "assets/images/objects.png", "assets/images/objects.json");
    }
    create() {
        this.scene.start("game-scene");
    }
}
exports["default"] = PreloadScene;


/***/ }),

/***/ "./src/utils/LoadingBar.ts":
/*!*********************************!*\
  !*** ./src/utils/LoadingBar.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadingBar = void 0;
class LoadingBar {
    constructor(scene) {
        this.scene = scene;
        this.style = {
            boxColor: 0xD3D3D3,
            barColor: 0xFFF8DC,
            x: (this.scene.game.config.width) / 2 - 450,
            y: (this.scene.game.config.height) / 2 + 250,
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
            .fillStyle(this.style.boxColor)
            .fillRect(this.style.x, this.style.y, this.style.width, this.style.height);
    }
    showProgressBar(value) {
        this.progressBar
            .clear()
            .fillStyle(this.style.barColor)
            .fillRect(this.style.x, this.style.y, this.style.width * value, this.style.height);
    }
    onLoadComplete() {
        this.progressBox.destroy();
        this.progressBar.destroy();
    }
}
exports.LoadingBar = LoadingBar;


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BANG_ANIMATION = exports.TANKS = exports.ROADS_FRICTION = exports.GROUND_FRICTION = exports.SPEED = exports.TURNS = exports.DIRECTIONS = void 0;
var DIRECTIONS;
(function (DIRECTIONS) {
    DIRECTIONS[DIRECTIONS["NONE"] = 0] = "NONE";
    DIRECTIONS[DIRECTIONS["FORWARD"] = 1] = "FORWARD";
    DIRECTIONS[DIRECTIONS["BACKWARD"] = -1] = "BACKWARD";
})(DIRECTIONS = exports.DIRECTIONS || (exports.DIRECTIONS = {}));
;
var TURNS;
(function (TURNS) {
    TURNS[TURNS["NONE"] = 0] = "NONE";
    TURNS[TURNS["RIGHT"] = 1] = "RIGHT";
    TURNS[TURNS["LEFT"] = -1] = "LEFT";
})(TURNS = exports.TURNS || (exports.TURNS = {}));
;
var SPEED;
(function (SPEED) {
    SPEED[SPEED["BASIC"] = 3] = "BASIC";
    SPEED[SPEED["FASTER"] = 5] = "FASTER";
    SPEED[SPEED["FASTEST"] = 7] = "FASTEST";
})(SPEED = exports.SPEED || (exports.SPEED = {}));
;
exports.GROUND_FRICTION = 0.5;
exports.ROADS_FRICTION = {
    road: 1
};
exports.TANKS = {
    RED: {
        sprite: "tank_red",
        position: "player"
    },
    BLUE: {
        sprite: "tank_green",
        position: "player"
    }
};
exports.BANG_ANIMATION = "BANG_ANIMATION";


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/game.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map