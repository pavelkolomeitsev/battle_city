/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/Headquarter.ts":
/*!************************************!*\
  !*** ./src/classes/Headquarter.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Headquarter extends Phaser.GameObjects.Sprite {
    constructor(scene, position, atlasName, textureName) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = null;
        this._scene = scene;
        this.init();
    }
    init() {
        this._scene.add.existing(this);
        this._scene.physics.add.existing(this);
        this.body.enable = true;
        this.body.setImmovable(true);
    }
    destroyHeadquarter() {
        if (this.frame.name === "headquarterRu") {
            this._scene.events.emit("enemy_headquarter_destroyed", false, true);
        }
        else if (this.frame.name === "headquarterUa") {
            this._scene.events.emit("headquarterUa_destroyed");
        }
        this._scene = null;
        this.destroy();
    }
}
exports["default"] = Headquarter;


/***/ }),

/***/ "./src/classes/Map.ts":
/*!****************************!*\
  !*** ./src/classes/Map.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class Map {
    constructor(scene, level) {
        this._scene = null;
        this._tileset = null;
        this._defenceArea1 = null;
        this._defenceArea2 = null;
        this._baseArea = null;
        this._level = 0;
        this.tilemap = null;
        this.explosiveObjects = [];
        this.stones = [];
        this._scene = scene;
        this._level = level;
        this.init();
        this.create();
    }
    init() {
        this.tilemap = this._scene.make.tilemap({ key: "tilemap" });
        this._tileset = this.tilemap.addTilesetImage("terrain", "tileset", 64, 64, 0, 0);
    }
    create() {
        this.createLayers();
        this.createExplosiveStaticLayer();
        this.createStonesLayer();
        this.createTreesLayer();
        this.createAreas();
        this.createDefenceAreas();
    }
    createLayers() {
        this.tilemap.createLayer("grass" + this._level, this._tileset);
        this.tilemap.createLayer("road" + this._level, this._tileset);
    }
    createExplosiveStaticLayer() {
        this.tilemap.findObject("explosive_static" + this._level, collisionObject => {
            const castedObject = collisionObject;
            let sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x + castedObject.width / 2, castedObject.y - castedObject.height / 2, "objects", collisionObject.name);
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, true);
            sprite.body.enable = true;
            this.explosiveObjects.push(sprite);
        });
    }
    createStonesLayer() {
        this.tilemap.findObject("stones" + this._level, gameObject => {
            const castedObject = gameObject;
            const sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x + castedObject.width / 2, castedObject.y - castedObject.height / 2, "objects", gameObject.name);
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, true);
            sprite.body.enable = true;
            this.stones.push(sprite);
        });
    }
    createTreesLayer() {
        this.tilemap.findObject("trees" + this._level, gameObject => {
            const castedObject = gameObject;
            const sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x + castedObject.width / 2, castedObject.y - castedObject.height / 2, "objects", gameObject.name);
            sprite.depth = 10;
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, false);
        });
    }
    createAreas() {
        let array = this.tilemap.filterObjects("enemies" + this._level, checkpoint => checkpoint.name === "defence_area1");
        array.forEach((item) => {
            this._defenceArea1 = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        array = this.tilemap.filterObjects("enemies" + this._level, checkpoint => checkpoint.name === "base_area");
        array.forEach((item) => {
            this._baseArea = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        array = null;
    }
    createDefenceAreas() {
        let array = this.tilemap.filterObjects("enemies" + this._level, checkpoint => checkpoint.name === "defence_area1");
        array.forEach((item) => {
            this._defenceArea1 = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        array = this.tilemap.filterObjects("enemies" + this._level, checkpoint => checkpoint.name === "defence_area2");
        array.forEach((item) => {
            this._defenceArea2 = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        array = null;
    }
    getPlayer(playerNumber) {
        return this.tilemap.findObject("players" + this._level, playerObject => playerObject.name === `player${playerNumber}`);
    }
    getTurretPosition(number) {
        const turret = this.tilemap.findObject("enemies" + this._level, playerObject => playerObject.name === `turret${number}`);
        const position = { x: turret.x, y: turret.y };
        return position;
    }
    getRadarPosition() {
        const radar = this.tilemap.findObject("enemies" + this._level, playerObject => playerObject.name === "platform1");
        const position = { x: radar.x, y: radar.y };
        return position;
    }
    getHeadquarterPosition(isEnemy) {
        let objectLayer = "";
        let name = "";
        if (isEnemy) {
            objectLayer = "enemies" + this._level;
            name = "headquarterRu";
        }
        else {
            objectLayer = "players" + this._level;
            name = "headquarterUa";
        }
        const radar = this.tilemap.findObject(objectLayer, playerObject => playerObject.name === name);
        const position = { x: radar.x, y: radar.y };
        return position;
    }
    getBasePosition(baseNumber) {
        const base = this.tilemap.findObject("enemies" + this._level, playerObject => playerObject.name === `base_${baseNumber}`);
        const position = { x: base === null || base === void 0 ? void 0 : base.x, y: base === null || base === void 0 ? void 0 : base.y };
        return position;
    }
    getTileFriction(vehicle) {
        for (const roadType in utils_1.FRICTIONS) {
            const tile = this.tilemap.getTileAtWorldXY(vehicle.x, vehicle.y, false, this._scene.cameras.main, roadType + this._level);
            if (tile)
                return utils_1.FRICTIONS[roadType];
        }
        return utils_1.GROUND_FRICTION;
    }
    checkPlayersPosition(radar, playersTank) {
        if (radar.active && playersTank.active) {
            return this.isInDefenceArea(playersTank);
        }
        else if (!radar.active && playersTank.active) {
            return this.isInBaseArea(playersTank);
        }
        else
            return false;
    }
    checkPlayersPositionNoRadar(playersTank, areaNumber) {
        if (playersTank.active && areaNumber === 1) {
            return this._defenceArea1.contains(playersTank.x, playersTank.y);
        }
        else if (playersTank.active && areaNumber === 2) {
            return this._defenceArea2.contains(playersTank.x, playersTank.y);
        }
        else
            return false;
    }
    isInDefenceArea(playersTank) {
        if (playersTank.active)
            return this._defenceArea1.contains(playersTank.x, playersTank.y);
    }
    isInBaseArea(playersTank) {
        if (playersTank.active)
            return this._baseArea.contains(playersTank.x, playersTank.y);
    }
}
exports["default"] = Map;


/***/ }),

/***/ "./src/classes/animation/BangAnimation.ts":
/*!************************************************!*\
  !*** ./src/classes/animation/BangAnimation.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
class BangAnimation extends Phaser.GameObjects.Sprite {
    constructor(scene, position, textureType) {
        super(scene, position.x, position.y, textureType);
        this._scene = null;
        this._bangSound = null;
        this._scene = scene;
        this._scene.add.existing(this);
        this._bangSound = this._scene.sound.add('simpleExplosion', { volume: 0.9 });
        this.bangAnimation();
    }
    bangAnimation() {
        this.play(utils_1.BANG_ANIMATION);
        this._bangSound.play();
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.destroy(), this);
    }
    static generateBang(scene, position) {
        new BangAnimation(scene, position, "explosion1");
    }
}
exports["default"] = BangAnimation;


/***/ }),

/***/ "./src/classes/animation/SparkleAnimation.ts":
/*!***************************************************!*\
  !*** ./src/classes/animation/SparkleAnimation.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
class SparkleAnimation extends Phaser.GameObjects.Sprite {
    constructor(scene, position, textureType) {
        super(scene, position.x, position.y, textureType);
        this._scene = null;
        this._scene = scene;
        this._scene.add.existing(this);
        this.sparkleAnimation();
    }
    sparkleAnimation() {
        this.play(utils_1.SPARKLE_ANIMATION);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.destroy(), this);
    }
    static generateBang(scene, position) {
        new SparkleAnimation(scene, position, "sparkle1");
    }
}
exports["default"] = SparkleAnimation;


/***/ }),

/***/ "./src/classes/animation/XpointsAnimation.ts":
/*!***************************************************!*\
  !*** ./src/classes/animation/XpointsAnimation.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class XpointsAnimation extends Phaser.GameObjects.Sprite {
    constructor(scene, position, textureType, spriteNumber) {
        super(scene, position.x, position.y, textureType);
        this._scene = null;
        this._scene = scene;
        this._scene.add.existing(this);
        this.xpointsAnimation(spriteNumber);
    }
    xpointsAnimation(spriteNumber) {
        this.play(`XPOINTS_${spriteNumber}_ANIMATION`);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.destroy(), this);
    }
    static generateAnimation(scene, position, spriteNumber) {
        const texture = `${spriteNumber}xp`;
        new XpointsAnimation(scene, position, texture, spriteNumber);
    }
}
exports["default"] = XpointsAnimation;


/***/ }),

/***/ "./src/classes/shells/GroupOfShells.ts":
/*!*********************************************!*\
  !*** ./src/classes/shells/GroupOfShells.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const Shell_1 = __importDefault(__webpack_require__(/*! ./Shell */ "./src/classes/shells/Shell.ts"));
class GroupOfShells extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, map, texture, enemy = true, experience = 0) {
        super(world, scene);
        this._scene = null;
        this._map = null;
        this._texture = "";
        this._enemy = false;
        this._direction = 1;
        this._nextShoot = 0;
        this._pauseBetweenShoots = 0;
        this._scene = scene;
        this._map = map;
        this._texture = texture;
        this._enemy = enemy;
        this._direction = enemy ? 1 : -1;
        this.setPauseBetweenShoots(experience);
    }
    createFire(parentSprite) {
        if (this._nextShoot > this._scene.time.now || !parentSprite.active)
            return;
        let shell = this.getFirstDead();
        const side = this._enemy ? -37 : 40;
        if (!shell) {
            const vector = this._scene.physics.velocityFromAngle(parentSprite.angle + 270, side);
            const position = { x: parentSprite.x + vector.x, y: parentSprite.y + vector.y };
            shell = new Shell_1.default(this._scene, position, "objects", this._texture, parentSprite, this._map);
            this.add(shell);
        }
        else {
            const vector = this._scene.physics.velocityFromAngle(parentSprite.angle + 270, side);
            const position = { x: parentSprite.x + vector.x - 5, y: parentSprite.y + vector.y - 5 };
            shell.body.x = position.x;
            shell.body.y = position.y;
            shell.setAlive(true);
        }
        shell.flyOut(this._direction);
        this._nextShoot = this._scene.time.now + this._pauseBetweenShoots;
    }
    setPauseBetweenShoots(experience) {
        switch (this._texture) {
            case utils_1.ENEMY.TANK.SHELL_TYPE:
                this._pauseBetweenShoots = 1200;
                break;
            case utils_1.ENEMY.BMP.SHELL_TYPE:
                this._pauseBetweenShoots = 600;
                break;
            case utils_1.ENEMY.BTR.SHELL_TYPE:
                this._pauseBetweenShoots = 300;
                break;
            case "bulletSand1":
                this._pauseBetweenShoots = 400 - experience;
                break;
            case "bulletRed2":
                this._pauseBetweenShoots = 800 - (experience * 2);
                break;
        }
    }
}
exports["default"] = GroupOfShells;


/***/ }),

/***/ "./src/classes/shells/Shell.ts":
/*!*************************************!*\
  !*** ./src/classes/shells/Shell.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const Player_1 = __importDefault(__webpack_require__(/*! ../vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
class Shell extends Phaser.GameObjects.Sprite {
    constructor(scene, position, atlasName, textureName, parentSprite, map) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = null;
        this._map = null;
        this._shellSpeed = 0;
        this._shellPower = 0;
        this.parentSprite = null;
        this._scene = scene;
        this.parentSprite = parentSprite;
        this._map = map;
        this.init(textureName);
        this._scene.events.on("update", this.update, this);
    }
    init(textureName) {
        this._scene.add.existing(this);
        this._scene.physics.add.existing(this);
        this.body.enable = true;
        switch (textureName) {
            case utils_1.ENEMY.BTR.SHELL_TYPE:
                this._shellSpeed = utils_1.SPEED.FASTER;
                this._shellPower = utils_1.ENEMY.BTR.SHELL_POWER;
                break;
            case utils_1.ENEMY.BMP.SHELL_TYPE:
                this._shellSpeed = utils_1.SPEED.FASTER;
                this._shellPower = utils_1.ENEMY.BMP.SHELL_POWER;
                break;
            case utils_1.ENEMY.TANK.SHELL_TYPE:
                this._shellSpeed = utils_1.SPEED.FASTER;
                this._shellPower = utils_1.ENEMY.TANK.SHELL_POWER;
                break;
            case utils_1.PLAYER.BMP.SHELL_TYPE:
                this._shellSpeed = utils_1.SPEED.FASTEST;
                this._shellPower = utils_1.PLAYER.BMP.SHELL_POWER;
                break;
            case utils_1.PLAYER.TANK.SHELL_TYPE:
                this._shellSpeed = utils_1.SPEED.FASTEST;
                this._shellPower = utils_1.PLAYER.TANK.SHELL_POWER;
                break;
        }
    }
    get damage() {
        return this._shellPower;
    }
    update() {
        if (this.active && (this.body.x < -20 ||
            this.body.x > this._map.tilemap.widthInPixels + 20 ||
            this.body.y < -20 ||
            this.body.y > this._map.tilemap.heightInPixels + 20))
            this.setAlive(false);
    }
    setAlive(status) {
        this.body.enable = status;
        this.setVisible(status);
        this.setActive(status);
    }
    flyOut(direction) {
        const vector = new Phaser.Math.Vector2();
        vector.setToPolar(this.parentSprite.rotation + (direction * Math.PI / 2));
        this.angle = this.parentSprite.angle;
        this.body.setVelocity(vector.x * this._shellSpeed, vector.y * this._shellSpeed);
        if (this.parentSprite instanceof Player_1.default)
            this.parentSprite.shootingSound.play();
    }
}
exports["default"] = Shell;


/***/ }),

/***/ "./src/classes/vehicles/Vehicle.ts":
/*!*****************************************!*\
  !*** ./src/classes/vehicles/Vehicle.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Vehicle extends Phaser.GameObjects.Sprite {
    constructor(scene, position, atlasName, textureName, map) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = null;
        this._map = null;
        this._scene = scene;
        this._map = map;
        this.init();
    }
    init() {
        this._scene.add.existing(this);
        this._scene.physics.add.existing(this);
        this.body.enable = true;
    }
    fire() { }
}
exports["default"] = Vehicle;


/***/ }),

