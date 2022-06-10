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
    constructor(scene, level) {
        this._scene = null;
        this._tileset = null;
        this._defenceArea = null;
        this._baseArea = null;
        this._level = "";
        this.tilemap = null;
        this.explosiveObjects = [];
        this.stones = [];
        this._scene = scene;
        this._level = `level${level}/`;
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
    }
    createLayers() {
        this.tilemap.createLayer(this._level + "grass", this._tileset);
        this.tilemap.createLayer(this._level + "road", this._tileset);
    }
    createExplosiveStaticLayer() {
        this.tilemap.findObject(this._level + "explosive_static", collisionObject => {
            const castedObject = collisionObject;
            let sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x + castedObject.width / 2, castedObject.y - castedObject.height / 2, "objects", collisionObject.name);
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, true);
            sprite.body.enable = true;
            this.explosiveObjects.push(sprite);
        });
    }
    createStonesLayer() {
        this.tilemap.findObject(this._level + "stones", gameObject => {
            const castedObject = gameObject;
            const sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x + castedObject.width / 2, castedObject.y - castedObject.height / 2, "objects", gameObject.name);
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, true);
            sprite.body.enable = true;
            this.stones.push(sprite);
        });
    }
    createTreesLayer() {
        this.tilemap.findObject(this._level + "trees", gameObject => {
            const castedObject = gameObject;
            const sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x + castedObject.width / 2, castedObject.y - castedObject.height / 2, "objects", gameObject.name);
            sprite.depth = 10;
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, false);
        });
    }
    getPlayer(playerNumber) {
        return this.tilemap.findObject(this._level + "players", playerObject => playerObject.name === `player${playerNumber}`);
    }
    getBasePosition(baseNumber) {
        const base = this.tilemap.findObject(this._level + "enemies", playerObject => playerObject.name === `base_${baseNumber}`);
        const position = { x: base === null || base === void 0 ? void 0 : base.x, y: base === null || base === void 0 ? void 0 : base.y };
        return position;
    }
    getTileFriction(vehicle) {
        for (const roadType in utils_1.FRICTIONS) {
            const tile = this.tilemap.getTileAtWorldXY(vehicle.x, vehicle.y, false, this._scene.cameras.main, this._level + roadType);
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
    isInDefenceArea(playersTank) {
        if (playersTank.active)
            return this._defenceArea.contains(playersTank.x, playersTank.y);
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
        if (this._nextShoot > this._scene.time.now)
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
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
    constructor(scene, position, atlasName, textureName, map, player1, player2 = null) {
        super(scene, position, atlasName, textureName, map);
        this._vehicleSpeed = 0;
        this._type = "";
        this._armour = 0;
        this._timer = null;
        this._player1 = null;
        this._player2 = null;
        this.isAppear = true;
        this.direction = utils_1.DIRECTION.DOWN;
        const shellType = this.setEnemiesType(textureName);
        this._groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, this._map, shellType);
        this._timer = this._scene.time.addEvent({
            delay: 4000,
            loop: true,
            callback: this.changeDirection,
            callbackScope: this
        });
        this._player1 = player1;
        this._player2 = player2;
        this.direction = utils_1.DIRECTION.DOWN;
        this._scene.physics.add.overlap(this._player2 ? [this._player2, this._player1] : this._player1, this._groupOfShells, this.shellsPlayerCollision, null, this);
        this._scene.physics.add.overlap(this._map.explosiveObjects, this._groupOfShells, this.shellsBoxesCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.shellsStoneCollision, null, this);
        this._scene.events.on("update", this.fire, this);
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
                    this.destroy();
                    const position = { x: shell.x, y: shell.y };
                    XpointsAnimation_1.default.generateAnimation(this._scene, position, 3);
                    this.calculateExperiencePoints(id, 1.1);
                    return true;
                }
                break;
            case utils_1.ENEMY.BMP.TYPE:
                if ((this._armour <= 35) && (this._armour > 0)) {
                    this.setTexture("objects", "enemy_bmp1");
                }
                else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this.destroy();
                    const position = { x: shell.x, y: shell.y };
                    XpointsAnimation_1.default.generateAnimation(this._scene, position, 2);
                    this.calculateExperiencePoints(id, 0.7);
                    return true;
                }
                break;
            case utils_1.ENEMY.BTR.TYPE:
                if ((this._armour <= 26) && (this._armour > 0)) {
                    this.setTexture("objects", "enemy_btr1");
                }
                else if (this._armour <= 0) {
                    this._scene.events.off("update", this.fire, this);
                    this.destroy();
                    const position = { x: shell.x, y: shell.y };
                    XpointsAnimation_1.default.generateAnimation(this._scene, position, 1);
                    this.calculateExperiencePoints(id, 0.4);
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
        if ((this._type !== utils_1.ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._player1) < 300) && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player1.x, this._player1.y);
            this.rotation = angle - Math.PI / 2;
        }
        else if ((this._type === utils_1.ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._player1) < 500) && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player1.x, this._player1.y);
            this.rotation = angle - Math.PI / 2;
        }
        if (!this._player2)
            return;
        if ((this._type !== utils_1.ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._player2) < 300) && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player2.x, this._player2.y);
            this.rotation = angle - Math.PI / 2;
        }
        else if ((this._type === utils_1.ENEMY.TANK.TYPE) && (Phaser.Math.Distance.BetweenPoints(this, this._player2) < 500) && this.body) {
            this.body.stop();
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this._player2.x, this._player2.y);
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
    calculateExperiencePoints(id, points) {
        if (this._player2) {
            id === "P1" ? this._player1.experience += points : this._player2.experience += points;
        }
        else
            this._player1.experience += points;
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
    constructor(world, scene, map, enemies, maxEnemies, numberOfBase, player1, player2 = null) {
        super(world, scene);
        this._scene = null;
        this._map = null;
        this._timer = null;
        this._enemies = [];
        this._player1 = null;
        this._player2 = null;
        this._numberOfBase = 0;
        this._maxEnemies = 0;
        this.counter = 0;
        this._scene = scene;
        this._map = map;
        this._enemies = enemies;
        this._maxEnemies = maxEnemies;
        this._player1 = player1;
        this._player2 = player2;
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
        const enemy = new EnemyVehicle_1.default(this._scene, position, "objects", enemiesTexture, this._map, this._player1, this._player2);
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
        (0, utils_1.handleDirection)(firstEnemy);
        (0, utils_1.handleDirection)(secondEnemy);
        firstEnemy.changeDirection();
        secondEnemy.body.stop();
    }
}
exports["default"] = GroupOfEnemies;


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
    constructor(scene, position, atlasName, textureName, map, shellTexture, experience) {
        super(scene, position, atlasName, textureName, map);
        this._cursor = null;
        this._fire = null;
        this._armour = 0;
        this._vehicleType = "";
        this.groupOfShells = null;
        this.id = "P1";
        this.experience = 0;
        this._velocity = 0;
        this._cursor = this._scene.input.keyboard.createCursorKeys();
        this._fire = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO);
        this.experience = experience;
        this.groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, this._map, shellTexture, false, experience);
        this.setVehicleType(textureName);
        this._scene.physics.add.overlap(this._map.explosiveObjects, this.groupOfShells, this.boxesShellsCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this.groupOfShells, this.stonesShellsCollision, null, this);
    }
    setVehicleType(textureName) {
        switch (textureName) {
            case "player_tank":
                this._vehicleType = "player_tank";
                this._armour = utils_1.PLAYER.TANK.ARMOUR;
                break;
            case "player_ifv":
                this._vehicleType = "player_ifv";
                this._armour = utils_1.PLAYER.BMP.ARMOUR;
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
        this.id = "P2";
        this._controls = this._scene.input.keyboard.addKeys({ "up": Phaser.Input.Keyboard.KeyCodes.W, "down": Phaser.Input.Keyboard.KeyCodes.S, "left": Phaser.Input.Keyboard.KeyCodes.A, "right": Phaser.Input.Keyboard.KeyCodes.D });
        this._fire = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
const Level_1_1 = __importDefault(__webpack_require__(/*! ./scenes/Level_1 */ "./src/scenes/Level_1.ts"));
const PostStartScene_1 = __importDefault(__webpack_require__(/*! ./scenes/PostStartScene */ "./src/scenes/PostStartScene.ts"));
const HelpScene_1 = __importDefault(__webpack_require__(/*! ./scenes/HelpScene */ "./src/scenes/HelpScene.ts"));
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [
        new BootScene_1.default(),
        new PreloadScene_1.default(),
        new StartScene_1.default(),
        new PostStartScene_1.default(),
        new HelpScene_1.default(),
        new Level_1_1.default()
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

/***/ "./src/scenes/Level_1.ts":
/*!*******************************!*\
  !*** ./src/scenes/Level_1.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BangAnimation_1 = __importDefault(__webpack_require__(/*! ../classes/animation/BangAnimation */ "./src/classes/animation/BangAnimation.ts"));
const Map_1 = __importDefault(__webpack_require__(/*! ../classes/Map */ "./src/classes/Map.ts"));
const Player_1 = __importDefault(__webpack_require__(/*! ../classes/vehicles/player/Player */ "./src/classes/vehicles/player/Player.ts"));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../classes/vehicles/enemies/GroupOfEnemies */ "./src/classes/vehicles/enemies/GroupOfEnemies.ts"));
const Player2_1 = __importDefault(__webpack_require__(/*! ../classes/vehicles/player/Player2 */ "./src/classes/vehicles/player/Player2.ts"));
class Level_1 extends Phaser.Scene {
    constructor() {
        super({ key: "level-1" });
        this._map = null;
        this._player1 = null;
        this._player1Data = null;
        this._player2 = null;
        this._player2Data = null;
        this._enemies = null;
        this._enemiesText = null;
        this._enemiesArray = null;
        this._enemiesCounter = 0;
        this._maxEnemies = 0;
        this._style = null;
    }
    preload() {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this._style = { fontFamily: "RussoOne", fontSize: "40px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 };
    }
    create(data) {
        this._map = new Map_1.default(this, 1);
        this._enemiesArray = [3, 1, 2, 2, 3, 1, 2, 1, 1, 3, 2, 1];
        this._player1Data = data.data.firstPlayer;
        const player = this._map.getPlayer(1);
        let position = { x: player.x, y: player.y };
        this._player1 = new Player_1.default(this, position, "objects", `player_${this._player1Data.vehicle}`, this._map, this._player1Data.shellType, this._player1Data.experience);
        this._maxEnemies = 6;
        const width = this.sys.game.canvas.width;
        this.showFirstPlayerExperience(width);
        if (data.data.secondPlayer) {
            this._player2Data = data.data.secondPlayer;
            const player2 = this._map.getPlayer(2);
            position = { x: player2.x, y: player2.y };
            this._player2 = new Player2_1.default(this, position, "objects", `player_${this._player2Data.vehicle}`, this._map, this._player2Data.shellType, this._player2Data.experience);
            this._enemiesArray.forEach((item, _, array) => array.push(item));
            this._maxEnemies = 10;
            this.showSecondPlayerExperience(width);
        }
        this._enemiesCounter = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 4, this._player1, this._player2);
        this._enemiesText = (0, utils_1.createLevelText)(this, 15, 30, `Enemies: ${this._enemiesCounter}`, this._style);
        this.handleCollisions();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this.cameras.main.startFollow(this._player1);
    }
    showFirstPlayerExperience(width) {
        (0, utils_1.createLevelText)(this, width - 80, 30, "1st", this._style);
        const rank = (0, utils_1.getPlayersRank)(this._player1Data.experience);
        const sprite = this.add.sprite(width - 40, 130, "objects", rank);
        sprite.depth = 10;
    }
    showSecondPlayerExperience(width) {
        (0, utils_1.createLevelText)(this, window.innerWidth - 90, 200, "2nd", this._style);
        const rank = (0, utils_1.getPlayersRank)(this._player2Data.experience);
        const sprite = this.add.sprite(window.innerWidth - 40, 300, "objects", rank);
        sprite.depth = 10;
    }
    handleCollisions() {
        this.physics.add.overlap(this._enemies, this._player2 ? [this._player1.groupOfShells, this._player2.groupOfShells] : this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);
        this.physics.add.collider([...this._map.explosiveObjects, ...this._map.stones].concat(this._player2 ? [this._player2, this._player1] : this._player1), this._enemies, this.handleEnemiesCollision, null, this);
        this.physics.add.collider([...this._enemies.children.getArray(), ...this._map.explosiveObjects, ...this._map.stones], this._player2 ? [this._player1, this._player2] : this._player1, this.handlePlayerCollision, null, this);
    }
    shellsEnemiesCollision(enemy, shell) {
        const position = { x: enemy.x, y: enemy.y };
        BangAnimation_1.default.generateBang(this, position);
        if (enemy.destroyEnemy(shell)) {
            --this._enemies.counter;
            --this._enemiesCounter;
            this._enemiesText.setText(`Enemies: ${this._enemiesCounter}`);
        }
        if (this._enemies.counter <= 0 && (this._player1 || this._player2)) {
            const levelData = {
                firstPlayer: {
                    vehicle: this._player1Data.vehicle,
                    shellType: this._player1Data.shellType,
                    experience: this._player1.experience
                },
                secondPlayer: null
            };
            if (this._player2) {
                levelData.secondPlayer.vehicle = this._player2Data.vehicle;
                levelData.secondPlayer.shellType = this._player2Data.shellType;
                levelData.secondPlayer.experience = this._player2.experience;
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
        if (this._player2 && this._player2.active)
            this._player2.move();
        this.checkMapBounds([...this._enemies.getChildren()].concat(this._player2 ? [this._player1, this._player2] : this._player1));
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
exports["default"] = Level_1;


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
    }
    create(data) {
        this.init();
        data.onePlayer ? this.onePlayerMenu() : this.twoPlayerMenu();
    }
    init() {
        this._data = {
            firstPlayer: {
                vehicle: "tank",
                shellType: "bulletRed2",
                experience: 0
            },
            secondPlayer: {
                vehicle: "tank",
                shellType: "bulletRed2",
                experience: 0
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
            this.scene.start("level-1", { data: this._data });
        });
        const ifv = (0, utils_1.createText)(this, window.innerWidth / 2 + 40, window.innerHeight / 2 + 50, "IFV", style);
        ifv.setInteractive({ useHandCursor: true });
        ifv.once("pointerdown", () => {
            this._data.firstPlayer.vehicle = "ifv";
            this._data.firstPlayer.shellType = "bulletSand1";
            this.scene.start("level-1", { data: this._data });
        });
    }
    twoPlayerMenu() {
        (0, utils_1.createText)(this, window.innerWidth / 2 - 300, 50, "Choose your vehicles", this._style);
        (0, utils_1.createText)(this, window.innerWidth / 2 - 250, window.innerHeight / 2 - 170, "1st player", this._style);
        const tank1 = this.add.sprite(window.innerWidth / 2 + 130, window.innerHeight / 2 - 150, "objects", "player_tank");
        tank1.setInteractive({ useHandCursor: true });
        tank1.on("pointerdown", () => {
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
            this.scene.start("level-1", { data: this._data });
        });
    }
}
exports["default"] = PostStartScene;


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
        this._style = { fontFamily: "RussoOne", fontSize: "55px", color: "#FFFFFF" };
    }
    preload() {
        const sprite = this.add.sprite(0, 0, "logo").setOrigin(0);
        sprite.setX(window.innerWidth / 2 - sprite.width / 2);
        sprite.setY(window.innerHeight / 2 - sprite.height / 2 - 200);
    }
    create() {
        this._onePlayerTextButton = (0, utils_1.createTextButton)(this, 50, "1 player", this._style);
        this._onePlayerTextButton.once("pointerdown", () => {
            this.scene.start("post-start-scene", { onePlayer: true });
        });
        this._twoPlayersTextButton = (0, utils_1.createTextButton)(this, 130, "2 players", this._style, this._onePlayerTextButton.width);
        this._twoPlayersTextButton.once("pointerdown", () => {
            this.scene.start("post-start-scene", { onePlayer: false });
        });
        this._help = (0, utils_1.createTextButton)(this, 210, "Help", this._style, this._onePlayerTextButton.width);
        this._help.on("pointerdown", () => {
            this.scene.start("help-scene");
        });
    }
}
exports["default"] = StartScene;


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
exports.getPlayersRank = exports.createLevelText = exports.createRectangleFrame = exports.createTextButton = exports.createText = exports.handleDirection = exports.PLAYER = exports.ENEMY = exports.DIRECTION = exports.XPOINTS_3_ANIMATION = exports.XPOINTS_2_ANIMATION = exports.XPOINTS_1_ANIMATION = exports.SHOOTING_ANIMATION = exports.SPARKLE_ANIMATION = exports.RADAR_ANIMATION = exports.BANG_ANIMATION = exports.FRICTIONS = exports.GROUND_FRICTION = exports.SPEED = exports.TURNS = exports.PLAYER_SPEED = void 0;
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