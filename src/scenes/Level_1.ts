import BangAnimation from "../classes/animation/BangAnimation";
import Map from "../classes/Map";
import Player from "../classes/vehicles/player/Player";
import Shell from "../classes/shells/Shell";
import { createLevelText, getPlayersRank, handleDirection, LevelData, StartPosition } from "../utils/utils";
import GroupOfEnemies from "../classes/vehicles/enemies/GroupOfEnemies";
import EnemyVehicle from "../classes/vehicles/enemies/EnemyVehicle";
import Player2 from "../classes/vehicles/player/Player2";

export default class Level_1 extends Phaser.Scene {
    private _map: Map = null;
    private _levelData: LevelData = null;
    private _player1: Player = null;
    private _player2: Player2 = null;
    private _enemies: GroupOfEnemies = null;
    private _enemiesText: Phaser.GameObjects.Text = null;
    private _enemiesArray: number[] = null;
    private _enemiesCounter: number = 0;
    private _maxEnemies: number = 0;
    private _style: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _fightingMelody: Phaser.Sound.BaseSound = null;
    
    constructor() {super({key: "level-1"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this._style = { fontFamily: "RussoOne", fontSize: "40px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 };
        this._fightingMelody = this.sound.add("fightMelody", {volume: 0.1, loop: true});
    }

    protected create({data}): void {
        this._map = new Map(this, 1);
        this._levelData = data;
        // add all enemies 1 - enemy BTR, 2 - enemy BMP, 3 - enemy tank, count reverse! number of bases on each level is different!!!
        this._enemiesArray = [3, 1, 2, 2, 3, 1, 2, 1, 1, 3, 2, 1];
        // add player/s
        const player = this._map.getPlayer(1);
        let position: StartPosition = {x: player.x, y: player.y};
        this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
        this._maxEnemies = 6;
        const width: number = this.sys.game.canvas.width;
        this.showFirstPlayerExperience(width);
        if (this._levelData.secondPlayer) {
            const player2 = this._map.getPlayer(2);
            position = {x: player2.x, y: player2.y};
            this._player2 = new Player2(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
            this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if there are two players -> twice enemies
            this._maxEnemies = 10;
            // create exp level 2 player
            this.showSecondPlayerExperience(width);
        }
        this._enemiesCounter = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 4, this._player1, this._player2);
        this._enemiesText = createLevelText(this, 15, 30, `Enemies: ${this._enemiesCounter}`, this._style);
        this.handleCollisions();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this.cameras.main.startFollow(this._player1); // set camera to center on the player`s tank

        this.events.once("first_player_dead", this.firstPlayerDead, this);
        this.events.once("second_player_dead", this.secondPlayerDead, this);
        this._fightingMelody.play();
    }

    private showFirstPlayerExperience(width: number): void {
        createLevelText(this, width - 80, 30, "1st", this._style);
        const rank: string = getPlayersRank(this._levelData.firstPlayer.experience);
        const sprite: Phaser.GameObjects.Sprite = this.add.sprite(width - 40, 130, "objects", rank);
        sprite.depth = 10;
    }

    private showSecondPlayerExperience(width: number): void {
        createLevelText(this, width - 90, 200, "2nd", this._style);
        const rank: string = getPlayersRank(this._levelData.secondPlayer.experience);
        const sprite: Phaser.GameObjects.Sprite = this.add.sprite(window.innerWidth - 40, 300, "objects", rank);
        sprite.depth = 10;
    }

    private handleCollisions(): void {
        // player shoots all enemies
        this.physics.add.overlap(this._enemies, this._player2 ? [this._player1.groupOfShells, this._player2.groupOfShells] : this._player1.groupOfShells, this.shellsEnemiesCollision, null, this);
        // handle enemies vs simple collision (not move objects)                                          
        this.physics.add.collider([...this._map.explosiveObjects, ...this._map.stones].concat(this._player2 ? [this._player2, this._player1] : this._player1), this._enemies, this.handleEnemiesCollision, null, this);
        this.physics.add.collider([...this._enemies.children.getArray(), ...this._map.explosiveObjects, ...this._map.stones], this._player2 ? [this._player1, this._player2] : this._player1, this.handlePlayerCollision, null, this);
    }

    private shellsEnemiesCollision(enemy: EnemyVehicle, shell: Shell): void {
        const position: StartPosition = { x: enemy.x, y: enemy.y };
        BangAnimation.generateBang(this, position);
        if (enemy.destroyEnemy(shell)) {
            --this._enemies.counter;
            --this._enemiesCounter;
            this._enemiesText.setText(`Enemies: ${this._enemiesCounter}`);
        }
        if (this._enemiesCounter <= 0) {
            // create LevelData and pass it to the next scene
            this._levelData.nextLevelNumber = "level-2";
            this._levelData.nextLevelName = "First Blood";
            if (this._player1 && this._levelData.firstPlayer) {
                this._levelData.firstPlayer.experience = this._player1.experience;
                this._levelData.firstPlayer.tanksPerLevel = this._player1.tanksPerLevel;
                this._levelData.firstPlayer.bmpPerLevel = this._player1.bmpPerLevel;
                this._levelData.firstPlayer.btrPerLevel = this._player1.btrPerLevel;
            }
            if (this._player2 && this._levelData.secondPlayer) {
                this._levelData.secondPlayer.experience = this._player2.experience;
                this._levelData.secondPlayer.tanksPerLevel = this._player2.tanksPerLevel;
                this._levelData.secondPlayer.bmpPerLevel = this._player2.bmpPerLevel;
                this._levelData.secondPlayer.btrPerLevel = this._player2.btrPerLevel;
            }
            this._fightingMelody.stop();
            this.scene.start("postlevel-scene", { data: this._levelData });
        }

        // if (enemy instanceof Radar) {
        //     this._radar.destroy();
        // } else if (enemy.frame.name === "platform") {
        //     this._turret.destroyTurret(shell);
        // } else if (enemy instanceof EnemyVehicle) {
        //     if (enemy.destroyEnemy(shell)) {
        //         --this._enemies.counter;
        //     }
        // }
        
        shell.setAlive(false);
    }

    private handleEnemiesCollision(gameObject: Phaser.GameObjects.Sprite, enemy: EnemyVehicle): void {
        handleDirection(enemy);
        enemy.changeDirection();
    }

    private handlePlayerCollision(gameObject: Phaser.GameObjects.Sprite, player: Player): void {
        player.body.stop();
    }

    private firstPlayerDead(): void {
        // if singleplayer game
        if (!this._levelData.multiplayerGame) this.scene.start("gameover-scene");
        // if multiplayer game and second player is alive
        else if (this._levelData.multiplayerGame && this._levelData.secondPlayer) this._levelData.firstPlayer = null;
        // if multiplayer game and second player is dead
        else if (this._levelData.multiplayerGame && !this._levelData.secondPlayer) this.scene.start("gameover-scene");
    }

    private secondPlayerDead(): void {
        this._levelData.secondPlayer = null;
        if (!this._levelData.firstPlayer) this.scene.start("gameover-scene");
    }

    // see docs -> Scene.Methods
    update(time: number, delta: number): void {
        if (this._player1.active) this._player1.move();
        if (this._player2 && this._player2.active) this._player2.move();
        // if (this._turret.turret && this._player1.active) {
        //     const isPlayerNear: boolean = this._map.checkPlayersPosition(this._radar, this._player1);
        //     this._turret.runTurret(this._player1, isPlayerNear);
        // }
        this.checkMapBounds([...this._enemies.getChildren()].concat(this._player2 ? [this._player1, this._player2] : this._player1));
    }

    private checkMapBounds(vehicles: Phaser.GameObjects.GameObject[]): void {
        if (vehicles && vehicles.length > 0) {
            for (let i = 0; i < vehicles.length; i++) {
                if (!vehicles[i].body) continue;
        
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