/***/ "./src/classes/vehicles/enemies/EnemyVehicle.ts":
/*!******************************************************!*\
  !*** ./src/classes/vehicles/enemies/EnemyVehicle.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
const BangAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/BangAnimation */ "./src/classes/animation/BangAnimation.ts"));
const GroupOfShells_1 = __importDefault(__webpack_require__(/*! ../../shells/GroupOfShells */ "./src/classes/shells/GroupOfShells.ts"));
const SparkleAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/SparkleAnimation */ "./src/classes/animation/SparkleAnimation.ts"));
const Vehicle_1 = __importDefault(__webpack_require__(/*! ../Vehicle */ "./src/classes/vehicles/Vehicle.ts"));
const XpointsAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/XpointsAnimation */ "./src/classes/animation/XpointsAnimation.ts"));
class EnemyVehicle extends Vehicle_1.default {
    constructor(scene, position, atlasName, textureName, map, player1 = null, player2 = null, headquarterUa = null, headquarterRu = null) {
        super(scene, position, atlasName, textureName, map);
        this._vehicleSpeed = 0;
        this._type = "";
        this._armour = 0;
        this._timer = null;
        this._player1 = null;
        this._player2 = null;
        this._players = [];
        this._headquarterUa = null;
        this._headquarterRu = null;
        this._bases = [];
        this.direction = utils_1.DIRECTION.DOWN;
        const shellType = this.setEnemiesType(textureName);
        this._groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, this._map, shellType);
        this._timer = this._scene.time.addEvent({
            delay: 4000,
            loop: true,
            callback: this.changeDirection,
            callbackScope: this
        });
        this.initBases(map);
        this._player1 = player1;
        this._player2 = player2;
        if (player1)
            this._players.push(player1);
        if (player2)
            this._players.push(player2);
        this._headquarterUa = headquarterUa;
        this._headquarterRu = headquarterRu;
        this.direction = utils_1.DIRECTION.DOWN;
        this.handleCollisions();
    }
    setEnemiesType(textureName) {
        switch (textureName) {
            case "enemy_btr":
                this._type = utils_1.ENEMY.BTR.TYPE;
                this._vehicleSpeed = utils_1.ENEMY.BTR.SPEED;
                this._armour = utils_1.ENEMY.BTR.ARMOUR;
                return utils_1.ENEMY.BTR.SHELL_TYPE;
            case "enemy":
                this._type = utils_1.ENEMY.BMP.TYPE;
                this._vehicleSpeed = utils_1.ENEMY.BMP.SPEED;
                this._armour = utils_1.ENEMY.BMP.ARMOUR;
                return utils_1.ENEMY.BMP.SHELL_TYPE;
            case "enemy_tank":
                this._type = utils_1.ENEMY.TANK.TYPE;
                this._vehicleSpeed = utils_1.ENEMY.TANK.SPEED;
                this._armour = utils_1.ENEMY.TANK.ARMOUR;
                return utils_1.ENEMY.TANK.SHELL_TYPE;
        }
    }
    initBases(map) {
        for (let i = 1; i < 4; i++) {
            this._bases.push(map.getBasePosition(i));
        }
    }
    handleCollisions() {
        this._scene.physics.add.overlap(this._players, this._groupOfShells, this.shellsPlayerCollision, null, this);
        if (this._headquarterUa) {
            this._scene.physics.add.overlap(this._headquarterUa, this._groupOfShells, this.shellsHeadquarterCollision, null, this);
        }
        this._scene.physics.add.overlap(this._map.explosiveObjects, this._groupOfShells, this.shellsBoxesCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.shellsStoneCollision, null, this);
        const stopableArray = [...this._map.stones, ...this._map.explosiveObjects];
        if (this._headquarterRu)
            stopableArray.push(this._headquarterRu);
        this._scene.physics.add.collider(stopableArray, this, this.handleEnemiesCollision, null, this);
        this._scene.events.on("update", this.fire, this);
    }
    destroyEnemy(shell) {
        this._armour -= shell.damage;
        const id = shell.parentSprite.id;
        switch (this._type) {
            case utils_1.ENEMY.TANK.TYPE:
                if ((this._armour < 150) && (this._armour >= 80)) {
                    this.setTexture("objects", "enemy_tank1");
                }
                else if ((this._armour < 80) && (this._armour > 0)) {
                    this.setTexture("objects", "enemy_tank2");
                }
                else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this._timer.remove();
                    this.destroy();
                    const position = { x: shell.x, y: shell.y };
                    XpointsAnimation_1.default.generateAnimation(this._scene, position, 3);
                    this.calculateExperiencePoints(id, 1.1, utils_1.ENEMY.TANK.TYPE);
                    this._scene.events.emit("enemy_dead", true, false);
                }
                break;
            case utils_1.ENEMY.BMP.TYPE:
                if ((this._armour <= 35) && (this._armour > 0)) {
                    this.setTexture("objects", "enemy_bmp1");
                }
                else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this._timer.remove();
                    this.destroy();
                    const position = { x: shell.x, y: shell.y };
                    XpointsAnimation_1.default.generateAnimation(this._scene, position, 2);
                    this.calculateExperiencePoints(id, 0.7, utils_1.ENEMY.BMP.TYPE);
                    this._scene.events.emit("enemy_dead", true, false);
                }
                break;
            case utils_1.ENEMY.BTR.TYPE:
                if ((this._armour <= 26) && (this._armour > 0)) {
                    this.setTexture("objects", "enemy_btr1");
                }
                else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this._timer.remove();
                    this.destroy();
                    const position = { x: shell.x, y: shell.y };
                    XpointsAnimation_1.default.generateAnimation(this._scene, position, 1);
                    this.calculateExperiencePoints(id, 0.4, utils_1.ENEMY.BTR.TYPE);
                    this._scene.events.emit("enemy_dead", true, false);
                }
                break;
        }
    }
    get velocity() {
        return this.getMaxSpeed();
    }
    getMaxSpeed() {
        return this._vehicleSpeed * this._map.getTileFriction(this);
    }
    changeDirection() {
        var _a;
        const [x, y, angle] = this.getVehiclesDirection();
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.setVelocity(x, y);
        this.angle = angle;
    }
    getVehiclesDirection() {
        const direction = Math.floor(Math.random() * 5) + 1;
        switch (direction) {
            case 1:
                this.direction = utils_1.DIRECTION.DOWN;
                return [0, this.velocity, 0];
            case 2:
                this.direction = utils_1.DIRECTION.UP;
                return [0, -this.velocity, 180];
            case 3:
                this.direction = utils_1.DIRECTION.RIGHT;
                return [this.velocity, 0, -90];
            case 4:
                this.direction = utils_1.DIRECTION.LEFT;
                return [-this.velocity, 0, 90];
            case 5:
                this.direction = utils_1.DIRECTION.DOWN;
                return [0, this.velocity, 0];
            default:
                this.direction = utils_1.DIRECTION.DOWN;
                return [0, this.velocity, 0];
        }
    }
    moveOut() {
        var _a;
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.setVelocity(0, this.velocity * 1.5);
    }
    fire() {
        if (this._groupOfShells) {
            this._groupOfShells.createFire(this);
        }
        this._bases.forEach((base) => {
            var _a;
            if ((Phaser.Math.Distance.BetweenPoints(this, base) < 80) && this.body) {
                (_a = this.body) === null || _a === void 0 ? void 0 : _a.setVelocity(0, this.velocity * 1.5);
                this.angle = 0;
            }
        });
        this._players.forEach((player) => {
            if ((this._type !== utils_1.ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, player) < 350) && player.body && this.body) {
                this.body.stop();
                const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                this.rotation = angle - Math.PI / 2;
            }
            else if ((this._type === utils_1.ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, player) < 550) && player.body && this.body) {
                this.body.stop();
                const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                this.rotation = angle - Math.PI / 2;
            }
        });
        if (!this._headquarterUa)
            return;
        if ((this._type !== utils_1.ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._headquarterUa) < 350) && this._headquarterUa.body && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._headquarterUa.x, this._headquarterUa.y);
            this.rotation = angle - Math.PI / 2;
        }
        else if ((this._type === utils_1.ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._headquarterUa) < 550) && this._headquarterUa.body && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._headquarterUa.x, this._headquarterUa.y);
            this.rotation = angle - Math.PI / 2;
        }
    }
    shellsPlayerCollision(player, shell) {
        const position = { x: player.x, y: player.y };
        BangAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
        player.destroyPlayer(shell);
    }
    shellsHeadquarterCollision(headquarter, shell) {
        const position = { x: headquarter.x, y: headquarter.y };
        BangAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
        headquarter.body.destroy();
        headquarter.destroy();
        this._scene.events.emit("headquarterUa_destroyed");
    }
    shellsBoxesCollision(target, shell) {
        const position = { x: target.x, y: target.y };
        BangAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
        target.destroy();
    }
    shellsStoneCollision(target, shell) {
        const vector = this._scene.physics.velocityFromAngle(shell.angle + 270, -20);
        const position = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
    }
    handleEnemiesCollision(gameObject, enemy) {
        this.goToAnotherDirection();
    }
    calculateExperiencePoints(id, points, enemyType) {
        if (this._player1 && id === "P1") {
            this._player1.experience += points;
            this.calculateDestroyedEnemies(this._player1, enemyType);
        }
        else if (this._player2 && id === "P2") {
            this._player2.experience += points;
            this.calculateDestroyedEnemies(this._player2, enemyType);
        }
    }
    calculateDestroyedEnemies(player, enemyType) {
        switch (enemyType) {
            case utils_1.ENEMY.TANK.TYPE:
                player.tanksPerLevel++;
                break;
            case utils_1.ENEMY.BMP.TYPE:
                player.bmpPerLevel++;
                break;
            case utils_1.ENEMY.BTR.TYPE:
                player.btrPerLevel++;
                break;
        }
    }
    goToAnotherDirection() {
        switch (this.direction) {
            case utils_1.DIRECTION.DOWN:
                this.setCorrectDirection(1);
                break;
            case utils_1.DIRECTION.LEFT:
                this.setCorrectDirection(2);
                break;
            case utils_1.DIRECTION.UP:
                this.setCorrectDirection(3);
                break;
            case utils_1.DIRECTION.RIGHT:
                this.setCorrectDirection(4);
                break;
        }
    }
    setCorrectDirection(oldDirection) {
        var _a, _b, _c, _d;
        let newDirection = oldDirection;
        while (newDirection === oldDirection) {
            newDirection = Math.floor(Math.random() * 4) + 1;
        }
        switch (newDirection) {
            case 1:
                (_a = this.body) === null || _a === void 0 ? void 0 : _a.setVelocity(0, -this.velocity);
                this.angle = 180;
                break;
            case 2:
                (_b = this.body) === null || _b === void 0 ? void 0 : _b.setVelocity(this.velocity, 0);
                this.angle = -90;
                break;
            case 3:
                (_c = this.body) === null || _c === void 0 ? void 0 : _c.setVelocity(0, this.velocity);
                this.angle = 0;
                break;
            case 4:
                (_d = this.body) === null || _d === void 0 ? void 0 : _d.setVelocity(-this.velocity, 0);
                this.angle = 90;
                break;
        }
    }
}
exports["default"] = EnemyVehicle;


/***/ }),

/***/ "./src/classes/vehicles/enemies/GroupOfEnemies.ts":
/*!********************************************************!*\
  !*** ./src/classes/vehicles/enemies/GroupOfEnemies.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const EnemyVehicle_1 = __importDefault(__webpack_require__(/*! ./EnemyVehicle */ "./src/classes/vehicles/enemies/EnemyVehicle.ts"));
class GroupOfEnemies extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, map, enemies, maxEnemies, numberOfBase, player1 = null, player2 = null, headquarterUa = null, headquarterRu = null) {
        super(world, scene);
        this._scene = null;
        this._map = null;
        this._timer = null;
        this._enemies = [];
        this._player1 = null;
        this._player2 = null;
        this._headquarterUa = null;
        this._headquarterRu = null;
        this._numberOfBase = 0;
        this._maxEnemies = 0;
        this.counter = 0;
        this._scene = scene;
        this._map = map;
        this._enemies = enemies;
        this._maxEnemies = maxEnemies;
        this._player1 = player1;
        this._player2 = player2;
        this._headquarterUa = headquarterUa;
        this._headquarterRu = headquarterRu;
        this._numberOfBase = numberOfBase;
        this._timer = this._scene.time.addEvent({
            delay: 3000,
            loop: true,
            callback: this.addEnemy,
            callbackScope: this
        });
        this._scene.physics.add.collider(this, this, this.handleEnemyVehicleCollision, null, this);
    }
    addEnemy() {
        var _a;
        if (this.counter < this._maxEnemies) {
            this._enemies.length > 0 ? this.createEnemy() : (_a = this._timer) === null || _a === void 0 ? void 0 : _a.remove();
        }
    }
    createEnemy() {
        const baseNumber = Math.floor(Math.random() * this._numberOfBase) + 1;
        const position = this._map.getBasePosition(baseNumber);
        const enemiesTexture = this.getEnemyVehicleTexture(this._enemies.pop());
        const enemy = new EnemyVehicle_1.default(this._scene, position, "objects", enemiesTexture, this._map, this._player1, this._player2, this._headquarterUa, this._headquarterRu);
        this.add(enemy);
        enemy.moveOut();
        ++this.counter;
    }
    getEnemyVehicleTexture(index) {
        switch (index) {
            case 1:
                return "enemy_btr";
            case 2:
                return "enemy";
            case 3:
                return "enemy_tank";
        }
    }
    handleEnemyVehicleCollision(firstEnemy, secondEnemy) {
        firstEnemy.goToAnotherDirection();
        secondEnemy.goToAnotherDirection();
    }
}
exports["default"] = GroupOfEnemies;


/***/ }),

/***/ "./src/classes/vehicles/enemies/Radar.ts":
/*!***********************************************!*\
  !*** ./src/classes/vehicles/enemies/Radar.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
const XpointsAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/XpointsAnimation */ "./src/classes/animation/XpointsAnimation.ts"));
class Radar extends Phaser.GameObjects.Sprite {
    constructor(scene, position, atlasName, textureName, enemies, player1 = null, player2 = null) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = null;
        this._player1 = null;
        this._player2 = null;
        this._scene = scene;
        this._player1 = player1;
        this._player2 = player2;
        this.init();
        this.runRadar();
        const stopableArray = enemies.getChildren();
        this._scene.physics.add.collider(stopableArray, this, this.handleCollision, null, this);
    }
    init() {
        this._scene.add.existing(this);
        this._scene.physics.add.existing(this);
        this.body.enable = true;
        this.body.setImmovable(true);
    }
    runRadar() {
        this.play(utils_1.RADAR_ANIMATION);
    }
    destroyRadar(shell) {
        const id = shell.parentSprite.id;
        const position = { x: shell.x, y: shell.y };
        XpointsAnimation_1.default.generateAnimation(this._scene, position, 1);
        this.calculateExperiencePoints(id, 0.4);
        this._scene.events.emit("enemy_dead", true, false);
        this._scene = null;
        this.destroy();
    }
    calculateExperiencePoints(id, points) {
        if (this._player1 && id === "P1") {
            this._player1.experience += points;
            this._player1.radarPerLevel++;
        }
        else if (this._player2 && id === "P2") {
            this._player2.experience += points;
            this._player2.radarPerLevel++;
        }
    }
    handleCollision(enemy, radar) {
        enemy.goToAnotherDirection();
    }
}
exports["default"] = Radar;


/***/ }),

