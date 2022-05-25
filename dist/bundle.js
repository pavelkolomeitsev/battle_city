/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
        this._defenceArea = null;
        this._baseArea = null;
        this._checkZone = null;
        this.boxes = [];
        this.stones = [];
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
        this.createAreas();
    }
    createLayers() {
        this.tilemap.createLayer("ground", this._tileset);
        this.tilemap.createLayer("road", this._tileset);
    }
    createCollisions() {
        this.tilemap.findObject("collisions", collisionObject => {
            const castedObject = collisionObject;
            let sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x, castedObject.y, "objects", "crateWood");
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, true);
            sprite.body.enable = true;
            this.boxes.push(sprite);
        });
        this.tilemap.findObject("stones", gameObject => {
            const castedObject = gameObject;
            const sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x + castedObject.width / 2, castedObject.y - castedObject.height / 2, "objects", gameObject.name);
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, true);
            sprite.body.enable = true;
            this.stones.push(sprite);
        });
    }
    createAreas() {
        let array = this.tilemap.filterObjects("defence_area", checkpoint => checkpoint.name === "defence_area");
        array.forEach((item) => {
            this._defenceArea = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        array = this.tilemap.filterObjects("base_area", checkpoint => checkpoint.name === "base_area");
        array.forEach((item) => {
            this._baseArea = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        array = this.tilemap.filterObjects("enemies", checkpoint => checkpoint.name === "check_zone");
        array.forEach((item) => {
            this._checkZone = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        array = null;
    }
    getPlayer() {
        return this.tilemap.findObject("player", playerObject => playerObject.name === "player");
    }
    getTurretPosition() {
        const turret = this.tilemap.findObject("enemies", playerObject => playerObject.name === "turret");
        const position = { x: turret.x, y: turret.y };
        return position;
    }
    getRadarPosition() {
        const radar = this.tilemap.findObject("enemies", playerObject => playerObject.name === "radar");
        const position = { x: radar.x, y: radar.y };
        return position;
    }
    getBasePosition(baseNumber) {
        const base = this.tilemap.findObject("enemies", playerObject => playerObject.name === `base_${baseNumber}`);
        const position = { x: base === null || base === void 0 ? void 0 : base.x, y: base === null || base === void 0 ? void 0 : base.y };
        return position;
    }
    getTileFriction(vehicle) {
        for (const roadType in utils_1.ROADS_FRICTION) {
            const tile = this.tilemap.getTileAtWorldXY(vehicle.x, vehicle.y, false, this._scene.cameras.main, roadType);
            if (tile)
                return utils_1.ROADS_FRICTION[roadType];
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
    isInDefenceArea(playersTank) {
        if (playersTank.active)
            return this._defenceArea.contains(playersTank.x, playersTank.y);
    }
    isInBaseArea(playersTank) {
        if (playersTank.active)
            return this._baseArea.contains(playersTank.x, playersTank.y);
    }
    isInCheckZone(enemy) {
        if (enemy.active)
            return this._checkZone.contains(enemy.x, enemy.y);
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
        this._scene = scene;
        this._scene.add.existing(this);
        this.bangAnimation();
    }
    bangAnimation() {
        this.play(utils_1.BANG_ANIMATION);
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
    constructor(world, scene, map, texture, enemy = true) {
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
        this.setPauseBetweenShoots();
    }
    createFire(parentSprite) {
        if (this._nextShoot > this._scene.time.now)
            return;
        let shell = this.getFirstDead();
        const side = this._enemy ? -35 : 30;
        if (!shell) {
            const vector = this._scene.physics.velocityFromAngle(parentSprite.angle + 270, side);
            const position = { x: parentSprite.x + vector.x, y: parentSprite.y + vector.y };
            shell = new Shell_1.default(this._scene, position, "objects", this._texture, parentSprite, this._map);
            this.add(shell);
        }
        else {
            const vector = this._scene.physics.velocityFromAngle(parentSprite.angle + 270, side);
            const position = { x: parentSprite.x + vector.x - 6, y: parentSprite.y + vector.y - 6 };
            shell.body.x = position.x;
            shell.body.y = position.y;
            shell.setAlive(true);
        }
        shell.flyOut(this._direction);
        this._nextShoot = this._scene.time.now + this._pauseBetweenShoots;
    }
    setPauseBetweenShoots() {
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
            case "bulletRed1":
                this._pauseBetweenShoots = 500;
                break;
            case "bulletRed2":
                this._pauseBetweenShoots = 1000;
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
class Shell extends Phaser.GameObjects.Sprite {
    constructor(scene, position, atlasName, textureName, parentSprite, map) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = null;
        this._parentSprite = null;
        this._map = null;
        this._shellSpeed = 0;
        this._shellPower = 0;
        this._scene = scene;
        this._parentSprite = parentSprite;
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
    setShellSpeed(textureName) {
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
        vector.setToPolar(this._parentSprite.rotation + (direction * Math.PI / 2));
        this.angle = this._parentSprite.angle;
        this.body.setVelocity(vector.x * this._shellSpeed, vector.y * this._shellSpeed);
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
class EnemyVehicle extends Vehicle_1.default {
    constructor(scene, position, atlasName, textureName, map, player) {
        super(scene, position, atlasName, textureName, map);
        this._vehicleSpeed = 0;
        this._type = "";
        this._armour = 0;
        this._timer = null;
        this._player = null;
        this.isAppear = true;
        this.direction = utils_1.DIRECTION.DOWN;
        const shellType = this.setEnemiesType(textureName);
        this._groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, this._map, shellType);
        this._timer = this._scene.time.addEvent({
            delay: 4500,
            loop: true,
            callback: this.changeDirection,
            callbackScope: this
        });
        this._player = player;
        this.direction = utils_1.DIRECTION.DOWN;
        this._scene.physics.add.overlap(this._player, this._groupOfShells, this.shellsPlayerCollision, null, this);
        this._scene.physics.add.overlap(this._map.boxes, this._groupOfShells, this.shellsBoxesCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.shellsStoneCollision, null, this);
        this._scene.events.on("update", this.fire, this);
    }
    setEnemiesType(textureName) {
        let shellType = "";
        switch (textureName) {
            case "tank_blue":
                this._type = utils_1.ENEMY.BTR.TYPE;
                this._vehicleSpeed = utils_1.ENEMY.BTR.SPEED;
                this._armour = utils_1.ENEMY.BTR.ARMOUR;
                return shellType = utils_1.ENEMY.BTR.SHELL_TYPE;
            case "tank_dark":
                this._type = utils_1.ENEMY.BMP.TYPE;
                this._vehicleSpeed = utils_1.ENEMY.BMP.SPEED;
                this._armour = utils_1.ENEMY.BMP.ARMOUR;
                return shellType = utils_1.ENEMY.BMP.SHELL_TYPE;
            case "tank_sand":
                this._type = utils_1.ENEMY.TANK.TYPE;
                this._vehicleSpeed = utils_1.ENEMY.TANK.SPEED;
                this._armour = utils_1.ENEMY.TANK.ARMOUR;
                return shellType = utils_1.ENEMY.TANK.SHELL_TYPE;
        }
    }
    destroyEnemy(shell) {
        this._armour -= shell.damage;
        switch (this._type) {
            case utils_1.ENEMY.TANK.TYPE:
                if ((this._armour <= 50) && (this._armour > 0)) {
                }
                else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this.destroy();
                    return true;
                }
                break;
            case utils_1.ENEMY.BMP.TYPE:
                if ((this._armour <= 35) && (this._armour > 0)) {
                }
                else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this.destroy();
                    return true;
                }
                break;
            case utils_1.ENEMY.BTR.TYPE:
                if ((this._armour <= 26) && (this._armour > 0)) {
                }
                else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this.destroy();
                    return true;
                }
                break;
        }
        return false;
    }
    get velocity() {
        return this.getMaxSpeed();
    }
    getMaxSpeed() {
        return this._vehicleSpeed * this._map.getTileFriction(this);
    }
    changeDirection() {
        var _a;
        if (this.isAppear)
            this.isAppear = false;
        const [x, y, angle] = this.getVehiclesDirection();
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.setVelocity(x, y);
        this.angle = angle;
    }
    getVehiclesDirection() {
        const direction = Math.floor(Math.random() * 4) + 1;
        switch (direction) {
            case 1:
                this.direction = utils_1.DIRECTION.UP;
                return [0, -this.velocity, 180];
            case 2:
                this.direction = utils_1.DIRECTION.RIGHT;
                return [this.velocity, 0, -90];
            case 3:
                this.direction = utils_1.DIRECTION.DOWN;
                return [0, this.velocity, 0];
            case 4:
                this.direction = utils_1.DIRECTION.LEFT;
                return [-this.velocity, 0, 90];
            default:
                this.direction = utils_1.DIRECTION.DOWN;
                return [0, this.velocity, 0];
        }
    }
    moveOut() {
        var _a;
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.setVelocity(0, this.velocity * 1.3);
    }
    fire() {
        if (this._groupOfShells) {
            this._groupOfShells.createFire(this);
        }
        if ((Phaser.Math.Distance.BetweenPoints(this, this._player) < 300) && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player.x, this._player.y);
            this.rotation = angle - Math.PI / 2;
        }
    }
    shellsPlayerCollision(player, shell) {
        const position = { x: player.x, y: player.y };
        BangAnimation_1.default.generateBang(this._scene, position);
        shell.setAlive(false);
        player.destroyPlayer(shell);
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
const utils_1 = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
class GroupOfEnemies extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, map, enemies, player) {
        super(world, scene);
        this._scene = null;
        this._map = null;
        this._timer = null;
        this._enemies = [];
        this._player = null;
        this.counter = 0;
        this._scene = scene;
        this._map = map;
        this._enemies = enemies;
        this._player = player;
        this._timer = this._scene.time.addEvent({
            delay: 3000,
            loop: true,
            callback: this.addEnemy,
            callbackScope: this
        });
        this._scene.physics.add.collider(this, this, this.handleEnemyVehicleCollision, null, this);
        this._scene.events.on("update", this.update, this);
    }
    addEnemy() {
        var _a;
        if (this.counter < 6) {
            this._enemies.length > 0 ? this.createEnemy() : (_a = this._timer) === null || _a === void 0 ? void 0 : _a.remove();
        }
    }
    createEnemy() {
        const baseNumber = Math.floor(Math.random() * 2) + 1;
        const position = this._map.getBasePosition(baseNumber);
        const enemiesTexture = this.getEnemyVehicleTexture(this._enemies.pop());
        const enemy = new EnemyVehicle_1.default(this._scene, position, "objects", enemiesTexture, this._map, this._player);
        this.add(enemy);
        enemy.moveOut();
        ++this.counter;
    }
    getEnemyVehicleTexture(index) {
        switch (index) {
            case 1:
                return "tank_blue";
            case 2:
                return "tank_dark";
            case 3:
                return "tank_sand";
        }
    }
    handleEnemyVehicleCollision(firstEnemy, secondEnemy) {
        (0, utils_1.handleDirection)(firstEnemy);
        (0, utils_1.handleDirection)(secondEnemy);
        firstEnemy.changeDirection();
        secondEnemy.body.stop();
    }
    update() {
        if (this.children.size > 0) {
            const array = this.children.getArray();
            for (let i = 0; i < this.children.size; i++) {
                if (!array[i].isAppear && this._map.isInCheckZone(array[i])) {
                    array[i].body.y += 30;
                    array[i].changeDirection();
                }
            }
        }
    }
}
exports["default"] = GroupOfEnemies;


/***/ }),

/***/ "./src/classes/vehicles/enemies/Radar.ts":
/*!***********************************************!*\
  !*** ./src/classes/vehicles/enemies/Radar.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
class Radar extends Phaser.GameObjects.Sprite {
    constructor(scene, position, atlasName, textureName) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = null;
        this._scene = scene;
        this.init();
        this.runRadar();
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
class Turret {
    constructor(scene, position, map, player) {
        this._scene = null;
        this._map = null;
        this._armour = 0;
        this._player = null;
        this._groupOfShells = null;
        this.platform = null;
        this.turret = null;
        this.isFiring = true;
        this._scene = scene;
        this._map = map;
        this._armour = utils_1.ENEMY.TURRET.ARMOUR;
        this._player = player;
        this.init(position, this._map, utils_1.ENEMY.TURRET.SHELL_TYPE);
        this._scene.physics.add.overlap(this._player, this._groupOfShells, this.shellsPlayerCollision, null, this);
        this._scene.physics.add.overlap(this._map.boxes, this._groupOfShells, this.boxesShellsCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.stonesShellsCollision, null, this);
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
    runTurret(player, isPlayerNear) {
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
            this._scene = null;
            this._groupOfShells = null;
        }
    }
}
exports["default"] = Turret;


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
class Player extends Vehicle_1.default {
    constructor(scene, position, atlasName, textureName, map, shellTexture, enemy) {
        super(scene, position, atlasName, textureName, map);
        this._cursor = null;
        this._armour = 0;
        this.groupOfShells = null;
        this._velocity = 0;
        this._cursor = this._scene.input.keyboard.createCursorKeys();
        this.groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, this._map, shellTexture, false);
        this.setVehicleType(textureName);
        this._scene.physics.add.overlap(this._map.boxes, this.groupOfShells, this.boxesShellsCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this.groupOfShells, this.stonesShellsCollision, null, this);
    }
    setVehicleType(textureName) {
        switch (textureName) {
            case "tank_red":
                this._armour = 100;
                break;
            case "bmp_red":
                this._armour = 77;
                break;
        }
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
    get direction() {
        let direction = utils_1.PLAYER_SPEED.NONE;
        if (this._cursor.up.isDown)
            direction = utils_1.PLAYER_SPEED.FORWARD;
        else if (this._cursor.down.isDown)
            direction = utils_1.PLAYER_SPEED.BACKWARD;
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
        if (this._cursor.space.isDown && this)
            this.fire();
    }
    setAlive(status) {
        this.body.enable = status;
        this.setVisible(status);
        this.setActive(status);
    }
    destroyPlayer(shell) {
        this._armour -= shell.damage;
        if ((this._armour < 100) && (this._armour >= 50)) {
        }
        else if ((this._armour < 50) && (this._armour > 0)) {
        }
        else if (this._armour <= 0) {
            this.destroy();
        }
    }
}
exports["default"] = Player;


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
const BangAnimation_1 = __importDefault(__webpack_require__(/*! ../classes/animation/BangAnimation */ "./src/classes/animation/BangAnimation.ts"));
const Map_1 = __importDefault(__webpack_require__(/*! ../classes/Map */ "./src/classes/Map.ts"));
const Player_1 = __importDefault(__webpack_require__(/*! ../classes/vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
const Radar_1 = __importDefault(__webpack_require__(/*! ../classes/vehicles/enemies/Radar */ "./src/classes/vehicles/enemies/Radar.ts"));
const Turret_1 = __importDefault(__webpack_require__(/*! ../classes/vehicles/enemies/Turret */ "./src/classes/vehicles/enemies/Turret.ts"));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../classes/vehicles/enemies/GroupOfEnemies */ "./src/classes/vehicles/enemies/GroupOfEnemies.ts"));
const EnemyVehicle_1 = __importDefault(__webpack_require__(/*! ../classes/vehicles/enemies/EnemyVehicle */ "./src/classes/vehicles/enemies/EnemyVehicle.ts"));
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "game-scene" });
        this._map = null;
        this._player1 = null;
        this._turret = null;
        this._radar = null;
        this._enemies = null;
    }
    preload() {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this.loadAnimation();
    }
    create() {
        this._map = new Map_1.default(this);
        const player = this._map.getPlayer();
        const position = { x: player.x, y: player.y };
        this._player1 = new Player_1.default(this, position, "objects", "tank_red", this._map, "bulletRed2", false);
        this._turret = new Turret_1.default(this, this._map.getTurretPosition(), this._map, this._player1);
        this._radar = new Radar_1.default(this, this._map.getRadarPosition(), "objects", "platform1");
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, [3, 3, 3, 2, 2, 2, 1, 1, 1], this._player1);
        this.handleCollisions();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this.cameras.main.startFollow(this._player1);
    }
    handleCollisions() {
        this.physics.add.overlap([this._turret.platform, this._radar], this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);
        this.physics.add.overlap(this._enemies, this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);
        this.physics.add.collider([this._turret.platform, this._radar, this._player1, ...this._map.boxes, ...this._map.stones], this._enemies, this.handleEnemiesCollision, null, this);
        this.physics.add.collider([this._turret.platform, this._radar, ...this._enemies.children.getArray(), ...this._map.boxes, ...this._map.stones], this._player1, this.handlePlayerCollision, null, this);
    }
    shellsEnemiesCollision(enemy, shell) {
        const position = { x: enemy.x, y: enemy.y };
        BangAnimation_1.default.generateBang(this, position);
        if (enemy instanceof Radar_1.default) {
            this._radar.destroy();
        }
        else if (enemy.frame.name === "platform") {
            this._turret.destroyTurret(shell);
        }
        else if (enemy instanceof EnemyVehicle_1.default) {
            if (enemy.destroyEnemy(shell)) {
                --this._enemies.counter;
            }
        }
        shell.setAlive(false);
    }
    handleEnemiesCollision(gameObject, enemy) {
        (0, utils_1.handleDirection)(enemy);
        enemy.changeDirection();
    }
    handlePlayerCollision(gameObject, player) {
        player.body.stop();
    }
    update(time, delta) {
        if (this._player1.active)
            this._player1.move();
        if (this._turret.turret && this._player1.active) {
            const isPlayerNear = this._map.checkPlayersPosition(this._radar, this._player1);
            this._turret.runTurret(this._player1, isPlayerNear);
        }
        this.checkMapBounds([this._player1, ...this._enemies.getChildren()]);
    }
    getVehicleConfig() {
        let config = { player1: utils_1.TANKS.RED, player2: utils_1.TANKS.BLUE };
        return config;
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
exports.handleDirection = exports.PLAYER = exports.ENEMY = exports.DIRECTION = exports.SPARKLE_ANIMATION = exports.RADAR_ANIMATION = exports.BANG_ANIMATION = exports.TANKS = exports.ROADS_FRICTION = exports.GROUND_FRICTION = exports.SPEED = exports.TURNS = exports.PLAYER_SPEED = void 0;
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
    TURNS[TURNS["RIGHT"] = 1] = "RIGHT";
    TURNS[TURNS["LEFT"] = -1] = "LEFT";
})(TURNS = exports.TURNS || (exports.TURNS = {}));
;
var SPEED;
(function (SPEED) {
    SPEED[SPEED["BASIC"] = 150] = "BASIC";
    SPEED[SPEED["FASTER"] = 690] = "FASTER";
    SPEED[SPEED["FASTEST"] = 900] = "FASTEST";
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
exports.RADAR_ANIMATION = "RADAR_ANIMATION";
exports.SPARKLE_ANIMATION = "SPARKLE_ANIMATION";
class Checkpoint extends Phaser.Geom.Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
}
exports["default"] = Checkpoint;
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
        ARMOUR: 100,
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
        ARMOUR: 100,
        SHELL_POWER: 60,
        SHELL_TYPE: "bulletRed2"
    },
    BMP: {
        ARMOUR: 77,
        SHELL_POWER: 30,
        SHELL_TYPE: "bulletRed1"
    },
};
function handleDirection(enemy) {
    switch (enemy.direction) {
        case DIRECTION.DOWN:
            enemy.body.y -= 10;
            break;
        case DIRECTION.LEFT:
            enemy.body.x += 10;
            break;
        case DIRECTION.UP:
            enemy.body.y += 10;
            break;
        case DIRECTION.RIGHT:
            enemy.body.x -= 10;
            break;
    }
}
exports.handleDirection = handleDirection;


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