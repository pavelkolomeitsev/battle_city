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
const GroupOfShells_1 = __importDefault(__webpack_require__(/*! ./shells/GroupOfShells */ "./src/classes/shells/GroupOfShells.ts"));
class Player extends Vehicle_1.default {
    constructor(scene, position, atlasName, textureName, map, shellTexture, enemy) {
        super(scene, position, atlasName, textureName, map);
        this._cursor = null;
        this.groupOfShells = null;
        this._velocity = 0;
        this._cursor = this._scene.input.keyboard.createCursorKeys();
        this.groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, this._map, shellTexture, false);
        this.setSize(400, 400);
    }
    get direction() {
        let direction = utils_1.DIRECTIONS.NONE;
        if (this._cursor.up.isDown)
            direction = utils_1.DIRECTIONS.FORWARD;
        else if (this._cursor.down.isDown)
            direction = utils_1.DIRECTIONS.BACKWARD;
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
}
exports["default"] = Player;


/***/ }),

/***/ "./src/classes/SparkleAnimation.ts":
/*!*****************************************!*\
  !*** ./src/classes/SparkleAnimation.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
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

/***/ "./src/classes/Vehicle.ts":
/*!********************************!*\
  !*** ./src/classes/Vehicle.ts ***!
  \********************************/
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

/***/ "./src/classes/enemies/EnemyVehicle.ts":
/*!*********************************************!*\
  !*** ./src/classes/enemies/EnemyVehicle.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
const BangAnimation_1 = __importDefault(__webpack_require__(/*! ../BangAnimation */ "./src/classes/BangAnimation.ts"));
const GroupOfShells_1 = __importDefault(__webpack_require__(/*! ../shells/GroupOfShells */ "./src/classes/shells/GroupOfShells.ts"));
const SparkleAnimation_1 = __importDefault(__webpack_require__(/*! ../SparkleAnimation */ "./src/classes/SparkleAnimation.ts"));
const Vehicle_1 = __importDefault(__webpack_require__(/*! ../Vehicle */ "./src/classes/Vehicle.ts"));
class EnemyVehicle extends Vehicle_1.default {
    constructor(scene, position, atlasName, textureName, map, player) {
        super(scene, position, atlasName, textureName, map);
        this._vehicleSpeed = 0;
        this._timer = null;
        this._player = null;
        this.isAppear = true;
        this.direction = utils_1.DIRECTION.DOWN;
        this._vehicleSpeed = 70;
        this._player = player;
        this.direction = "down";
        this._groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, this._map, "bulletDark1_outline");
        this._timer = this._scene.time.addEvent({
            delay: 4000,
            loop: true,
            callback: this.changeDirection,
            callbackScope: this
        });
        this._scene.physics.add.overlap([this._player, ...this._map.boxes], this._groupOfShells, this.shellsPlayerCollision, null, this);
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.shellsStoneCollision, null, this);
        this._scene.events.on("update", this.fire, this);
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
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.setVelocity(0, this.velocity);
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
    shellsPlayerCollision(target, shell) {
        const position = { x: shell.x, y: shell.y };
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

/***/ "./src/classes/enemies/GroupOfEnemies.ts":
/*!***********************************************!*\
  !*** ./src/classes/enemies/GroupOfEnemies.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const EnemyVehicle_1 = __importDefault(__webpack_require__(/*! ./EnemyVehicle */ "./src/classes/enemies/EnemyVehicle.ts"));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
class GroupOfEnemies extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, map, enemiesAmount, player) {
        super(world, scene);
        this._scene = null;
        this._map = null;
        this._timer = null;
        this._enemiesAmount = 0;
        this._createdEnemies = 0;
        this._player = null;
        this.counter = 0;
        this._scene = scene;
        this._map = map;
        this._enemiesAmount = enemiesAmount;
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
            this._createdEnemies < this._enemiesAmount ? this.createEnemy() : (_a = this._timer) === null || _a === void 0 ? void 0 : _a.remove();
        }
    }
    createEnemy() {
        const baseNumber = Math.floor(Math.random() * 2) + 1;
        const position = this._map.getBasePosition(baseNumber);
        const enemy = new EnemyVehicle_1.default(this._scene, position, "objects", "tank_sand", this._map, this._player);
        this.add(enemy);
        enemy.moveOut();
        ++this._createdEnemies;
        ++this.counter;
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

/***/ "./src/classes/enemies/Radar.ts":
/*!**************************************!*\
  !*** ./src/classes/enemies/Radar.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
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

/***/ "./src/classes/enemies/Turret.ts":
/*!***************************************!*\
  !*** ./src/classes/enemies/Turret.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const GroupOfShells_1 = __importDefault(__webpack_require__(/*! ../shells/GroupOfShells */ "./src/classes/shells/GroupOfShells.ts"));