/***/ "./src/classes/vehicles/enemies/Turret.ts":
/*!************************************************!*\
  !*** ./src/classes/vehicles/enemies/Turret.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
const GroupOfShells_1 = __importDefault(__webpack_require__(/*! ../../shells/GroupOfShells */ "./src/classes/shells/GroupOfShells.ts"));
const BangAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/BangAnimation */ "./src/classes/animation/BangAnimation.ts"));
const SparkleAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/SparkleAnimation */ "./src/classes/animation/SparkleAnimation.ts"));
const XpointsAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/XpointsAnimation */ "./src/classes/animation/XpointsAnimation.ts"));
class Turret {
    constructor(scene, position, map, enemies, player1, player2 = null, radar = null, baseNumber = 1) {
        this._scene = null;
        this._map = null;
        this._armour = 0;
        this._player1 = null;
        this._player2 = null;
        this._players = [];
        this._groupOfShells = null;
        this._baseNumber = 1;
        this._radar = null;
        this.platform = null;
        this.turret = null;
        this.isFiring = true;
        this.id = 0;
        this._scene = scene;
        this._map = map;
        this._armour = utils_1.ENEMY.TURRET.ARMOUR;
        this._player1 = player1;
        this._player2 = player2;
        if (player1)
            this._players.push(player1);
        if (player2)
            this._players.push(player2);
        this._baseNumber = baseNumber;
        this._radar = radar;
        this.init(position, this._map, utils_1.ENEMY.TURRET.SHELL_TYPE);
        this._scene.physics.add.overlap(this._players, this._groupOfShells, this.shellsPlayerCollision, null, this);
        this._scene.physics.add.overlap(this._map.explosiveObjects, this._groupOfShells, this.boxesShellsCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.stonesShellsCollision, null, this);
        const stopableArray = enemies.getChildren();
        this._scene.physics.add.collider(stopableArray, this.platform, this.handleCollision, null, this);
        this.id = ++Turret.idCounter;
        this._scene.events.on("update", this.runTurret, this);
    }
    set radar(radar) {
        this._radar = radar;
    }
    init(position, map, shellTexture) {
        this.platform = new Phaser.GameObjects.Sprite(this._scene, position.x, position.y, "objects", "platform");
        this._scene.add.existing(this.platform);
        this._scene.physics.add.existing(this.platform);
        this.platform.body.enable = true;
        this.platform.body.setImmovable(true);
        this.turret = new Phaser.GameObjects.Sprite(this._scene, position.x, position.y, "objects", "turret");
        this._scene.add.existing(this.turret);
        this._scene.physics.add.existing(this.turret);
        this.turret.body.enable = true;
        this._groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, map, shellTexture);
    }
    shellsPlayerCollision(player, shell) {
        const position = { x: player.x, y: player.y };
        BangAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
        player.destroyPlayer(shell);
    }
    boxesShellsCollision(box, shell) {
        const position = { x: box.x, y: box.y };
        BangAnimation_1.default.generateBang(this._scene, position);
        box.destroy();
        shell.setAlive(false);
    }
    stonesShellsCollision(stone, shell) {
        const vector = this._scene.physics.velocityFromAngle(shell.angle + 270, +20);
        const position = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
    }
    handleCollision(enemy, platform) {
        enemy.goToAnotherDirection();
    }
    runTurret() {
        if (!this._radar) {
            this._players.forEach((player) => this.run(player, this._map.checkPlayersPositionNoRadar(player, this._baseNumber)));
        }
        else {
            this._players.forEach((player) => this.run(player, this._map.checkPlayersPosition(this._radar, player)));
        }
    }
    run(player, isPlayerNear) {
        isPlayerNear ? this.watchAndFire(player) : this.watch(player);
    }
    watch(player) {
        this.getCorrectAngle(player);
    }
    watchAndFire(player) {
        this.getCorrectAngle(player);
        this.fire();
    }
    getCorrectAngle(player) {
        if (this.turret && player) {
            const angle = Phaser.Math.Angle.Between(this.turret.x, this.turret.y, player.x, player.y);
            this.turret.rotation = angle - Math.PI / 2;
        }
    }
    fire() {
        if (this._groupOfShells && this.isFiring)
            this._groupOfShells.createFire(this.turret);
    }
    destroyTurret(shell) {
        this._armour -= shell.damage;
        if ((this._armour <= 130) && (this._armour > 60)) {
            this.turret.setTexture("objects", "turret_2");
        }
        else if ((this._armour <= 60) && (this._armour > 0)) {
            this.turret.setTexture("objects", "turret_1");
        }
        else if (this._armour <= 0) {
            this.turret.destroy();
            this.turret = null;
            this.platform.destroy();
            this.platform = null;
            this._groupOfShells = null;
            this._radar = null;
            const id = shell.parentSprite.id;
            const position = { x: shell.x, y: shell.y };
            XpointsAnimation_1.default.generateAnimation(this._scene, position, 3);
            this.calculateExperiencePoints(id, 1.1);
            this._scene.events.off("update", this.runTurret, this);
            this._scene.events.emit("enemy_dead", true, false);
        }
    }
    calculateExperiencePoints(id, points) {
        if (this._player1 && id === "P1") {
            this._player1.experience += points;
            this._player1.turretsPerLevel++;
        }
        else if (this._player2 && id === "P2") {
            this._player2.experience += points;
            this._player2.turretsPerLevel++;
        }
    }
}
exports["default"] = Turret;
Turret.idCounter = 0;


/***/ }),

/***/ "./src/classes/vehicles/player/Player.ts":
/*!***********************************************!*\
  !*** ./src/classes/vehicles/player/Player.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vehicle_1 = __importDefault(__webpack_require__(/*! ../Vehicle */ "./src/classes/vehicles/Vehicle.ts"));
const utils_1 = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
const GroupOfShells_1 = __importDefault(__webpack_require__(/*! ../../shells/GroupOfShells */ "./src/classes/shells/GroupOfShells.ts"));
const BangAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/BangAnimation */ "./src/classes/animation/BangAnimation.ts"));
const SparkleAnimation_1 = __importDefault(__webpack_require__(/*! ../../animation/SparkleAnimation */ "./src/classes/animation/SparkleAnimation.ts"));
const Headquarter_1 = __importDefault(__webpack_require__(/*! ../../Headquarter */ "./src/classes/Headquarter.ts"));
const Radar_1 = __importDefault(__webpack_require__(/*! ../enemies/Radar */ "./src/classes/vehicles/enemies/Radar.ts"));
class Player extends Vehicle_1.default {
    constructor(scene, position, atlasName, textureName, map, shellTexture, experience) {
        super(scene, position, atlasName, textureName, map);
        this._cursor = null;
        this._player2 = null;
        this._fire = null;
        this._armour = 0;
        this._vehicleType = "";
        this._enemyVehicles = null;
        this._enemyTurrets = [];
        this._enemyTurretPlatforms = [];
        this._enemiesStatic = [];
        this._radar = null;
        this._headquarterUa = null;
        this._headquarterRu = null;
        this.shootingSound = null;
        this.groupOfShells = null;
        this.id = "P1";
        this.experience = 0;
        this.tanksPerLevel = 0;
        this.bmpPerLevel = 0;
        this.btrPerLevel = 0;
        this.turretsPerLevel = 0;
        this.radarPerLevel = 0;
        this._velocity = 0;
        this._cursor = this._scene.input.keyboard.createCursorKeys();
        this._fire = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO);
        this.experience = experience;
        this.groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, this._map, shellTexture, false, experience);
        this.setVehicleType(textureName);
    }
    setVehicleType(textureName) {
        switch (textureName) {
            case "player_tank":
                this._vehicleType = "player_tank";
                this._armour = utils_1.PLAYER.TANK.ARMOUR;
                this.shootingSound = this._scene.sound.add('playerTankShooting', { volume: 0.5 });
                break;
            case "player_ifv":
                this._vehicleType = "player_ifv";
                this._armour = utils_1.PLAYER.BMP.ARMOUR;
                this.shootingSound = this._scene.sound.add('playerIfvShooting', { volume: 0.3 });
                break;
        }
    }
    set enemyVehicles(enemyVehicles) {
        this._enemyVehicles = enemyVehicles;
    }
    set enemyTurrets(enemyTurrets) {
        this._enemyTurrets = enemyTurrets;
    }
    set enemyTurretPlatforms(enemyTurretPlatforms) {
        this._enemyTurretPlatforms = enemyTurretPlatforms;
    }
    set enemiesStatic(enemiesStatic) {
        this._enemiesStatic = enemiesStatic;
    }
    set player2(player2) {
        this._player2 = player2;
    }
    set radar(radar) {
        this._radar = radar;
    }
    set headquarterUa(headquarterUa) {
        this._headquarterUa = headquarterUa;
    }
    set headquarterRu(headquarterRu) {
        this._headquarterRu = headquarterRu;
    }
    handleCollisions() {
        this._scene.physics.add.overlap(this._map.explosiveObjects, this.groupOfShells, this.boxesShellsCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this.groupOfShells, this.stonesShellsCollision, null, this);
        const stopableArray = [...this._map.stones, ...this._map.explosiveObjects];
        if (this._player2)
            stopableArray.push(this._player2);
        if (this._radar)
            stopableArray.push(this._radar);
        if (this._headquarterUa)
            stopableArray.push(this._headquarterUa);
        if (this._headquarterRu)
            stopableArray.push(this._headquarterRu);
        this._scene.physics.add.collider(stopableArray, this, this.handlePlayerStop, null, this);
        this._scene.physics.add.overlap(this._enemyVehicles, this.groupOfShells, this.handlePlayerShootOnEnemyVehicle, null, this);
        this._scene.physics.add.overlap(this._enemyTurretPlatforms, this.groupOfShells, this.handlePlayerShootOnEnemiesTurrets, null, this);
        this._scene.physics.add.overlap(this._enemiesStatic, this.groupOfShells, this.handlePlayerShootOnEnemiesStatic, null, this);
    }
    boxesShellsCollision(box, shell) {
        const position = { x: box.x, y: box.y };
        BangAnimation_1.default.generateBang(this._scene, position);
        box.destroy();
        shell.setAlive(false);
    }
    stonesShellsCollision(stone, shell) {
        const vector = this._scene.physics.velocityFromAngle(shell.angle + 270, +20);
        const position = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
    }
    handlePlayerStop(gameObject, player) {
        gameObject.body.stop();
        player.body.stop();
    }
    handlePlayerShootOnEnemyVehicle(enemy, shell) {
        const position = { x: enemy.x, y: enemy.y };
        BangAnimation_1.default.generateBang(this._scene, position);
        enemy.destroyEnemy(shell);
        shell.setAlive(false);
    }
    handlePlayerShootOnEnemiesTurrets(turretsPlatform, shell) {
        let position = null;
        this._enemyTurrets.forEach((item) => {
            if (turretsPlatform === item.platform) {
                position = { x: item.turret.x, y: item.turret.y };
                item.destroyTurret(shell);
                BangAnimation_1.default.generateBang(this._scene, position);
                shell.setAlive(false);
            }
        });
    }
    handlePlayerShootOnEnemiesStatic(enemy, shell) {
        let position = null;
        position = { x: enemy.x, y: enemy.y };
        if (enemy instanceof Radar_1.default) {
            enemy.destroyRadar(shell);
        }
        else if (enemy instanceof Headquarter_1.default) {
            enemy.destroyHeadquarter();
            this._headquarterRu = null;
        }
        BangAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
    }
    get direction() {
        let direction = utils_1.PLAYER_SPEED.NONE;
        if (this._cursor.up.isDown)
            direction = (this._vehicleType === "player_tank") ? utils_1.PLAYER.TANK.SPEED : utils_1.PLAYER.BMP.SPEED;
        else if (this._cursor.down.isDown)
            direction = (this._vehicleType === "player_tank") ? -utils_1.PLAYER.TANK.SPEED : -utils_1.PLAYER.BMP.SPEED;
        return direction;
    }
    get velocity() {
        const vehicleSpeed = Math.abs(this._velocity);
        const maxSpeed = this.getMaxSpeed();
        if (this.direction && vehicleSpeed < maxSpeed) {
            this._velocity += this.direction;
        }
        else if ((this.direction && vehicleSpeed > maxSpeed) || (!this.direction && vehicleSpeed > 0)) {
            this._velocity -= this._velocity;
        }
        return this._velocity;
    }
    get turn() {
        let turn = utils_1.TURNS.NONE;
        if (this._cursor.right.isDown)
            turn = utils_1.TURNS.RIGHT;
        else if (this._cursor.left.isDown)
            turn = utils_1.TURNS.LEFT;
        return turn;
    }
    getMaxSpeed() {
        return utils_1.SPEED.BASIC * this._map.getTileFriction(this);
    }
    getAngle() {
        return this.angle + this.turn;
    }
    getVelocityFromAngle() {
        const vector2 = new Phaser.Math.Vector2();
        return vector2.setToPolar(this.rotation - Math.PI / 2, this.velocity);
    }
    fire() {
        if (this.groupOfShells) {
            this.groupOfShells.createFire(this);
        }
    }
    move() {
        var _a;
        this.setAngle(this.getAngle());
        const velocity = this.getVelocityFromAngle();
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.setVelocity(velocity.x, velocity.y);
        if (this._fire.isDown && this)
            this.fire();
    }
    setAlive(status) {
        this.body.enable = status;
        this.setVisible(status);
        this.setActive(status);
    }
    destroyPlayer(shell) {
        this._armour -= shell.damage;
        if (this._vehicleType === "player_tank") {
            if ((this._armour < 100) && (this._armour >= 50)) {
                this.setTexture("objects", "player_tank1");
            }
            else if ((this._armour < 50) && (this._armour > 0)) {
                this.setTexture("objects", "player_tank2");
            }
            else if (this._armour <= 0) {
                this._scene.events.emit("first_player_dead");
                this.destroy();
            }
        }
        else if (this._vehicleType === "player_ifv") {
            if ((this._armour < 77) && (this._armour >= 40)) {
                this.setTexture("objects", "player_ifv1");
            }
            else if ((this._armour < 40) && (this._armour > 0)) {
                this.setTexture("objects", "player_ifv2");
            }
            else if (this._armour <= 0) {
                this._scene.events.emit("first_player_dead");
                this.destroy();
            }
        }
    }
}
exports["default"] = Player;


/***/ }),

