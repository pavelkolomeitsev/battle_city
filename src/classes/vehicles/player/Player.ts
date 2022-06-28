import Vehicle from "../Vehicle";
import Map from "../../Map";
import { PLAYER, PLAYER_SPEED, SPEED, StartPosition, TURNS } from "../../../utils/utils";
import GroupOfShells from "../../shells/GroupOfShells";
import Shell from "../../shells/Shell";
import BangAnimation from "../../animation/BangAnimation";
import SparkleAnimation from "../../animation/SparkleAnimation";
import Player2 from "./Player2";
import Headquarter from "../../Headquarter";
import Radar from "../enemies/Radar";
import EnemyVehicle from "../enemies/EnemyVehicle";
import GroupOfEnemies from "../enemies/GroupOfEnemies";
import Turret from "../enemies/Turret";

export default class Player extends Vehicle {
    private _cursor: Phaser.Types.Input.Keyboard.CursorKeys = null;
    private _player2: Player2 = null;
    protected _velocity: number;
    protected _fire: Phaser.Input.Keyboard.Key = null;
    protected _armour: number = 0;
    protected _vehicleType: string = "";
    protected _enemyVehicles: GroupOfEnemies = null;
    protected _enemyTurrets: Turret[] = [];
    protected _enemyTurretPlatforms: Phaser.GameObjects.Sprite[] = [];
    protected _enemiesStatic: Phaser.GameObjects.Sprite[] = [];
    protected _radar: Radar = null;
    protected _headquarterUa: Headquarter = null;
    protected _headquarterRu: Headquarter = null;
    public shootingSound: Phaser.Sound.BaseSound = null;
    public groupOfShells: GroupOfShells = null;
    public id: string = "P1";
    public experience: number = 0;
    public tanksPerLevel: number = 0;
    public bmpPerLevel: number = 0;
    public btrPerLevel: number = 0;
    public turretsPerLevel: number = 0;
    public radarPerLevel: number = 0;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map, shellTexture: string, experience: number) {
        super(scene, position, atlasName, textureName, map);
        this._velocity = 0;
        this._cursor = this._scene.input.keyboard.createCursorKeys(); // take control from keyboard, exactly up and down keys
        this._fire = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO);
        this.experience = experience;
        this.groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, this._map, shellTexture, false, experience); // experience from 0 to 200
        this.setVehicleType(textureName);
    }

    protected setVehicleType(textureName: string): void {
        switch (textureName) {
            case "player_tank":
                this._vehicleType = "player_tank";
                this._armour = PLAYER.TANK.ARMOUR;
                this.shootingSound = this._scene.sound.add('playerTankShooting', {volume: 0.5});
                break;
            case "player_ifv":
                this._vehicleType = "player_ifv";
                this._armour = PLAYER.BMP.ARMOUR;
                this.shootingSound = this._scene.sound.add('playerIfvShooting', {volume: 0.3});
                break;
        }
    }

    public set enemyVehicles(enemyVehicles: GroupOfEnemies) {
        this._enemyVehicles = enemyVehicles;
    }

    public set enemyTurrets(enemyTurrets: Turret[]) {
        this._enemyTurrets = enemyTurrets;
    }

    public set enemyTurretPlatforms(enemyTurretPlatforms: Phaser.GameObjects.Sprite[]) {
        this._enemyTurretPlatforms = enemyTurretPlatforms;
    }

    public set enemiesStatic(enemiesStatic: Phaser.GameObjects.Sprite[]) {
        this._enemiesStatic = enemiesStatic;
    }

    public set player2(player2: Player2) {
        this._player2 = player2;
    }
    
    public set radar(radar: Radar) {
        this._radar = radar;
    }

    public set headquarterUa(headquarterUa: Headquarter) {
        this._headquarterUa = headquarterUa;
    }

    public set headquarterRu(headquarterRu: Headquarter) {
        this._headquarterRu = headquarterRu;
    }

    public handleCollisions(): void {
        // handle shooting on boxes
        this._scene.physics.add.overlap(this._map.explosiveObjects, this.groupOfShells, this.boxesShellsCollision, null, this);
        // handle shooting on stones
        this._scene.physics.add.overlap(this._map.stones, this.groupOfShells, this.stonesShellsCollision, null, this);
        const stopableArray: Phaser.GameObjects.Sprite[] = [...this._map.stones, ...this._map.explosiveObjects];
        if (this._player2) stopableArray.push(this._player2);
        if (this._radar) stopableArray.push(this._radar);
        if (this._headquarterUa) stopableArray.push(this._headquarterUa);
        if (this._headquarterRu) stopableArray.push(this._headquarterRu);
        // handle stop player when collide
        this._scene.physics.add.collider(stopableArray, this, this.handlePlayerStop, null, this);
        // handle player shooting
        this._scene.physics.add.overlap(this._enemyVehicles, this.groupOfShells, this.handlePlayerShootOnEnemyVehicle, null, this);
        this._scene.physics.add.overlap(this._enemyTurretPlatforms, this.groupOfShells, this.handlePlayerShootOnEnemiesTurrets, null, this);
        this._scene.physics.add.overlap(this._enemiesStatic, this.groupOfShells, this.handlePlayerShootOnEnemiesStatic, null, this);
    }

    protected boxesShellsCollision(box: Phaser.GameObjects.Sprite, shell: Shell): void {
        const position: StartPosition = { x: box.x, y: box.y };
        BangAnimation.generateBang(this._scene, position);
        box.destroy();
        shell.setAlive(false);
    }

    protected stonesShellsCollision(stone: Phaser.GameObjects.Sprite, shell: Shell): void {
        const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(shell.angle + 270, +20); // +270 - trick to set sparkle just before the stone
        const position: StartPosition = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
    }

    protected handlePlayerStop(gameObject: Phaser.GameObjects.Sprite, player: Player): void {
        gameObject.body.stop();
        player.body.stop();
    }

    protected handlePlayerShootOnEnemyVehicle(enemy: EnemyVehicle, shell: Shell): void {
        const position: StartPosition = { x: enemy.x, y: enemy.y };
        BangAnimation.generateBang(this._scene, position);
        enemy.destroyEnemy(shell);
        shell.setAlive(false);
    }

    protected handlePlayerShootOnEnemiesTurrets(turretsPlatform: Phaser.GameObjects.Sprite, shell: Shell): void {
        let position: StartPosition = null;
        this._enemyTurrets.forEach((item: Turret) => {
            if (turretsPlatform === item.platform) {
                position = { x: item.turret.x, y: item.turret.y };
                item.destroyTurret(shell);
                BangAnimation.generateBang(this._scene, position);
                shell.setAlive(false);
            }
        });
    }

    protected handlePlayerShootOnEnemiesStatic(enemy: Phaser.GameObjects.Sprite, shell: Shell): void {
        let position: StartPosition = null;
        position = { x: enemy.x, y: enemy.y };
        if (enemy instanceof Radar) {
            enemy.destroyRadar(shell);
        }
        // if (enemy.frame.name === "platform1") {
        //     (enemy as Radar).destroyRadar();
        // }
        // else if (enemy.frame.name === "headquarterRu") {
        //     (enemy as Headquarter).destroyHeadquarter();
        //     this._headquarterRu = null;
        // }
        else if (enemy instanceof Headquarter) {
            enemy.destroyHeadquarter();
            this._headquarterRu = null;
        }
        BangAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
    }
    
    protected get direction(): number {
        let direction = PLAYER_SPEED.NONE;

        // if (this._cursor.up.isDown) direction = PLAYER_SPEED.FORWARD;
        if (this._cursor.up.isDown) direction = (this._vehicleType === "player_tank") ? PLAYER.TANK.SPEED : PLAYER.BMP.SPEED;
        // else if (this._cursor.down.isDown) direction = PLAYER_SPEED.BACKWARD;
        else if (this._cursor.down.isDown) direction = (this._vehicleType === "player_tank") ? -PLAYER.TANK.SPEED : -PLAYER.BMP.SPEED;
        
        return direction;
    }

    // set the vehicle`s speed
    protected get velocity(): number {
        const vehicleSpeed = Math.abs(this._velocity); // make the speed absolute, without negative meaning
        const maxSpeed = this.getMaxSpeed();
        // if the player clicks on the key Up or Down and
        // current vehicle`s speed is less than max speed (10)
        // increase the vehicle`s speed by multipling acceleration with direction, which can be negative or positive

        if (this.direction && vehicleSpeed < maxSpeed) {
            this._velocity += this.direction;
        }
        else if ((this.direction && vehicleSpeed > maxSpeed) || (!this.direction && vehicleSpeed > 0)) { // if the player doesn`t click on the key Up or Down and
            this._velocity -= this._velocity; // current vehicle`s speed is more than max speed (10) ->
            // decrease the vehicle`s speed by multipling acceleration with previous direction, which can be negative or positive
        }
        return this._velocity;
    }

    protected get turn(): number {
        let turn = TURNS.NONE;

        if (this._cursor.right.isDown) turn = TURNS.RIGHT;
        else if (this._cursor.left.isDown) turn = TURNS.LEFT;
        
        return turn;
    }

    protected getMaxSpeed(): number {
        return SPEED.BASIC * this._map.getTileFriction(this);
    }

    // set the vehicle`s angle, when the vehicle is turning to the right or to the left
    public getAngle(): number {
        return this.angle + this.turn;
    }

    protected getVelocityFromAngle(): Phaser.Math.Vector2{ // get sprite`s speed with account of sprite`s angle
        const vector2 = new Phaser.Math.Vector2();
        // vector2 дает нам правильное смещение картинки/спрайта по оси х/у
        // первый параметр - текущий угол картинки (по умолчанию 90 град. то есть вправо). Машинка смотрит вверх, поэтому нужно подправить угол
        // второй параметр - ускорение картинки (положительное/отрицатильное). То есть или вперед, или назад
        return vector2.setToPolar(this.rotation - Math.PI/2, this.velocity);
    }

    public fire(): void {
        if (this.groupOfShells) {
            this.groupOfShells.createFire(this);
        }
    }

    public move(): void {
        // the vehicle is moving with account of turn`s angle
        this.setAngle(this.getAngle());
        const velocity = this.getVelocityFromAngle();
        this.body?.setVelocity(velocity.x, velocity.y);

        if (this._fire.isDown && this) this.fire();
    }

    public setAlive(status: boolean): void {
        this.body.enable = status;
        this.setVisible(status);
        this.setActive(status);
    }

    public destroyPlayer(shell: Shell): void {
        this._armour -= shell.damage;
        if (this._vehicleType === "player_tank") {
            if ((this._armour < 100) && (this._armour >= 50)) {
                this.setTexture("objects", "player_tank1");
            } else if ((this._armour < 50) && (this._armour > 0)) {
                this.setTexture("objects", "player_tank2");
            } else if (this._armour <= 0) {
                this._scene.events.emit("first_player_dead");
                this.destroy();
            }
        } else if (this._vehicleType === "player_ifv") {
            if ((this._armour < 77) && (this._armour >= 40)) {
                this.setTexture("objects", "player_ifv1");
            } else if ((this._armour < 40) && (this._armour > 0)) {
                this.setTexture("objects", "player_ifv2");
            } else if (this._armour <= 0) {
                this._scene.events.emit("first_player_dead");
                this.destroy();
            }
        }
    }
}