class Turret {
    constructor(scene, position, map, shellTexture) {
        this._scene = null;
        this._health = 0;
        this.platform = null;
        this.turret = null;
        this.isFiring = true;
        this._scene = scene;
        this._health = 3;
        this.init(position, map, shellTexture);
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
        this.groupOfShells = new GroupOfShells_1.default(this._scene.physics.world, this._scene, map, shellTexture);
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
        if (this.groupOfShells && this.isFiring)
            this.groupOfShells.createFire(this.turret);
    }
    destroyTurret() {
        --this._health;
        if (this._health > 0) {
            this.turret.setTexture("objects", `turret_${this._health}`);
        }
        else {
            this.turret.destroy();
            this.turret = null;
            this.platform.destroy();
            this.platform = null;
            this._scene = null;
            this.groupOfShells = null;
        }
    }
}
exports["default"] = Turret;


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
        this._scene = scene;
        this._map = map;
        this._texture = texture;
        this._enemy = enemy;
        this._direction = enemy ? 1 : -1;
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
        this._nextShoot = this._scene.time.now + 500;
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
        this._scene = scene;
        this._parentSprite = parentSprite;
        this._map = map;
        this.init();
        this._scene.events.on("update", this.update, this);
    }
    init() {
        this._scene.add.existing(this);
        this._scene.physics.add.existing(this);
        this.body.enable = true;
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
        this.body.setVelocity(vector.x * utils_1.SPEED.FASTEST * 3, vector.y * utils_1.SPEED.FASTEST * 3);
    }
}
exports["default"] = Shell;


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
const BangAnimation_1 = __importDefault(__webpack_require__(/*! ../classes/BangAnimation */ "./src/classes/BangAnimation.ts"));
const Map_1 = __importDefault(__webpack_require__(/*! ../classes/Map */ "./src/classes/Map.ts"));
const Player_1 = __importDefault(__webpack_require__(/*! ../classes/Player */ "./src/classes/Player.ts"));
const Radar_1 = __importDefault(__webpack_require__(/*! ../classes/enemies/Radar */ "./src/classes/enemies/Radar.ts"));
const Turret_1 = __importDefault(__webpack_require__(/*! ../classes/enemies/Turret */ "./src/classes/enemies/Turret.ts"));
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
const GroupOfEnemies_1 = __importDefault(__webpack_require__(/*! ../classes/enemies/GroupOfEnemies */ "./src/classes/enemies/GroupOfEnemies.ts"));
const EnemyVehicle_1 = __importDefault(__webpack_require__(/*! ../classes/enemies/EnemyVehicle */ "./src/classes/enemies/EnemyVehicle.ts"));
const SparkleAnimation_1 = __importDefault(__webpack_require__(/*! ../classes/SparkleAnimation */ "./src/classes/SparkleAnimation.ts"));
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
        this._player1 = new Player_1.default(this, position, "objects", "tank_red", this._map, "bulletRed1_outline", false);
        this._turret = new Turret_1.default(this, this._map.getTurretPosition(), this._map, "bulletDark1_outline");
        this._radar = new Radar_1.default(this, this._map.getRadarPosition(), "objects", "platform1");
        this._enemies = new GroupOfEnemies_1.default(this.physics.world, this, this._map, 20, this._player1);
        this.handleCollisions();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels);
        this.cameras.main.startFollow(this._player1);
    }
    handleCollisions() {
        this.physics.add.overlap([this._turret.platform, this._radar], this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);
        this.physics.add.overlap(this._enemies, this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);
        this.physics.add.overlap(this._map.boxes, [this._player1.groupOfShells, this._turret.groupOfShells], this.boxesShellsCollision, null, this);
        this.physics.add.overlap(this._map.stones, [this._player1.groupOfShells, this._turret.groupOfShells], this.stonesShellsCollision, null, this);
        this.physics.add.overlap(this._turret.groupOfShells, this._player1, this.shellsPlayerCollision, null, this);
        this.physics.add.collider([this._turret.platform, this._radar, this._player1, ...this._map.boxes, ...this._map.stones], this._enemies, this.handleEnemiesCollision, null, this);
        this.physics.add.collider([this._turret.platform, this._radar, ...this._enemies.children.getArray(), ...this._map.boxes, ...this._map.stones], this._player1, this.handlePlayerCollision, null, this);
    }
    boxesShellsCollision(box, shell) {
        const position = { x: box.x, y: box.y };
        BangAnimation_1.default.generateBang(this, position);
        box.destroy();
        shell.setAlive(false);
    }
    stonesShellsCollision(stone, shell) {
        const vector = this.physics.velocityFromAngle(shell.angle + 270, +20);
        const position = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation_1.default.generateBang(this, position);
        shell.setAlive(false);
    }
    shellsPlayerCollision(shell, player) {
        const position = { x: shell.x, y: shell.y };
        BangAnimation_1.default.generateBang(this, position);
        shell.setAlive(false);
        player.setAlive(false);
    }
    shellsEnemiesCollision(enemy, shell) {
        const position = { x: enemy.x, y: enemy.y };
        BangAnimation_1.default.generateBang(this, position);
        if (enemy instanceof Radar_1.default) {
            this._radar.destroy();
        }
        else if (enemy.frame.name === "platform") {
            this._turret.destroyTurret();
        }
        else if (enemy instanceof EnemyVehicle_1.default) {
            enemy.scene.events.off("update", enemy.fire, enemy);
            enemy.destroy();
            --this._enemies.counter;
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
            duration: 500,
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
exports.handleDirection = exports.DIRECTION = exports.SPARKLE_ANIMATION = exports.RADAR_ANIMATION = exports.BANG_ANIMATION = exports.TANKS = exports.ROADS_FRICTION = exports.GROUND_FRICTION = exports.SPEED = exports.TURNS = exports.DIRECTIONS = void 0;
var DIRECTIONS;
(function (DIRECTIONS) {
    DIRECTIONS[DIRECTIONS["NONE"] = 0] = "NONE";
    DIRECTIONS[DIRECTIONS["FORWARD"] = 100] = "FORWARD";
    DIRECTIONS[DIRECTIONS["BACKWARD"] = -100] = "BACKWARD";
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
    SPEED[SPEED["BASIC"] = 150] = "BASIC";
    SPEED[SPEED["FASTER"] = 200] = "FASTER";
    SPEED[SPEED["FASTEST"] = 300] = "FASTEST";
})(SPEED = exports.SPEED || (exports.SPEED = {}));
;
exports.GROUND_FRICTION = 0.4;
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