/***/ "./src/classes/vehicles/player/Player2.ts":
/*!************************************************!*\
  !*** ./src/classes/vehicles/player/Player2.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
const Player_1 = __importDefault(__webpack_require__(/*! ./Player */ "./src/classes/vehicles/player/Player.ts"));
class Player2 extends Player_1.default {
    constructor(scene, position, atlasName, textureName, map, shellTexture, experience) {
        super(scene, position, atlasName, textureName, map, shellTexture, experience);
        this._controls = null;
        this._player1 = null;
        this.id = "P2";
        this._controls = this._scene.input.keyboard.addKeys({ "up": Phaser.Input.Keyboard.KeyCodes.W, "down": Phaser.Input.Keyboard.KeyCodes.S, "left": Phaser.Input.Keyboard.KeyCodes.A, "right": Phaser.Input.Keyboard.KeyCodes.D });
        this._fire = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    set player1(player1) {
        this._player1 = player1;
    }
    handleCollisions() {
        this._scene.physics.add.overlap(this._map.explosiveObjects, this.groupOfShells, this.boxesShellsCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this.groupOfShells, this.stonesShellsCollision, null, this);
        const stopableArray = [...this._map.stones, ...this._map.explosiveObjects];
        if (this._player1)
            stopableArray.push(this._player1);
        if (this._radar)
            stopableArray.push(this._radar);
        if (this._headquarterUa)
            stopableArray.push(this._headquarterUa);
        if (this._headquarterRu)
            stopableArray.push(this._headquarterRu);
        this._scene.physics.add.collider(stopableArray, this, this.handlePlayerStop, null, this);
        this._scene.physics.add.overlap(this._enemyVehicles, this.groupOfShells, this.handlePlayerShootOnEnemyVehicle, null, this);
        this._scene.physics.add.overlap(this._enemyTurretPlatforms, this.groupOfShells, this.handlePlayerShootOnEnemiesTurrets, null, this);
        this._scene.physics.add.overlap(this._enemiesStatic, this.groupOfShells, this.handlePlayerShootOnEnemiesStatic, null, this);
    }
    get direction() {
        let direction = utils_1.PLAYER_SPEED.NONE;
        if (this._controls.up.isDown)
            direction = (this._vehicleType === "player_tank") ? utils_1.PLAYER.TANK.SPEED : utils_1.PLAYER.BMP.SPEED;
        else if (this._controls.down.isDown)
            direction = (this._vehicleType === "player_tank") ? -utils_1.PLAYER.TANK.SPEED : -utils_1.PLAYER.BMP.SPEED;
        return direction;
    }
    get turn() {
        let turn = utils_1.TURNS.NONE;
        if (this._controls.right.isDown)
            turn = utils_1.TURNS.RIGHT;
        else if (this._controls.left.isDown)
            turn = utils_1.TURNS.LEFT;
        return turn;
    }
    destroyPlayer(shell) {
        this._armour -= shell.damage;
        if (this._vehicleType === "player_tank") {
            if ((this._armour < 100) && (this._armour >= 50)) {
                this.setTexture("objects", "player_tank1");
            }
            else if ((this._armour < 50) && (this._armour > 0)) {
                this.setTexture("objects", "player_tank2");
            }
            else if (this._armour <= 0) {
                this._scene.events.emit("second_player_dead");
                this.destroy();
            }
        }
        else if (this._vehicleType === "player_ifv") {
            if ((this._armour < 77) && (this._armour >= 40)) {
                this.setTexture("objects", "player_ifv1");
            }
            else if ((this._armour < 40) && (this._armour > 0)) {
                this.setTexture("objects", "player_ifv2");
            }
            else if (this._armour <= 0) {
                this._scene.events.emit("second_player_dead");
                this.destroy();
            }
        }
    }
}
exports["default"] = Player2;


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
const StartScene_1 = __importDefault(__webpack_require__(/*! ./scenes/StartScene */ "./src/scenes/StartScene.ts"));
const Level_1_1 = __importDefault(__webpack_require__(/*! ./scenes/levels/Level_1 */ "./src/scenes/levels/Level_1.ts"));
const PostStartScene_1 = __importDefault(__webpack_require__(/*! ./scenes/PostStartScene */ "./src/scenes/PostStartScene.ts"));
const HelpScene_1 = __importDefault(__webpack_require__(/*! ./scenes/HelpScene */ "./src/scenes/HelpScene.ts"));
const PrelevelScene_1 = __importDefault(__webpack_require__(/*! ./scenes/PrelevelScene */ "./src/scenes/PrelevelScene.ts"));
const PostlevelScene_1 = __importDefault(__webpack_require__(/*! ./scenes/PostlevelScene */ "./src/scenes/PostlevelScene.ts"));
const GameOverScene_1 = __importDefault(__webpack_require__(/*! ./scenes/GameOverScene */ "./src/scenes/GameOverScene.ts"));
const Level_2_1 = __importDefault(__webpack_require__(/*! ./scenes/levels/Level_2 */ "./src/scenes/levels/Level_2.ts"));
const Level_5_1 = __importDefault(__webpack_require__(/*! ./scenes/levels/Level_5 */ "./src/scenes/levels/Level_5.ts"));
const Level_3_1 = __importDefault(__webpack_require__(/*! ./scenes/levels/Level_3 */ "./src/scenes/levels/Level_3.ts"));
const Level_4_1 = __importDefault(__webpack_require__(/*! ./scenes/levels/Level_4 */ "./src/scenes/levels/Level_4.ts"));
const Level_6_1 = __importDefault(__webpack_require__(/*! ./scenes/levels/Level_6 */ "./src/scenes/levels/Level_6.ts"));
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [
        new BootScene_1.default(),
        new PreloadScene_1.default(),
        new StartScene_1.default(),
        new HelpScene_1.default(),
        new PostStartScene_1.default(),
        new PrelevelScene_1.default(),
        new PostlevelScene_1.default(),
        new Level_1_1.default(),
        new Level_2_1.default(),
        new Level_5_1.default(),
        new Level_3_1.default(),
        new Level_4_1.default(),
        new Level_6_1.default(),
        new GameOverScene_1.default()
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: { debug: false }
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
        this.load.image("logo", "assets/images/logo.png");
    }
    create() {
        this.scene.start("preload-scene");
    }
}
exports["default"] = BootScene;


/***/ }),

/***/ "./src/scenes/GameOverScene.ts":
/*!*************************************!*\
  !*** ./src/scenes/GameOverScene.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class GameOverScene extends Phaser.Scene {
    constructor() { super({ key: "gameover-scene" }); }
    create() {
        console.log("Game over scene");
    }
}
exports["default"] = GameOverScene;


/***/ }),

/***/ "./src/scenes/HelpScene.ts":
/*!*********************************!*\
  !*** ./src/scenes/HelpScene.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class HelpScene extends Phaser.Scene {
    constructor() {
        super({ key: "help-scene" });
    }
}
exports["default"] = HelpScene;


/***/ }),

/***/ "./src/scenes/PostStartScene.ts":
/*!**************************************!*\
  !*** ./src/scenes/PostStartScene.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class PostStartScene extends Phaser.Scene {
    constructor() {
        super({ key: "post-start-scene" });
        this._data = null;
        this._style = null;
        this._tank1Rect = null;
        this._ifv1Rect = null;
        this._tank2Rect = null;
        this._ifv2Rect = null;
        this._buttonClick = null;
    }
    preload() { this._buttonClick = this.sound.add("click"); }
    create(data) {
        this.init();
        data.onePlayer ? this.onePlayerMenu() : this.twoPlayerMenu();
    }
    init() {
        this._data = {
            nextLevelNumber: "level-1",
            nextLevelName: "Training Camp",
            multiplayerGame: false,
            firstPlayer: {
                vehicle: "tank",
                shellType: "bulletRed2",
                experience: 0,
                tanksPerLevel: 0,
                bmpPerLevel: 0,
                btrPerLevel: 0,
                turretsPerLevel: 0,
                radarPerLevel: 0
            },
            secondPlayer: {
                vehicle: "tank",
                shellType: "bulletRed2",
                experience: 0,
                tanksPerLevel: 0,
                bmpPerLevel: 0,
                btrPerLevel: 0,
                turretsPerLevel: 0,
                radarPerLevel: 0
            }
        };
        this._style = { fontFamily: "RussoOne", fontSize: "55px", color: "#FFFFFF" };
        this._tank1Rect = (0, utils_1.createRectangleFrame)(this, window.innerWidth / 2 + 90, window.innerHeight / 2 - 200);
        this._ifv1Rect = (0, utils_1.createRectangleFrame)(this, window.innerWidth / 2 + 190, window.innerHeight / 2 - 200);
        this._tank2Rect = (0, utils_1.createRectangleFrame)(this, window.innerWidth / 2 + 90, window.innerHeight / 2 - 50);
        this._ifv2Rect = (0, utils_1.createRectangleFrame)(this, window.innerWidth / 2 + 190, window.innerHeight / 2 - 50);
    }
    onePlayerMenu() {
        this._data.secondPlayer = null;
        this.add.graphics()
            .fillStyle(0xE7590D)
            .fillRoundedRect(window.innerWidth / 2 - 200, window.innerHeight / 2 - 125, 400, 250, 16);
        const style = { fontFamily: "RussoOne", fontSize: "40px", color: "#FFFFFF" };
        (0, utils_1.createText)(this, window.innerWidth / 2 - 155, window.innerHeight / 2 - 100, "Choose vehicle", style);
        this.add.sprite(window.innerWidth / 2 - 80, window.innerHeight / 2, "objects", "player_tank");
        this.add.sprite(window.innerWidth / 2 + 70, window.innerHeight / 2, "objects", "player_ifv");
        const tank = (0, utils_1.createText)(this, window.innerWidth / 2 - 125, window.innerHeight / 2 + 50, "tank", style);
        tank.setInteractive({ useHandCursor: true });
        tank.once("pointerdown", () => {
            this._buttonClick.play();
            this.scene.start("prelevel-scene", { data: this._data });
        });
        const ifv = (0, utils_1.createText)(this, window.innerWidth / 2 + 40, window.innerHeight / 2 + 50, "IFV", style);
        ifv.setInteractive({ useHandCursor: true });
        ifv.once("pointerdown", () => {
            this._buttonClick.play();
            this._data.firstPlayer.vehicle = "ifv";
            this._data.firstPlayer.shellType = "bulletSand1";
            this.scene.start("prelevel-scene", { data: this._data });
        });
    }
    twoPlayerMenu() {
        this._data.multiplayerGame = true;
        (0, utils_1.createText)(this, window.innerWidth / 2 - 300, 50, "Choose your vehicles", this._style);
        (0, utils_1.createText)(this, window.innerWidth / 2 - 250, window.innerHeight / 2 - 170, "1st player", this._style);
        const tank1 = this.add.sprite(window.innerWidth / 2 + 130, window.innerHeight / 2 - 150, "objects", "player_tank");
        tank1.setInteractive({ useHandCursor: true });
        tank1.on("pointerdown", () => {
            this._buttonClick.play();
            if (!this._tank1Rect.visible) {
                this._data.firstPlayer.vehicle = "tank";
                this._data.firstPlayer.shellType = "bulletRed2";
                this._tank1Rect.visible = true;
                this._ifv1Rect.visible = false;
            }
        });
        const ifv1 = this.add.sprite(window.innerWidth / 2 + 230, window.innerHeight / 2 - 150, "objects", "player_ifv");
        ifv1.setInteractive({ useHandCursor: true });
        ifv1.on("pointerdown", () => {
            this._buttonClick.play();
            if (!this._ifv1Rect.visible) {
                this._data.firstPlayer.vehicle = "ifv";
                this._data.firstPlayer.shellType = "bulletSand1";
                this._ifv1Rect.visible = true;
                this._tank1Rect.visible = false;
            }
        });
        (0, utils_1.createText)(this, window.innerWidth / 2 - 250, window.innerHeight / 2 - 20, "2nd player", this._style);
        const tank2 = this.add.sprite(window.innerWidth / 2 + 130, window.innerHeight / 2, "objects", "player_tank");
        tank2.setInteractive({ useHandCursor: true });
        tank2.on("pointerdown", () => {
            this._buttonClick.play();
            if (!this._tank2Rect.visible) {
                this._data.secondPlayer.vehicle = "tank";
                this._data.secondPlayer.shellType = "bulletRed2";
                this._tank2Rect.visible = true;
                this._ifv2Rect.visible = false;
            }
        });
        const ifv2 = this.add.sprite(window.innerWidth / 2 + 230, window.innerHeight / 2, "objects", "player_ifv");
        ifv2.setInteractive({ useHandCursor: true });
        ifv2.on("pointerdown", () => {
            this._buttonClick.play();
            if (!this._ifv2Rect.visible) {
                this._data.secondPlayer.vehicle = "ifv";
                this._data.secondPlayer.shellType = "bulletSand1";
                this._ifv2Rect.visible = true;
                this._tank2Rect.visible = false;
            }
        });
        this.add.graphics()
            .fillStyle(0xE7590D)
            .fillRoundedRect(window.innerWidth / 2 - 100, window.innerHeight - 175, 200, 100, 16);
        const startButtonText = (0, utils_1.createText)(this, window.innerWidth / 2 - 69, window.innerHeight - 155, "Start", this._style);
        startButtonText.setInteractive({ useHandCursor: true });
        startButtonText.once("pointerdown", () => {
            this._buttonClick.play();
            this.scene.start("prelevel-scene", { data: this._data });
        });
    }
}
exports["default"] = PostStartScene;


/***/ }),

