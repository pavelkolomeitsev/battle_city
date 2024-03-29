import { ENEMY, StartPosition } from "../../../utils/utils";
import GroupOfShells from "../../shells/GroupOfShells";
import Map from "../../Map";
import Player from "../player/Player";
import Shell from "../../shells/Shell";
import BangAnimation from "../../animation/BangAnimation";
import SparkleAnimation from "../../animation/SparkleAnimation";
import Player2 from "../player/Player2";
import XpointsAnimation from "../../animation/XpointsAnimation";
import Radar from "./Radar";
import EnemyVehicle from "./EnemyVehicle";
import GroupOfEnemies from "./GroupOfEnemies";

export default class Turret {
    private static idCounter: number = 0;

    private _scene: Phaser.Scene = null;
    private _map: Map = null;
    private _armour: number = 0;
    private _player1: Player = null;
    private _player2: Player2 = null;
    private _players: Player[] = [];
    private _groupOfShells: GroupOfShells = null;
    private _baseNumber: number = 1;
    private _radar: Radar = null;
    public platform: Phaser.GameObjects.Sprite = null;
    public turret: Phaser.GameObjects.Sprite = null;
    public isFiring: boolean = true;
    public id: number = 0;

    constructor(scene: Phaser.Scene, position: StartPosition, map: Map, enemies: GroupOfEnemies, player1: Player, player2: Player2 = null, radar: Radar = null, baseNumber: number = 1) {
        this._scene = scene;
        this._map = map;
        this._armour = ENEMY.TURRET.ARMOUR;
        this._player1 = player1;
        this._player2 = player2;
        if (player1) this._players.push(player1);
        if (player2) this._players.push(player2);
        this._baseNumber = baseNumber;
        this._radar = radar;
        this.init(position, this._map, ENEMY.TURRET.SHELL_TYPE);
        // handle shooting on player
        this._scene.physics.add.overlap(this._players, this._groupOfShells, this.shellsPlayerCollision, null, this);
        // handle shooting on boxes
        this._scene.physics.add.overlap(this._map.explosiveObjects, this._groupOfShells, this.boxesShellsCollision, null, this);
        // handle shooting on stones
        this._scene.physics.add.overlap(this._map.stones, this._groupOfShells, this.stonesShellsCollision, null, this);
        // handle enemy vehicles collisions
        const stopableArray: Phaser.GameObjects.GameObject[] = enemies.getChildren();
        this._scene.physics.add.collider(stopableArray, this.platform, this.handleCollision, null, this);
        this.id = ++Turret.idCounter;
        this._scene.events.on("update", this.runTurret, this);
    }

    public set radar(radar: Radar) {
        this._radar = radar;
    }
    
    private init(position: StartPosition, map: Map, shellTexture: string): void {
        this.platform = new Phaser.GameObjects.Sprite(this._scene, position.x, position.y, "objects", "platform");
        this._scene.add.existing(this.platform);
        this._scene.physics.add.existing(this.platform);
        this.platform.body.enable = true;
        this.platform.body.setImmovable(true);
        this.turret = new Phaser.GameObjects.Sprite(this._scene, position.x, position.y, "objects", "turret");
        this._scene.add.existing(this.turret);
        this._scene.physics.add.existing(this.turret);
        this.turret.body.enable = true;
        this._groupOfShells = new GroupOfShells(this._scene.physics.world, this._scene, map, shellTexture);
    }

    private shellsPlayerCollision(player: Player, shell: Shell): void {
        const position: StartPosition = { x: player.x, y: player.y };
        BangAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
        player.destroyPlayer(shell);
    }

    private boxesShellsCollision(box: Phaser.GameObjects.Sprite, shell: Shell): void {
        const position: StartPosition = { x: box.x, y: box.y };
        BangAnimation.generateBang(this._scene, position);
        box.destroy();
        shell.setAlive(false);
    }

    private stonesShellsCollision(stone: Phaser.GameObjects.Sprite, shell: Shell): void {
        const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(shell.angle + 270, +20); // +270 - trick to set sparkle just before the stone
        const position: StartPosition = { x: shell.x + vector.x, y: shell.y + vector.y };
        SparkleAnimation.generateBang(this._scene, position);
        shell.setAlive(false);
    }

    private handleCollision(enemy: EnemyVehicle, platform: Phaser.GameObjects.Sprite): void {
        // goToOpositeDirection(enemy);
        // goToAnotherDirection(enemy)
        enemy.goToAnotherDirection();
    }

    public runTurret(): void {
        if (!this._radar) { // if it`s no radar, there are two turrets and two check areas
            this._players.forEach((player: Player) => this.run(player, this._map.checkPlayersPositionNoRadar(player, this._baseNumber)));
        } else {
            this._players.forEach((player: Player) => this.run(player, this._map.checkPlayersPosition(this._radar, player)));
        }
    }

    private run(player: Player, isPlayerNear: boolean): void {
        isPlayerNear ? this.watchAndFire(player) : this.watch(player);
    }

    private watch(player: Player): void {
        this.getCorrectAngle(player);
    }

    private watchAndFire(player: Player): void {
        this.getCorrectAngle(player);
        this.fire();
    }

    private getCorrectAngle(player: Player): void {
        if (this.turret && player) {
            const angle = Phaser.Math.Angle.Between(this.turret.x, this.turret.y, player.x, player.y);
            this.turret.rotation = angle - Math.PI / 2; // Math.PI / 2 - trick to turn turret oposite to the tank
        }
    }

    private fire(): void {
        if (this._groupOfShells && this.isFiring) this._groupOfShells.createFire(this.turret);
    }

    public destroyTurret(shell: Shell): void {
        this._armour -= shell.damage;
        if ((this._armour <= 130) && (this._armour > 60)) {
            this.turret.setTexture("objects", "turret_2");
        } else if ((this._armour <= 60) && (this._armour > 0)) {
            this.turret.setTexture("objects", "turret_1");
        } else if (this._armour <= 0) {
            this.turret.destroy();
            this.turret = null;
            this.platform.destroy();
            this.platform = null;
            this._groupOfShells = null;
            this._radar = null;
            const id: string = (shell.parentSprite as Player).id;
            const position: StartPosition = { x: shell.x, y: shell.y };
            XpointsAnimation.generateAnimation(this._scene, position, 3);
            this.calculateExperiencePoints(id, 1.1);
            this._scene.events.off("update", this.runTurret, this);
            this._scene.events.emit("enemy_dead", true, false);
        }
    }

    private calculateExperiencePoints(id: string, points: number): void {
        if (this._player1 && id === "P1") {
            this._player1.experience += points;
            this._player1.turretsPerLevel++;
        } else if (this._player2 && id === "P2") {
            this._player2.experience += points;
            this._player2.turretsPerLevel++;
        }
    }
}