/***/ "./src/scenes/PostlevelScene.ts":
/*!**************************************!*\
  !*** ./src/scenes/PostlevelScene.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class PostlevelScene extends Phaser.Scene {
    constructor() {
        super({ key: "postlevel-scene" });
        this._data = null;
        this._startTimer = null;
        this._endTimer = null;
        this._1PlayerBtrTween = null;
        this._1PlayerBtrText = null;
        this._1PlayerBmpTween = null;
        this._1PlayerBmpText = null;
        this._1PlayerTankTween = null;
        this._1PlayerTankText = null;
        this._1PlayerTurretsTween = null;
        this._1PlayerTurretsText = null;
        this._1PlayerRadarTween = null;
        this._1PlayerRadarText = null;
        this._1PlayerTotalTween = null;
        this._1PlayerTotalText = null;
        this._1PlayerTotal = 0;
        this._2PlayerBtrTween = null;
        this._2PlayerBtrText = null;
        this._2PlayerBmpTween = null;
        this._2PlayerBmpText = null;
        this._2PlayerTankTween = null;
        this._2PlayerTankText = null;
        this._2PlayerTurretsTween = null;
        this._2PlayerTurretsText = null;
        this._2PlayerRadarTween = null;
        this._2PlayerRadarText = null;
        this._2PlayerTotalTween = null;
        this._2PlayerTotalText = null;
        this._2PlayerTotal = 0;
        this._header = null;
        this._mainStyle = null;
        this._secondaryStyle = null;
        this._melody = null;
        this._coinSound = null;
        this._width = null;
    }
    preload() {
        this._header = { fontFamily: "RussoOne", fontSize: "70px", color: "#00FF00" };
        this._mainStyle = { fontFamily: "RussoOne", fontSize: "65px", color: "#00FF00" };
        this._secondaryStyle = { fontFamily: "RussoOne", fontSize: "50px", color: "#00FF00" };
        this._melody = this.sound.add("mainMelody", { volume: 0.4, loop: true });
        this._coinSound = this.sound.add("coinSound", { volume: 1, loop: true });
        this._width = this.sys.game.canvas.width;
    }
    create({ data }) {
        this._data = data;
        this._startTimer = this.time.addEvent({
            delay: 800,
            loop: false,
            callback: this.startCountPoints,
            callbackScope: this
        });
        const levelNumberText = (0, utils_1.createText)(this, 0, 150, "Level complete!", this._header);
        levelNumberText.setX(this.sys.game.canvas.width / 2 - levelNumberText.width / 2);
        if (this._data.firstPlayer)
            this.firstPlayerResults();
        if (this._data.secondPlayer)
            this.secondPlayerResults();
        this._melody.play();
    }
    startCountPoints() {
        if (this._data.firstPlayer)
            this._1PlayerBtrTween.resume();
        if (this._data.secondPlayer)
            this._2PlayerBtrTween.resume();
        this._startTimer.remove();
        this._coinSound.play();
    }
    firstPlayerResults() {
        this._1PlayerTotal = this._data.firstPlayer.btrPerLevel * 1 + this._data.firstPlayer.bmpPerLevel * 2 + this._data.firstPlayer.tanksPerLevel * 3 + this._data.firstPlayer.turretsPerLevel * 3 + this._data.firstPlayer.radarPerLevel * 1;
        const header = (0, utils_1.createText)(this, 250, 250, "1st player", this._mainStyle);
        this._1PlayerBtrText = (0, utils_1.createText)(this, 250, 330, `BTRs: ${this._data.firstPlayer.btrPerLevel} × 1xp = 0xp`, this._secondaryStyle);
        this._1PlayerBmpText = (0, utils_1.createText)(this, 250, 410, `BMPs: ${this._data.firstPlayer.bmpPerLevel} × 2xp = 0xp`, this._secondaryStyle);
        this._1PlayerTankText = (0, utils_1.createText)(this, 250, 490, `Tanks: ${this._data.firstPlayer.tanksPerLevel} × 3xp = 0xp`, this._secondaryStyle);
        this._1PlayerTurretsText = (0, utils_1.createText)(this, 250, 570, `Turrets: ${this._data.firstPlayer.turretsPerLevel} × 3xp = 0xp`, this._secondaryStyle);
        this._1PlayerRadarText = (0, utils_1.createText)(this, 250, 650, `Radars: ${this._data.firstPlayer.radarPerLevel} × 1xp = 0xp`, this._secondaryStyle);
        const dash = (0, utils_1.createText)(this, 250, 670, "_____________________", this._secondaryStyle);
        this._1PlayerTotalText = (0, utils_1.createText)(this, 250, 740, `Total: 0xp`, this._secondaryStyle);
        header.setX(this._1PlayerTankText.width / 3);
        this._1PlayerBtrText.setX(this._1PlayerTankText.width / 3);
        this._1PlayerBmpText.setX(this._1PlayerTankText.width / 3);
        this._1PlayerTankText.setX(this._1PlayerTankText.width / 3);
        this._1PlayerTurretsText.setX(this._1PlayerTankText.width / 3);
        this._1PlayerRadarText.setX(this._1PlayerTankText.width / 3);
        dash.setX(this._1PlayerTankText.width / 3);
        this._1PlayerTotalText.setX(this._1PlayerTankText.width / 3);
        this._1PlayerBtrTween = this.tweens.addCounter({
            from: 0,
            to: this._data.firstPlayer.btrPerLevel * 1,
            duration: 1000,
            paused: true,
            onComplete: () => this._1PlayerBmpTween.resume()
        });
        this._1PlayerBmpTween = this.tweens.addCounter({
            from: 0,
            to: this._data.firstPlayer.bmpPerLevel * 2,
            duration: 1000,
            paused: true,
            onComplete: () => this._1PlayerTankTween.resume()
        });
        this._1PlayerTankTween = this.tweens.addCounter({
            from: 0,
            to: this._data.firstPlayer.tanksPerLevel * 3,
            duration: 1000,
            paused: true,
            onComplete: () => this._1PlayerTurretsTween.resume()
        });
        this._1PlayerTurretsTween = this.tweens.addCounter({
            from: 0,
            to: this._data.firstPlayer.turretsPerLevel * 3,
            duration: 1000,
            paused: true,
            onComplete: () => this._1PlayerRadarTween.resume()
        });
        this._1PlayerRadarTween = this.tweens.addCounter({
            from: 0,
            to: this._data.firstPlayer.radarPerLevel * 1,
            duration: 1000,
            paused: true,
            onComplete: () => this._1PlayerTotalTween.resume()
        });
        this._1PlayerTotalTween = this.tweens.addCounter({
            from: 0,
            to: this._1PlayerTotal,
            duration: 1500,
            paused: true,
            onComplete: () => this.pauseBeforeCloseScene()
        });
    }
    secondPlayerResults() {
        this._2PlayerTotal = this._data.secondPlayer.btrPerLevel * 1 + this._data.secondPlayer.bmpPerLevel * 2 + this._data.secondPlayer.tanksPerLevel * 3 + this._data.secondPlayer.turretsPerLevel * 3 + this._data.secondPlayer.radarPerLevel * 1;
        const header = (0, utils_1.createText)(this, this._width - 750, 250, "2nd player", this._mainStyle);
        this._2PlayerBtrText = (0, utils_1.createText)(this, this._width - 750, 330, `BTRs: ${this._data.secondPlayer.btrPerLevel} × 1xp = 0xp`, this._secondaryStyle);
        this._2PlayerBmpText = (0, utils_1.createText)(this, this._width - 750, 410, `BMPs: ${this._data.secondPlayer.bmpPerLevel} × 2xp = 0xp`, this._secondaryStyle);
        this._2PlayerTankText = (0, utils_1.createText)(this, this._width - 750, 490, `Tanks: ${this._data.secondPlayer.tanksPerLevel} × 3xp = 0xp`, this._secondaryStyle);
        this._2PlayerTurretsText = (0, utils_1.createText)(this, this._width - 750, 570, `Turrets: ${this._data.secondPlayer.turretsPerLevel} × 3xp = 0xp`, this._secondaryStyle);
        this._2PlayerRadarText = (0, utils_1.createText)(this, this._width - 750, 650, `Radars: ${this._data.secondPlayer.radarPerLevel} × 1xp = 0xp`, this._secondaryStyle);
        const dash = (0, utils_1.createText)(this, this._width - 750, 670, "_____________________", this._secondaryStyle);
        this._2PlayerTotalText = (0, utils_1.createText)(this, this._width - 750, 740, `Total: 0xp`, this._secondaryStyle);
        header.setX(this._width - this._2PlayerTurretsText.width - this._2PlayerTurretsText.width / 3);
        this._2PlayerBtrText.setX(this._width - this._2PlayerTurretsText.width - this._2PlayerTurretsText.width / 3);
        this._2PlayerBmpText.setX(this._width - this._2PlayerTurretsText.width - this._2PlayerTurretsText.width / 3);
        this._2PlayerTankText.setX(this._width - this._2PlayerTurretsText.width - this._2PlayerTurretsText.width / 3);
        this._2PlayerTurretsText.setX(this._width - this._2PlayerTurretsText.width - this._2PlayerTurretsText.width / 3);
        this._2PlayerRadarText.setX(this._width - this._2PlayerTurretsText.width - this._2PlayerTurretsText.width / 3);
        dash.setX(this._width - this._2PlayerTurretsText.width - this._2PlayerTurretsText.width / 3);
        this._2PlayerTotalText.setX(this._width - this._2PlayerTurretsText.width - this._2PlayerTurretsText.width / 3);
        this._2PlayerBtrTween = this.tweens.addCounter({
            from: 0,
            to: this._data.secondPlayer.btrPerLevel * 1,
            duration: 1000,
            paused: true,
            onComplete: () => this._2PlayerBmpTween.resume()
        });
        this._2PlayerBmpTween = this.tweens.addCounter({
            from: 0,
            to: this._data.secondPlayer.bmpPerLevel * 2,
            duration: 1000,
            paused: true,
            onComplete: () => this._2PlayerTankTween.resume()
        });
        this._2PlayerTankTween = this.tweens.addCounter({
            from: 0,
            to: this._data.secondPlayer.tanksPerLevel * 3,
            duration: 1000,
            paused: true,
            onComplete: () => this._2PlayerTurretsTween.resume()
        });
        this._2PlayerTurretsTween = this.tweens.addCounter({
            from: 0,
            to: this._data.secondPlayer.turretsPerLevel * 3,
            duration: 1000,
            paused: true,
            onComplete: () => this._2PlayerRadarTween.resume()
        });
        this._2PlayerRadarTween = this.tweens.addCounter({
            from: 0,
            to: this._data.secondPlayer.radarPerLevel * 1,
            duration: 1000,
            paused: true,
            onComplete: () => this._2PlayerTotalTween.resume()
        });
        this._2PlayerTotalTween = this.tweens.addCounter({
            from: 0,
            to: this._2PlayerTotal,
            duration: 1500,
            paused: true,
            onComplete: this._data.firstPlayer ? () => { } : () => this.pauseBeforeCloseScene()
        });
    }
    pauseBeforeCloseScene() {
        this._coinSound.stop();
        this._endTimer = this.time.delayedCall(2000, this.startNextLevel, null, this);
    }
    startNextLevel() {
        this._endTimer.remove();
        this._melody.stop();
        this.scene.start("prelevel-scene", { data: this._data });
    }
    update() {
        if (this._data.firstPlayer) {
            this._1PlayerBtrText.setText(`BTRs: ${this._data.firstPlayer.btrPerLevel} × 1xp = ${this._1PlayerBtrTween.getValue().toFixed(0)}xp`);
            this._1PlayerBmpText.setText(`BMPs: ${this._data.firstPlayer.bmpPerLevel} × 2xp = ${this._1PlayerBmpTween.getValue().toFixed(0)}xp`);
            this._1PlayerTankText.setText(`Tanks: ${this._data.firstPlayer.tanksPerLevel} × 3xp = ${this._1PlayerTankTween.getValue().toFixed(0)}xp`);
            this._1PlayerTurretsText.setText(`Turrets: ${this._data.firstPlayer.turretsPerLevel} × 3xp = ${this._1PlayerTurretsTween.getValue().toFixed(0)}xp`);
            this._1PlayerRadarText.setText(`Radars: ${this._data.firstPlayer.radarPerLevel} × 1xp = ${this._1PlayerRadarTween.getValue().toFixed(0)}xp`);
            this._1PlayerTotalText.setText(`Total: ${this._1PlayerTotalTween.getValue().toFixed(0)}xp`);
        }
        if (this._data.secondPlayer) {
            this._2PlayerBtrText.setText(`BTRs: ${this._data.secondPlayer.btrPerLevel} × 1xp = ${this._2PlayerBtrTween.getValue().toFixed(0)}xp`);
            this._2PlayerBmpText.setText(`BMPs: ${this._data.secondPlayer.bmpPerLevel} × 2xp = ${this._2PlayerBmpTween.getValue().toFixed(0)}xp`);
            this._2PlayerTankText.setText(`Tanks: ${this._data.secondPlayer.tanksPerLevel} × 3xp = ${this._2PlayerTankTween.getValue().toFixed(0)}xp`);
            this._2PlayerTurretsText.setText(`Turrets: ${this._data.secondPlayer.turretsPerLevel} × 3xp = ${this._2PlayerTurretsTween.getValue().toFixed(0)}xp`);
            this._2PlayerRadarText.setText(`Radars: ${this._data.secondPlayer.radarPerLevel} × 1xp = ${this._2PlayerRadarTween.getValue().toFixed(0)}xp`);
            this._2PlayerTotalText.setText(`Total: ${this._2PlayerTotalTween.getValue().toFixed(0)}xp`);
        }
    }
}
exports["default"] = PostlevelScene;


/***/ }),

/***/ "./src/scenes/PrelevelScene.ts":
/*!*************************************!*\
  !*** ./src/scenes/PrelevelScene.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class PrelevelScene extends Phaser.Scene {
    constructor() {
        super({ key: "prelevel-scene" });
        this._data = null;
        this._timer1 = null;
        this._timer2 = null;
        this._levelNumberStyle = null;
        this._levelNameStyle = null;
        this._melody = null;
    }
    preload() {
        this._levelNumberStyle = { fontFamily: "RussoOne", fontSize: "60px", color: "#E62B0D" };
        this._levelNameStyle = { fontFamily: "RussoOne", fontSize: "80px", color: "#E62B0D" };
        this._melody = this.sound.add('prelevelMelody');
    }
    create({ data }) {
        this._data = data;
        let levelNumber = this._data.nextLevelNumber;
        levelNumber = levelNumber.replace("-", " ");
        const levelNumberText = (0, utils_1.createText)(this, 0, 300, levelNumber, this._levelNumberStyle);
        levelNumberText.setX(this.sys.game.canvas.width / 2 - levelNumberText.width / 2);
        let levelName = this._data.nextLevelName;
        const levelNameText = (0, utils_1.createText)(this, 0, 400, levelName, this._levelNameStyle);
        levelNameText.setX(this.sys.game.canvas.width / 2 - levelNameText.width / 2);
        this._timer1 = this.time.addEvent({
            delay: 400,
            loop: false,
            callback: this.playMelody,
            callbackScope: this
        });
        this._timer2 = this.time.addEvent({
            delay: 4200,
            loop: false,
            callback: this.startNextLevel,
            callbackScope: this
        });
    }
    playMelody() {
        this._melody.play();
        this._timer1.remove();
    }
    startNextLevel() {
        this._timer2.remove();
        this._melody.stop();
        this.scene.start(this._data.nextLevelNumber, { data: this._data });
    }
}
exports["default"] = PrelevelScene;


/***/ }),

/***/ "./src/scenes/PreloadScene.ts":
/*!************************************!*\
  !*** ./src/scenes/PreloadScene.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const LoadingBar_1 = __webpack_require__(/*! ../utils/LoadingBar */ "./src/utils/LoadingBar.ts");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class PreloadScene extends Phaser.Scene {
    constructor() { super({ key: "preload-scene" }); }
    preload() {
        const sprite = this.add.sprite(0, 0, "logo").setOrigin(0);
        sprite.setX(window.innerWidth / 2 - sprite.width / 2);
        sprite.setY(window.innerHeight / 2 - sprite.height / 2);
        new LoadingBar_1.LoadingBar(this);
        this.load.spritesheet("tileset", "assets/images/tilemap.png", { frameWidth: 64, frameHeight: 64, margin: 0, spacing: 0 });
        this.load.tilemapTiledJSON("tilemap", "assets/images/tilemap.json");
        this.load.atlas("objects", "assets/images/objects.png", "assets/images/objects.json");
        this.load.audio("prelevelMelody", "assets/sounds/prelevelMelody.mp3");
        this.load.audio("mainMelody", "assets/sounds/mainMelody.mp3");
        this.load.audio("fightMelody", "assets/sounds/fightMelody.mp3");
        this.load.audio("playerIfvShooting", "assets/sounds/playerIfvShooting.mp3");
        this.load.audio("playerTankShooting", "assets/sounds/playerTankShooting.mp3");
        this.load.audio("simpleExplosion", "assets/sounds/simpleExplosion.mp3");
        this.load.audio("click", "assets/sounds/click.mp3");
        this.load.audio("coinSound", "assets/sounds/coinSound.mp3");
    }
    create() {
        this.scene.start("start-scene");
        this.loadAnimation();
    }
    loadAnimation() {
        const bangFrames = this.anims.generateFrameNames("objects", {
            prefix: "explosion",
            start: 1,
            end: 5
        });
        this.anims.create({
            key: utils_1.BANG_ANIMATION,
            frames: bangFrames,
            frameRate: 5,
            duration: 800,
            repeat: 0,
        });
        const frames = this.anims.generateFrameNames("objects", {
            prefix: "platform",
            start: 1,
            end: 8
        });
        this.anims.create({
            key: utils_1.RADAR_ANIMATION,
            frames: frames,
            frameRate: 7,
            duration: 1000,
            repeat: -1,
        });
        const sparkleFrame = this.anims.generateFrameNames("objects", {
            prefix: "sparkle",
            start: 1,
            end: 1
        });
        this.anims.create({
            key: utils_1.SPARKLE_ANIMATION,
            frames: sparkleFrame,
            frameRate: 7,
            duration: 350,
            repeat: 0,
        });
        const xpoints1Frame = this.anims.generateFrameNames("objects", {
            suffix: "xp",
            start: 1,
            end: 1
        });
        this.anims.create({
            key: utils_1.XPOINTS_1_ANIMATION,
            frames: xpoints1Frame,
            frameRate: 1,
            duration: 2000,
            repeat: 0,
        });
        const xpoints2Frame = this.anims.generateFrameNames("objects", {
            suffix: "xp",
            start: 2,
            end: 2
        });
        this.anims.create({
            key: utils_1.XPOINTS_2_ANIMATION,
            frames: xpoints2Frame,
            frameRate: 1,
            duration: 2000,
            repeat: 0,
        });
        const xpoints3Frame = this.anims.generateFrameNames("objects", {
            suffix: "xp",
            start: 3,
            end: 3
        });
        this.anims.create({
            key: utils_1.XPOINTS_3_ANIMATION,
            frames: xpoints3Frame,
            frameRate: 1,
            duration: 2000,
            repeat: 0,
        });
    }
}
exports["default"] = PreloadScene;


/***/ }),

/***/ "./src/scenes/StartScene.ts":
/*!**********************************!*\
  !*** ./src/scenes/StartScene.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: "start-scene" });
        this._mainMelody = null;
        this._buttonClick = null;
        this._style = { fontFamily: "RussoOne", fontSize: "55px", color: "#FFFFFF" };
    }
    preload() {
        const sprite = this.add.sprite(0, 0, "logo").setOrigin(0);
        sprite.setX(window.innerWidth / 2 - sprite.width / 2);
        sprite.setY(window.innerHeight / 2 - sprite.height / 2 - 200);
        this._mainMelody = this.sound.add("mainMelody", { volume: 0.4, loop: true });
        this._buttonClick = this.sound.add("click");
    }
    create() {
        this._onePlayerTextButton = (0, utils_1.createTextButton)(this, 50, "1 player", this._style);
        this._onePlayerTextButton.once("pointerdown", () => {
            this._mainMelody.stop();
            this._buttonClick.play();
            this.scene.start("post-start-scene", { onePlayer: true });
        });
        this._twoPlayersTextButton = (0, utils_1.createTextButton)(this, 130, "2 players", this._style, this._onePlayerTextButton.width);
        this._twoPlayersTextButton.once("pointerdown", () => {
            this._mainMelody.stop();
            this._buttonClick.play();
            this.scene.start("post-start-scene", { onePlayer: false });
        });
        this._help = (0, utils_1.createTextButton)(this, 210, "Help", this._style, this._onePlayerTextButton.width);
        this._help.on("pointerdown", () => {
            this._mainMelody.stop();
            this._buttonClick.play();
            this.scene.start("help-scene");
        });
        this._mainMelody.play();
    }
}
exports["default"] = StartScene;


/***/ }),

/***/ "./src/scenes/levels/Level.ts":
/*!************************************!*\
  !*** ./src/scenes/levels/Level.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
class Level extends Phaser.Scene {
    constructor(levelName) {
        super({ key: levelName });
        this._map = null;
        this._levelData = null;
        this._player1 = null;
        this._player2 = null;
        this._players = [];
        this._enemies = null;
        this._enemiesText = null;
        this._finishText = null;
        this._enemiesArray = null;
        this._enemiesLeft = 0;
        this._maxEnemies = 5;
        this._style = null;
        this._fightingMelody = null;
    }
    preload() {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this._style = { fontFamily: "RussoOne", fontSize: "40px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 };
        this._fightingMelody = this.sound.add("fightMelody", { volume: 0.1, loop: true });
    }
    createFinishText() {
        this._finishText = (0, utils_1.createText)(this, this.sys.game.canvas.width, this.sys.game.canvas.height + 150, "GAME OVER", { fontFamily: "RussoOne", fontSize: "90px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 });
        this._finishText.setX(this.sys.game.canvas.width / 2 - this._finishText.width / 2);
        this._finishText.depth = 10;
    }
    listenEvents() { }
    enemyDead(toCount, isHeadquarterRuDestroyed) { }
    headquarterDestroyed() { }
    firstPlayerDead() {
        this._levelData.firstPlayer = null;
        this._player1 = null;
        if (this._levelData.multiplayerGame && this._player2)
            return;
        else {
            this.events.removeListener("first_player_dead");
            this.events.removeListener("second_player_dead");
            this.events.removeListener("enemy_dead");
            this.runTween();
        }
    }
    secondPlayerDead() {
        this._levelData.secondPlayer = null;
        this._player2 = null;
        if (this._levelData.multiplayerGame && !this._player1) {
            this.events.removeListener("first_player_dead");
            this.events.removeListener("second_player_dead");
            this.events.removeListener("enemy_dead");
            this.runTween();
        }
    }
    runTween() {
        this.tweens.add({
            targets: this._finishText,
            y: this.sys.game.canvas.height / 2 - 70,
            duration: 3000,
            onComplete: () => {
                this._fightingMelody.stop();
                this.tweens.killAll();
                this.scene.start("start-scene");
            }
        });
    }
    update() {
        this._players.forEach((player) => {
            if (player && player.active)
                player.move();
        });
        this.checkMapBounds([...this._enemies.getChildren(), ...this._players]);
    }
    checkMapBounds(vehicles) {
        if (vehicles && vehicles.length > 0) {
            for (let i = 0; i < vehicles.length; i++) {
                if (!vehicles[i].body)
                    continue;
                if (vehicles[i].body.y > this._map.tilemap.heightInPixels - 30) {
                    vehicles[i].body.y = this._map.tilemap.heightInPixels - 30 - 20;
                }
                if (vehicles[i].body.y < 0) {
                    vehicles[i].body.y = 20;
                }
                if (vehicles[i].body.x < 0) {
                    vehicles[i].body.x = 20;
                }
                if (vehicles[i].body.x > this._map.tilemap.widthInPixels - 30) {
                    vehicles[i].body.x = this._map.tilemap.widthInPixels - 30 - 20;
                }
            }
        }
    }
}
exports["default"] = Level;


/***/ }),

/***/ "./src/scenes/levels/Level_1.ts":
/*!**************************************!*\
  !*** ./src/scenes/levels/Level_1.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Map_1 = __importDefault(__webpack_require__(/*! ../../classes/Map */ "./src/classes/Map.ts"));
const Player_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/GroupOfEnemies */ "./src/classes/vehicles/enemies/GroupOfEnemies.ts"));
const Player2_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player2 */ "./src/classes/vehicles/player/Player2.ts"));
const Level_2 = __importDefault(__webpack_require__(/*! ./Level */ "./src/scenes/levels/Level.ts"));
class Level_1 extends Level_2.default {
    constructor() { super("level-1"); }
    create({ data }) {
        this._map = new Map_1.default(this, 1);
        this._levelData = data;
        this._enemiesArray = [3, 1, 2, 3, 1, 2, 3, 2, 1, 2, 1];
        const player = this._map.getPlayer(1);
        let position = { x: player.x, y: player.y };
        this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
        this._players.push(this._player1);
        (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
        if (this._levelData.secondPlayer) {
            const player2 = this._map.getPlayer(2);
            position = { x: player2.x, y: player2.y };
            this._player2 = new Player2_1.default(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
            this._players.push(this._player2);
            this._player2.player1 = this._player1;
            this._player1.player2 = this._player2;
            this._enemiesArray.forEach((item, _, array) => array.push(item));
            this._maxEnemies = 8;
            (0, utils_1.showPlayerExperience)(this, this._style, false, this._levelData.secondPlayer.experience);
        }
        this._enemiesLeft = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2);
        this._enemiesText = (0, utils_1.createLevelText)(this, 15, 30, `Enemies: ${this._enemiesLeft}`, this._style);
        this._player1.enemyVehicles = this._enemies;
        this._player1.handleCollisions();
        if (this._levelData.secondPlayer) {
            this._player2.enemyVehicles = this._enemies;
            this._player2.handleCollisions();
        }
        this.listenEvents();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this.cameras.main.startFollow(this._player1);
        this._fightingMelody.play();
        this.createFinishText();
    }
    listenEvents() {
        if (this.events.listeners("first_player_dead").length <= 0) {
            this.events.on("first_player_dead", this.firstPlayerDead, this);
        }
        if (this.events.listeners("second_player_dead").length <= 0) {
            this.events.on("second_player_dead", this.secondPlayerDead, this);
        }
        if (this.events.listeners("enemy_dead").length <= 0) {
            this.events.on("enemy_dead", this.enemyDead, this);
        }
    }
    enemyDead(toCount) {
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesLeft;
            this._enemiesText.setText(`Enemies: ${this._enemiesLeft}`);
        }
        if (this._enemiesLeft <= 0) {
            this._levelData.nextLevelNumber = "level-2";
            this._levelData.nextLevelName = "First Blood";
            if (this._player1 && this._levelData.firstPlayer) {
                this._levelData.firstPlayer.experience = this._player1.experience;
                this._levelData.firstPlayer.tanksPerLevel = this._player1.tanksPerLevel;
                this._levelData.firstPlayer.bmpPerLevel = this._player1.bmpPerLevel;
                this._levelData.firstPlayer.btrPerLevel = this._player1.btrPerLevel;
                this._levelData.firstPlayer.turretsPerLevel = this._player1.turretsPerLevel;
                this._levelData.firstPlayer.radarPerLevel = this._player1.radarPerLevel;
            }
            if (this._player2 && this._levelData.secondPlayer) {
                this._levelData.secondPlayer.experience = this._player2.experience;
                this._levelData.secondPlayer.tanksPerLevel = this._player2.tanksPerLevel;
                this._levelData.secondPlayer.bmpPerLevel = this._player2.bmpPerLevel;
                this._levelData.secondPlayer.btrPerLevel = this._player2.btrPerLevel;
                this._levelData.secondPlayer.turretsPerLevel = this._player2.turretsPerLevel;
                this._levelData.secondPlayer.radarPerLevel = this._player2.radarPerLevel;
            }
            this._fightingMelody.stop();
            this.scene.start("postlevel-scene", { data: this._levelData });
        }
    }
}
exports["default"] = Level_1;


/***/ }),

/***/ "./src/scenes/levels/Level_2.ts":
/*!**************************************!*\
  !*** ./src/scenes/levels/Level_2.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Map_1 = __importDefault(__webpack_require__(/*! ../../classes/Map */ "./src/classes/Map.ts"));
const Player_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/GroupOfEnemies */ "./src/classes/vehicles/enemies/GroupOfEnemies.ts"));
const Player2_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player2 */ "./src/classes/vehicles/player/Player2.ts"));
const Turret_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/Turret */ "./src/classes/vehicles/enemies/Turret.ts"));
const Level_1 = __importDefault(__webpack_require__(/*! ./Level */ "./src/scenes/levels/Level.ts"));
class Level_2 extends Level_1.default {
    constructor() {
        super("level-2");
        this._turret1 = null;
        this._turret2 = null;
    }
    create({ data }) {
        this._map = new Map_1.default(this, 2);
        this._levelData = data;
        this._enemiesArray = [3, 1, 2, 3, 1, 3, 2, 1, 2, 1, 3, 2, 1];
        let position = null;
        if (this._levelData.multiplayerGame) {
            this._maxEnemies = 8;
            this._enemiesArray.forEach((item, _, array) => array.push(item));
            if (this._levelData.firstPlayer) {
                const player = this._map.getPlayer(1);
                position = { x: player.x, y: player.y };
                this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
            }
            if (this._levelData.secondPlayer) {
                const player2 = this._map.getPlayer(2);
                position = { x: player2.x, y: player2.y };
                this._player2 = new Player2_1.default(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, false, this._levelData.secondPlayer.experience);
            }
        }
        else {
            const player = this._map.getPlayer(1);
            let position = { x: player.x, y: player.y };
            this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
            (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
        }
        this._enemiesLeft = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2);
        let turretPosition = this._map.getTurretPosition(1);
        this._turret1 = new Turret_1.default(this, turretPosition, this._map, this._enemies, this._player1, this._player2, null, 1);
        this._enemiesLeft++;
        turretPosition = this._map.getTurretPosition(2);
        this._turret2 = new Turret_1.default(this, turretPosition, this._map, this._enemies, this._player1, this._player2, null, 2);
        this._enemiesLeft++;
        this._enemiesText = (0, utils_1.createLevelText)(this, 15, 30, `Enemies: ${this._enemiesLeft}`, this._style);
        if (this._player1) {
            this._players.push(this._player1);
            this._player1.enemyVehicles = this._enemies;
            this._player1.enemyTurrets = [this._turret1, this._turret2];
            this._player1.enemyTurretPlatforms = [this._turret1.platform, this._turret2.platform];
            if (this._player2)
                this._player1.player2 = this._player2;
            this._player1.handleCollisions();
        }
        if (this._player2) {
            this._players.push(this._player2);
            this._player2.enemyVehicles = this._enemies;
            this._player2.enemyTurrets = [this._turret1, this._turret2];
            this._player2.enemyTurretPlatforms = [this._turret1.platform, this._turret2.platform];
            if (this._player1)
                this._player2.player1 = this._player1;
            this._player2.handleCollisions();
        }
        this.listenEvents();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this._player1 ? this.cameras.main.startFollow(this._player1) : this.cameras.main.startFollow(this._player2);
        this._fightingMelody.play();
        this.createFinishText();
    }
    listenEvents() {
        if (this.events.listeners("first_player_dead").length <= 0) {
            this.events.on("first_player_dead", this.firstPlayerDead, this);
        }
        if (this.events.listeners("second_player_dead").length <= 0) {
            this.events.on("second_player_dead", this.secondPlayerDead, this);
        }
        if (this.events.listeners("enemy_dead").length <= 0) {
            this.events.on("enemy_dead", this.enemyDead, this);
        }
    }
    enemyDead(toCount) {
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesLeft;
            this._enemiesText.setText(`Enemies: ${this._enemiesLeft}`);
        }
        if (this._enemiesLeft <= 0) {
            this._levelData.nextLevelNumber = "level-3";
            this._levelData.nextLevelName = "Sneaky Forest";
            if (this._player1 && this._levelData.firstPlayer) {
                this._levelData.firstPlayer.experience = this._player1.experience;
                this._levelData.firstPlayer.tanksPerLevel = this._player1.tanksPerLevel;
                this._levelData.firstPlayer.bmpPerLevel = this._player1.bmpPerLevel;
                this._levelData.firstPlayer.btrPerLevel = this._player1.btrPerLevel;
                this._levelData.firstPlayer.turretsPerLevel = this._player1.turretsPerLevel;
                this._levelData.firstPlayer.radarPerLevel = this._player1.radarPerLevel;
            }
            if (this._player2 && this._levelData.secondPlayer) {
                this._levelData.secondPlayer.experience = this._player2.experience;
                this._levelData.secondPlayer.tanksPerLevel = this._player2.tanksPerLevel;
                this._levelData.secondPlayer.bmpPerLevel = this._player2.bmpPerLevel;
                this._levelData.secondPlayer.btrPerLevel = this._player2.btrPerLevel;
                this._levelData.secondPlayer.turretsPerLevel = this._player2.turretsPerLevel;
                this._levelData.secondPlayer.radarPerLevel = this._player2.radarPerLevel;
            }
            this._fightingMelody.stop();
            this.scene.start("postlevel-scene", { data: this._levelData });
        }
    }
}
exports["default"] = Level_2;


/***/ }),

/***/ "./src/scenes/levels/Level_3.ts":
/*!**************************************!*\
  !*** ./src/scenes/levels/Level_3.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Level_1 = __importDefault(__webpack_require__(/*! ./Level */ "./src/scenes/levels/Level.ts"));
const Map_1 = __importDefault(__webpack_require__(/*! ../../classes/Map */ "./src/classes/Map.ts"));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const Player_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
const Player2_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player2 */ "./src/classes/vehicles/player/Player2.ts"));
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/GroupOfEnemies */ "./src/classes/vehicles/enemies/GroupOfEnemies.ts"));
const Headquarter_1 = __importDefault(__webpack_require__(/*! ../../classes/Headquarter */ "./src/classes/Headquarter.ts"));
class Level_3 extends Level_1.default {
    constructor() {
        super("level-3");
        this._headquarterUa = null;
    }
    create({ data }) {
        this._map = new Map_1.default(this, 4);
        this._levelData = data;
        this._enemiesArray = [3, 1, 3, 1, 3, 2, 3, 1, 3, 2, 1, 1];
        let position = null;
        if (this._levelData.multiplayerGame) {
            this._maxEnemies = 8;
            this._enemiesArray.forEach((item, _, array) => array.push(item));
            if (this._levelData.firstPlayer) {
                const player = this._map.getPlayer(1);
                position = { x: player.x, y: player.y };
                this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
            }
            if (this._levelData.secondPlayer) {
                const player2 = this._map.getPlayer(2);
                position = { x: player2.x, y: player2.y };
                this._player2 = new Player2_1.default(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, false, this._levelData.secondPlayer.experience);
            }
        }
        else {
            const player = this._map.getPlayer(1);
            let position = { x: player.x, y: player.y };
            this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
            (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
        }
        this._headquarterUa = new Headquarter_1.default(this, this._map.getHeadquarterPosition(false), "objects", "headquarterUa");
        this._enemiesLeft = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2, this._headquarterUa);
        this._enemiesText = (0, utils_1.createLevelText)(this, 15, 30, `Enemies: ${this._enemiesLeft}`, this._style);
        if (this._player1) {
            this._players.push(this._player1);
            this._player1.enemyVehicles = this._enemies;
            this._player1.headquarterUa = this._headquarterUa;
            this._player1.enemiesStatic = [this._headquarterUa];
            if (this._player2)
                this._player1.player2 = this._player2;
            this._player1.handleCollisions();
        }
        if (this._player2) {
            this._players.push(this._player2);
            this._player2.enemyVehicles = this._enemies;
            this._player2.headquarterUa = this._headquarterUa;
            this._player2.enemiesStatic = [this._headquarterUa];
            if (this._player1)
                this._player2.player1 = this._player1;
            this._player2.handleCollisions();
        }
        this.listenEvents();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this._player1 ? this.cameras.main.startFollow(this._player1) : this.cameras.main.startFollow(this._player2);
        this._fightingMelody.play();
        this.createFinishText();
    }
    listenEvents() {
        if (this.events.listeners("first_player_dead").length <= 0) {
            this.events.on("first_player_dead", this.firstPlayerDead, this);
        }
        if (this.events.listeners("second_player_dead").length <= 0) {
            this.events.on("second_player_dead", this.secondPlayerDead, this);
        }
        if (this.events.listeners("enemy_dead").length <= 0) {
            this.events.on("enemy_dead", this.enemyDead, this);
        }
        if (this.events.listeners("headquarterUa_destroyed").length <= 0) {
            this.events.on("headquarterUa_destroyed", this.headquarterDestroyed, this);
        }
    }
    enemyDead(toCount) {
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesLeft;
            this._enemiesText.setText(`Enemies: ${this._enemiesLeft}`);
        }
        if (this._enemiesLeft <= 0) {
            this._levelData.nextLevelNumber = "level-4";
            this._levelData.nextLevelName = "Horde";
            if (this._player1 && this._levelData.firstPlayer) {
                this._levelData.firstPlayer.experience = this._player1.experience;
                this._levelData.firstPlayer.tanksPerLevel = this._player1.tanksPerLevel;
                this._levelData.firstPlayer.bmpPerLevel = this._player1.bmpPerLevel;
                this._levelData.firstPlayer.btrPerLevel = this._player1.btrPerLevel;
                this._levelData.firstPlayer.turretsPerLevel = this._player1.turretsPerLevel;
                this._levelData.firstPlayer.radarPerLevel = this._player1.radarPerLevel;
            }
            if (this._player2 && this._levelData.secondPlayer) {
                this._levelData.secondPlayer.experience = this._player2.experience;
                this._levelData.secondPlayer.tanksPerLevel = this._player2.tanksPerLevel;
                this._levelData.secondPlayer.bmpPerLevel = this._player2.bmpPerLevel;
                this._levelData.secondPlayer.btrPerLevel = this._player2.btrPerLevel;
                this._levelData.secondPlayer.turretsPerLevel = this._player2.turretsPerLevel;
                this._levelData.secondPlayer.radarPerLevel = this._player2.radarPerLevel;
            }
            this._fightingMelody.stop();
            this.scene.start("postlevel-scene", { data: this._levelData });
        }
    }
    headquarterDestroyed() {
        this._headquarterUa = null;
        if (!this._headquarterUa)
            this.runTween();
    }
}
exports["default"] = Level_3;


/***/ }),

/***/ "./src/scenes/levels/Level_4.ts":
/*!**************************************!*\
  !*** ./src/scenes/levels/Level_4.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Level_1 = __importDefault(__webpack_require__(/*! ./Level */ "./src/scenes/levels/Level.ts"));
const Map_1 = __importDefault(__webpack_require__(/*! ../../classes/Map */ "./src/classes/Map.ts"));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const Player_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
const Player2_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player2 */ "./src/classes/vehicles/player/Player2.ts"));
const Headquarter_1 = __importDefault(__webpack_require__(/*! ../../classes/Headquarter */ "./src/classes/Headquarter.ts"));
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/GroupOfEnemies */ "./src/classes/vehicles/enemies/GroupOfEnemies.ts"));
class Level_4 extends Level_1.default {
    constructor() {
        super("level-4");
        this._headquarterRu = null;
        this._isHeadquarterRuDestroyed = false;
    }
    create({ data }) {
        this._map = new Map_1.default(this, 5);
        this._levelData = data;
        this._enemiesArray = [3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];
        let position = null;
        if (this._levelData.multiplayerGame) {
            this._maxEnemies = 8;
            this._enemiesArray.forEach((item, _, array) => array.push(item));
            if (this._levelData.firstPlayer) {
                const player = this._map.getPlayer(1);
                position = { x: player.x, y: player.y };
                this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
            }
            if (this._levelData.secondPlayer) {
                const player2 = this._map.getPlayer(2);
                position = { x: player2.x, y: player2.y };
                this._player2 = new Player2_1.default(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, false, this._levelData.secondPlayer.experience);
            }
        }
        else {
            const player = this._map.getPlayer(1);
            let position = { x: player.x, y: player.y };
            this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
            (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
        }
        this._headquarterRu = new Headquarter_1.default(this, this._map.getHeadquarterPosition(true), "objects", "headquarterRu");
        this._enemiesLeft = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2, null, this._headquarterRu);
        this._enemiesText = (0, utils_1.createLevelText)(this, 15, 30, `Enemies: ${this._enemiesLeft}`, this._style);
        if (this._player1) {
            this._players.push(this._player1);
            this._player1.enemyVehicles = this._enemies;
            this._player1.headquarterRu = this._headquarterRu;
            this._player1.enemiesStatic = [this._headquarterRu];
            if (this._player2)
                this._player1.player2 = this._player2;
            this._player1.handleCollisions();
        }
        if (this._player2) {
            this._players.push(this._player2);
            this._player2.enemyVehicles = this._enemies;
            this._player2.headquarterRu = this._headquarterRu;
            this._player2.enemiesStatic = [this._headquarterRu];
            if (this._player1)
                this._player2.player1 = this._player1;
            this._player2.handleCollisions();
        }
        this.listenEvents();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this._player1 ? this.cameras.main.startFollow(this._player1) : this.cameras.main.startFollow(this._player2);
        this._fightingMelody.play();
        this.createFinishText();
    }
    listenEvents() {
        if (this.events.listeners("first_player_dead").length <= 0) {
            this.events.on("first_player_dead", this.firstPlayerDead, this);
        }
        if (this.events.listeners("second_player_dead").length <= 0) {
            this.events.on("second_player_dead", this.secondPlayerDead, this);
        }
        if (this.events.listeners("enemy_dead").length <= 0) {
            this.events.on("enemy_dead", this.enemyDead, this);
        }
        if (this.events.listeners("enemy_headquarter_destroyed").length <= 0) {
            this.events.on("enemy_headquarter_destroyed", this.enemyDead, this);
        }
    }
    enemyDead(toCount, isHeadquarterRuDestroyed) {
        if (isHeadquarterRuDestroyed)
            this._isHeadquarterRuDestroyed = isHeadquarterRuDestroyed;
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesLeft;
            this._enemiesText.setText(`Enemies: ${this._enemiesLeft}`);
        }
        if (this._enemiesLeft <= 0 && this._isHeadquarterRuDestroyed) {
            this._levelData.nextLevelNumber = "level-5";
            this._levelData.nextLevelName = "Protect and Destroy";
            if (this._player1 && this._levelData.firstPlayer) {
                this._levelData.firstPlayer.experience = this._player1.experience;
                this._levelData.firstPlayer.tanksPerLevel = this._player1.tanksPerLevel;
                this._levelData.firstPlayer.bmpPerLevel = this._player1.bmpPerLevel;
                this._levelData.firstPlayer.btrPerLevel = this._player1.btrPerLevel;
                this._levelData.firstPlayer.turretsPerLevel = this._player1.turretsPerLevel;
                this._levelData.firstPlayer.radarPerLevel = this._player1.radarPerLevel;
            }
            if (this._player2 && this._levelData.secondPlayer) {
                this._levelData.secondPlayer.experience = this._player2.experience;
                this._levelData.secondPlayer.tanksPerLevel = this._player2.tanksPerLevel;
                this._levelData.secondPlayer.bmpPerLevel = this._player2.bmpPerLevel;
                this._levelData.secondPlayer.btrPerLevel = this._player2.btrPerLevel;
                this._levelData.secondPlayer.turretsPerLevel = this._player2.turretsPerLevel;
                this._levelData.secondPlayer.radarPerLevel = this._player2.radarPerLevel;
            }
            this._fightingMelody.stop();
            this.scene.start("postlevel-scene", { data: this._levelData });
        }
    }
}
exports["default"] = Level_4;


/***/ }),

/***/ "./src/scenes/levels/Level_5.ts":
/*!**************************************!*\
  !*** ./src/scenes/levels/Level_5.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Headquarter_1 = __importDefault(__webpack_require__(/*! ../../classes/Headquarter */ "./src/classes/Headquarter.ts"));
const Map_1 = __importDefault(__webpack_require__(/*! ../../classes/Map */ "./src/classes/Map.ts"));
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/GroupOfEnemies */ "./src/classes/vehicles/enemies/GroupOfEnemies.ts"));
const Radar_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/Radar */ "./src/classes/vehicles/enemies/Radar.ts"));
const Turret_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/Turret */ "./src/classes/vehicles/enemies/Turret.ts"));
const Player_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
const Player2_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player2 */ "./src/classes/vehicles/player/Player2.ts"));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const Level_1 = __importDefault(__webpack_require__(/*! ./Level */ "./src/scenes/levels/Level.ts"));
class Level_5 extends Level_1.default {
    constructor() {
        super("level-5");
        this._turret = null;
        this._radar = null;
        this._headquarterRu = null;
        this._headquarterUa = null;
        this._isHeadquarterRuDestroyed = false;
    }
    create({ data }) {
        this._map = new Map_1.default(this, 3);
        this._levelData = data;
        this._enemiesArray = [3, 1, 2, 3, 1, 3, 2, 1, 2, 1];
        let position = null;
        if (this._levelData.multiplayerGame) {
            this._maxEnemies = 8;
            this._enemiesArray.forEach((item, _, array) => array.push(item));
            if (this._levelData.firstPlayer) {
                const player = this._map.getPlayer(1);
                position = { x: player.x, y: player.y };
                this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
            }
            if (this._levelData.secondPlayer) {
                const player2 = this._map.getPlayer(2);
                position = { x: player2.x, y: player2.y };
                this._player2 = new Player2_1.default(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, false, this._levelData.secondPlayer.experience);
            }
        }
        else {
            const player = this._map.getPlayer(1);
            let position = { x: player.x, y: player.y };
            this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
            (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
        }
        this._headquarterRu = new Headquarter_1.default(this, this._map.getHeadquarterPosition(true), "objects", "headquarterRu");
        this._headquarterUa = new Headquarter_1.default(this, this._map.getHeadquarterPosition(false), "objects", "headquarterUa");
        this._enemiesLeft = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2, this._headquarterUa, this._headquarterRu);
        let turretPosition = this._map.getTurretPosition(1);
        this._turret = new Turret_1.default(this, turretPosition, this._map, this._enemies, this._player1, this._player2);
        this._enemiesLeft++;
        turretPosition = this._map.getRadarPosition();
        this._radar = new Radar_1.default(this, turretPosition, "objects", "platform1", this._enemies, this._player1, this._player2);
        this._turret.radar = this._radar;
        this._enemiesLeft++;
        this._enemiesText = (0, utils_1.createLevelText)(this, 15, 30, `Enemies: ${this._enemiesLeft}`, this._style);
        if (this._player1) {
            this._players.push(this._player1);
            this._player1.enemyVehicles = this._enemies;
            this._player1.enemyTurrets = [this._turret];
            this._player1.enemyTurretPlatforms = [this._turret.platform];
            this._player1.headquarterRu = this._headquarterRu;
            this._player1.headquarterUa = this._headquarterUa;
            this._player1.radar = this._radar;
            this._player1.enemiesStatic = [this._headquarterRu, this._headquarterUa, this._radar];
            if (this._player2)
                this._player1.player2 = this._player2;
            this._player1.handleCollisions();
        }
        if (this._player2) {
            this._players.push(this._player2);
            this._player2.enemyVehicles = this._enemies;
            this._player2.enemyTurrets = [this._turret];
            this._player2.enemyTurretPlatforms = [this._turret.platform];
            this._player2.headquarterRu = this._headquarterRu;
            this._player2.headquarterUa = this._headquarterUa;
            this._player2.radar = this._radar;
            this._player2.enemiesStatic = [this._headquarterRu, this._headquarterUa, this._radar];
            if (this._player1)
                this._player2.player1 = this._player1;
            this._player2.handleCollisions();
        }
        this.listenEvents();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this._player1 ? this.cameras.main.startFollow(this._player1) : this.cameras.main.startFollow(this._player2);
        this._fightingMelody.play();
        this.createFinishText();
    }
    listenEvents() {
        if (this.events.listeners("first_player_dead").length <= 0) {
            this.events.on("first_player_dead", this.firstPlayerDead, this);
        }
        if (this.events.listeners("second_player_dead").length <= 0) {
            this.events.on("second_player_dead", this.secondPlayerDead, this);
        }
        if (this.events.listeners("enemy_dead").length <= 0) {
            this.events.on("enemy_dead", this.enemyDead, this);
        }
        if (this.events.listeners("enemy_headquarter_destroyed").length <= 0) {
            this.events.on("enemy_headquarter_destroyed", this.enemyDead, this);
        }
        if (this.events.listeners("headquarterUa_destroyed").length <= 0) {
            this.events.on("headquarterUa_destroyed", this.headquarterDestroyed, this);
        }
    }
    enemyDead(toCount, isHeadquarterRuDestroyed) {
        if (isHeadquarterRuDestroyed)
            this._isHeadquarterRuDestroyed = isHeadquarterRuDestroyed;
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesLeft;
            this._enemiesText.setText(`Enemies: ${this._enemiesLeft}`);
        }
        if (this._enemiesLeft <= 0 && this._isHeadquarterRuDestroyed) {
            this._levelData.nextLevelNumber = "level-6";
            this._levelData.nextLevelName = "Dangerous Zone";
            if (this._player1 && this._levelData.firstPlayer) {
                this._levelData.firstPlayer.experience = this._player1.experience;
                this._levelData.firstPlayer.tanksPerLevel = this._player1.tanksPerLevel;
                this._levelData.firstPlayer.bmpPerLevel = this._player1.bmpPerLevel;
                this._levelData.firstPlayer.btrPerLevel = this._player1.btrPerLevel;
                this._levelData.firstPlayer.turretsPerLevel = this._player1.turretsPerLevel;
                this._levelData.firstPlayer.radarPerLevel = this._player1.radarPerLevel;
            }
            if (this._player2 && this._levelData.secondPlayer) {
                this._levelData.secondPlayer.experience = this._player2.experience;
                this._levelData.secondPlayer.tanksPerLevel = this._player2.tanksPerLevel;
                this._levelData.secondPlayer.bmpPerLevel = this._player2.bmpPerLevel;
                this._levelData.secondPlayer.btrPerLevel = this._player2.btrPerLevel;
                this._levelData.secondPlayer.turretsPerLevel = this._player2.turretsPerLevel;
                this._levelData.secondPlayer.radarPerLevel = this._player2.radarPerLevel;
            }
            this._fightingMelody.stop();
            this._isHeadquarterRuDestroyed = false;
            this.scene.start("postlevel-scene", { data: this._levelData });
        }
    }
    headquarterDestroyed() {
        this._headquarterUa = null;
        if (!this._headquarterUa)
            this.runTween();
    }
}
exports["default"] = Level_5;


/***/ }),

/***/ "./src/scenes/levels/Level_6.ts":
/*!**************************************!*\
  !*** ./src/scenes/levels/Level_6.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Map_1 = __importDefault(__webpack_require__(/*! ../../classes/Map */ "./src/classes/Map.ts"));
const Player_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/GroupOfEnemies */ "./src/classes/vehicles/enemies/GroupOfEnemies.ts"));
const Player2_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/player/Player2 */ "./src/classes/vehicles/player/Player2.ts"));
const Turret_1 = __importDefault(__webpack_require__(/*! ../../classes/vehicles/enemies/Turret */ "./src/classes/vehicles/enemies/Turret.ts"));
const Level_1 = __importDefault(__webpack_require__(/*! ./Level */ "./src/scenes/levels/Level.ts"));
const Headquarter_1 = __importDefault(__webpack_require__(/*! ../../classes/Headquarter */ "./src/classes/Headquarter.ts"));
class Level_6 extends Level_1.default {
    constructor() {
        super("level-6");
        this._turret1 = null;
        this._turret2 = null;
        this._headquarterRu = null;
        this._isHeadquarterRuDestroyed = false;
    }
    create({ data }) {
        this._map = new Map_1.default(this, 6);
        this._levelData = data;
        this._enemiesArray = [3, 3, 1, 3, 2, 3, 1, 3, 2, 1, 2, 2, 1, 1, 3, 2, 1];
        let position = null;
        if (this._levelData.multiplayerGame) {
            this._maxEnemies = 8;
            this._enemiesArray.forEach((item, _, array) => array.push(item));
            if (this._levelData.firstPlayer) {
                const player = this._map.getPlayer(1);
                position = { x: player.x, y: player.y };
                this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
            }
            if (this._levelData.secondPlayer) {
                const player2 = this._map.getPlayer(2);
                position = { x: player2.x, y: player2.y };
                this._player2 = new Player2_1.default(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
                (0, utils_1.showPlayerExperience)(this, this._style, false, this._levelData.secondPlayer.experience);
            }
        }
        else {
            const player = this._map.getPlayer(1);
            let position = { x: player.x, y: player.y };
            this._player1 = new Player_1.default(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience);
            (0, utils_1.showPlayerExperience)(this, this._style, true, this._levelData.firstPlayer.experience);
        }
        this._headquarterRu = new Headquarter_1.default(this, this._map.getHeadquarterPosition(true), "objects", "headquarterRu");
        this._enemiesLeft = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2, null, this._headquarterRu);
        let turretPosition = this._map.getTurretPosition(1);
        this._turret1 = new Turret_1.default(this, turretPosition, this._map, this._enemies, this._player1, this._player2, null, 1);
        this._enemiesLeft++;
        turretPosition = this._map.getTurretPosition(2);
        this._turret2 = new Turret_1.default(this, turretPosition, this._map, this._enemies, this._player1, this._player2, null, 2);
        this._enemiesLeft++;
        this._enemiesText = (0, utils_1.createLevelText)(this, 15, 30, `Enemies: ${this._enemiesLeft}`, this._style);
        if (this._player1) {
            this._players.push(this._player1);
            this._player1.enemyVehicles = this._enemies;
            this._player1.enemyTurrets = [this._turret1, this._turret2];
            this._player1.enemyTurretPlatforms = [this._turret1.platform, this._turret2.platform];
            this._player1.headquarterRu = this._headquarterRu;
            this._player1.enemiesStatic = [this._headquarterRu];
            if (this._player2)
                this._player1.player2 = this._player2;
            this._player1.handleCollisions();
        }
        if (this._player2) {
            this._players.push(this._player2);
            this._player2.enemyVehicles = this._enemies;
            this._player2.enemyTurrets = [this._turret1, this._turret2];
            this._player2.enemyTurretPlatforms = [this._turret1.platform, this._turret2.platform];
            this._player2.headquarterRu = this._headquarterRu;
            this._player2.enemiesStatic = [this._headquarterRu];
            if (this._player1)
                this._player2.player1 = this._player1;
            this._player2.handleCollisions();
        }
        this.listenEvents();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this._player1 ? this.cameras.main.startFollow(this._player1) : this.cameras.main.startFollow(this._player2);
        this._fightingMelody.play();
        this.createFinishText();
    }
    listenEvents() {
        if (this.events.listeners("first_player_dead").length <= 0) {
            this.events.on("first_player_dead", this.firstPlayerDead, this);
        }
        if (this.events.listeners("second_player_dead").length <= 0) {
            this.events.on("second_player_dead", this.secondPlayerDead, this);
        }
        if (this.events.listeners("enemy_dead").length <= 0) {
            this.events.on("enemy_dead", this.enemyDead, this);
        }
        if (this.events.listeners("enemy_headquarter_destroyed").length <= 0) {
            this.events.on("enemy_headquarter_destroyed", this.enemyDead, this);
        }
    }
    enemyDead(toCount, isHeadquarterRuDestroyed) {
        if (isHeadquarterRuDestroyed)
            this._isHeadquarterRuDestroyed = isHeadquarterRuDestroyed;
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesLeft;
            this._enemiesText.setText(`Enemies: ${this._enemiesLeft}`);
        }
        if (this._enemiesLeft <= 0 && this._isHeadquarterRuDestroyed) {
            this._levelData.nextLevelNumber = "level-7";
            this._levelData.nextLevelName = "?";
            if (this._player1 && this._levelData.firstPlayer) {
                this._levelData.firstPlayer.experience = this._player1.experience;
                this._levelData.firstPlayer.tanksPerLevel = this._player1.tanksPerLevel;
                this._levelData.firstPlayer.bmpPerLevel = this._player1.bmpPerLevel;
                this._levelData.firstPlayer.btrPerLevel = this._player1.btrPerLevel;
                this._levelData.firstPlayer.turretsPerLevel = this._player1.turretsPerLevel;
                this._levelData.firstPlayer.radarPerLevel = this._player1.radarPerLevel;
            }
            if (this._player2 && this._levelData.secondPlayer) {
                this._levelData.secondPlayer.experience = this._player2.experience;
                this._levelData.secondPlayer.tanksPerLevel = this._player2.tanksPerLevel;
                this._levelData.secondPlayer.bmpPerLevel = this._player2.bmpPerLevel;
                this._levelData.secondPlayer.btrPerLevel = this._player2.btrPerLevel;
                this._levelData.secondPlayer.turretsPerLevel = this._player2.turretsPerLevel;
                this._levelData.secondPlayer.radarPerLevel = this._player2.radarPerLevel;
            }
            this._fightingMelody.stop();
            this._isHeadquarterRuDestroyed = false;
            this.scene.start("postlevel-scene", { data: this._levelData });
        }
    }
}
exports["default"] = Level_6;


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
exports.showPlayerExperience = exports.getPlayersRank = exports.createLevelText = exports.createRectangleFrame = exports.createTextButton = exports.createText = exports.goToOpositeDirection = exports.handleDirection = exports.PLAYER = exports.ENEMY = exports.DIRECTION = exports.XPOINTS_3_ANIMATION = exports.XPOINTS_2_ANIMATION = exports.XPOINTS_1_ANIMATION = exports.SHOOTING_ANIMATION = exports.SPARKLE_ANIMATION = exports.RADAR_ANIMATION = exports.BANG_ANIMATION = exports.FRICTIONS = exports.GROUND_FRICTION = exports.SPEED = exports.TURNS = exports.PLAYER_SPEED = void 0;
var PLAYER_SPEED;
(function (PLAYER_SPEED) {
    PLAYER_SPEED[PLAYER_SPEED["NONE"] = 0] = "NONE";
    PLAYER_SPEED[PLAYER_SPEED["FORWARD"] = 100] = "FORWARD";
    PLAYER_SPEED[PLAYER_SPEED["BACKWARD"] = -100] = "BACKWARD";
})(PLAYER_SPEED = exports.PLAYER_SPEED || (exports.PLAYER_SPEED = {}));
;
var TURNS;
(function (TURNS) {
    TURNS[TURNS["NONE"] = 0] = "NONE";
    TURNS[TURNS["RIGHT"] = 1.3] = "RIGHT";
    TURNS[TURNS["LEFT"] = -1.3] = "LEFT";
})(TURNS = exports.TURNS || (exports.TURNS = {}));
;
var SPEED;
(function (SPEED) {
    SPEED[SPEED["BASIC"] = 150] = "BASIC";
    SPEED[SPEED["FASTER"] = 690] = "FASTER";
    SPEED[SPEED["FASTEST"] = 1000] = "FASTEST";
})(SPEED = exports.SPEED || (exports.SPEED = {}));
;
exports.GROUND_FRICTION = 0.5;
exports.FRICTIONS = {
    "lake": 0.1,
    "road": 1
};
exports.BANG_ANIMATION = "BANG_ANIMATION";
exports.RADAR_ANIMATION = "RADAR_ANIMATION";
exports.SPARKLE_ANIMATION = "SPARKLE_ANIMATION";
exports.SHOOTING_ANIMATION = "SHOOTING_ANIMATION";
exports.XPOINTS_1_ANIMATION = "XPOINTS_1_ANIMATION";
exports.XPOINTS_2_ANIMATION = "XPOINTS_2_ANIMATION";
exports.XPOINTS_3_ANIMATION = "XPOINTS_3_ANIMATION";
var DIRECTION;
(function (DIRECTION) {
    DIRECTION["RIGHT"] = "RIGHT";
    DIRECTION["DOWN"] = "DOWN";
    DIRECTION["LEFT"] = "LEFT";
    DIRECTION["UP"] = "UP";
})(DIRECTION = exports.DIRECTION || (exports.DIRECTION = {}));
;
exports.ENEMY = {
    TANK: {
        TYPE: "TANK",
        SPEED: 60,
        ARMOUR: 150,
        SHELL_POWER: 45,
        SHELL_TYPE: "bulletDark3"
    },
    BMP: {
        TYPE: "BMP",
        SPEED: 120,
        ARMOUR: 70,
        SHELL_POWER: 26,
        SHELL_TYPE: "bulletDark2"
    },
    BTR: {
        TYPE: "BTR",
        SPEED: 190,
        ARMOUR: 56,
        SHELL_POWER: 13,
        SHELL_TYPE: "bulletDark1"
    },
    TURRET: {
        ARMOUR: 200,
        SHELL_POWER: 45,
        SHELL_TYPE: "bulletDark3"
    }
};
exports.PLAYER = {
    TANK: {
        SPEED: 100,
        ARMOUR: 100,
        SHELL_POWER: 60,
        SHELL_TYPE: "bulletRed2"
    },
    BMP: {
        SPEED: 140,
        ARMOUR: 77,
        SHELL_POWER: 30,
        SHELL_TYPE: "bulletSand1"
    },
};
function handleDirection(enemy) {
    switch (enemy.direction) {
        case DIRECTION.DOWN:
            enemy.body.y -= 5;
            break;
        case DIRECTION.LEFT:
            enemy.body.x += 5;
            break;
        case DIRECTION.UP:
            enemy.body.y += 5;
            break;
        case DIRECTION.RIGHT:
            enemy.body.x -= 5;
            break;
    }
}
exports.handleDirection = handleDirection;
function goToOpositeDirection(enemy) {
    var _a, _b, _c, _d;
    switch (enemy.direction) {
        case DIRECTION.DOWN:
            (_a = enemy.body) === null || _a === void 0 ? void 0 : _a.setVelocity(0, -enemy.velocity);
            enemy.angle = 180;
            break;
        case DIRECTION.LEFT:
            (_b = enemy.body) === null || _b === void 0 ? void 0 : _b.setVelocity(enemy.velocity, 0);
            enemy.angle = -90;
            break;
        case DIRECTION.UP:
            (_c = enemy.body) === null || _c === void 0 ? void 0 : _c.setVelocity(0, enemy.velocity);
            enemy.angle = 0;
            break;
        case DIRECTION.RIGHT:
            (_d = enemy.body) === null || _d === void 0 ? void 0 : _d.setVelocity(-enemy.velocity, 0);
            enemy.angle = 90;
            break;
    }
}
exports.goToOpositeDirection = goToOpositeDirection;
function createText(scene, positionX, positionY, text, style) {
    return scene.add.text(positionX, positionY, text, style).setOrigin(0);
}
exports.createText = createText;
function createTextButton(scene, height, text, style, textButtonWidth) {
    const textButton = createText(scene, 0, 0, text, style);
    const width = textButtonWidth ? textButtonWidth : textButton.width;
    textButton.setX(window.innerWidth / 2 - width / 2);
    textButton.setY(window.innerHeight / 2 + height);
    textButton.setInteractive({ useHandCursor: true });
    return textButton;
}
exports.createTextButton = createTextButton;
function createRectangleFrame(scene, x, y) {
    const rectFrame = scene.add.graphics();
    rectFrame.lineStyle(8, 0xE7590D, 1);
    rectFrame.strokeRoundedRect(x, y, 80, 100, 8);
    rectFrame.visible = false;
    return rectFrame;
}
exports.createRectangleFrame = createRectangleFrame;
function createLevelText(scene, positionX, positionY, text, style) {
    const levelText = createText(scene, positionX, positionY, text, style);
    levelText.depth = 10;
    return levelText;
}
exports.createLevelText = createLevelText;
function getPlayersRank(experience) {
    if ((experience >= 10) && (experience < 20)) {
        return "lieutenant";
    }
    else if ((experience >= 20) && (experience < 30)) {
        return "captain";
    }
    else if ((experience >= 30) && (experience < 50)) {
        return "major";
    }
    else if ((experience >= 50) && (experience < 75)) {
        return "lieutenant_colonel";
    }
    else if ((experience >= 75) && (experience < 100)) {
        return "colonel";
    }
    else if ((experience >= 100) && (experience < 150)) {
        return "brigadier";
    }
    else if ((experience >= 150) && (experience < 200)) {
        return "major_general";
    }
    else if (experience > 200) {
        return "lieutenant_general";
    }
    else
        return "second_lieutenant";
}
exports.getPlayersRank = getPlayersRank;
function showPlayerExperience(scene, style, isFirst, experience) {
    const width = scene.sys.game.canvas.width;
    const rank = getPlayersRank(experience);
    let sprite = null;
    if (isFirst) {
        createLevelText(scene, width - 80, 30, "1st", style);
        sprite = scene.add.sprite(width - 40, 130, "objects", rank);
    }
    else {
        createLevelText(scene, width - 90, 200, "2nd", style);
        sprite = scene.add.sprite(width - 40, 300, "objects", rank);
    }
    sprite.depth = 10;
}
exports.showPlayerExperience = showPlayerExperience;


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