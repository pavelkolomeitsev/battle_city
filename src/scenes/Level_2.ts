import Map from "../classes/Map";
import Player from "../classes/vehicles/player/Player";
import { createLevelText, createText, getPlayersRank, LevelData, StartPosition } from "../utils/utils";
import GroupOfEnemies from "../classes/vehicles/enemies/GroupOfEnemies";
import Player2 from "../classes/vehicles/player/Player2";
import Turret from "../classes/vehicles/enemies/Turret";

export default class Level_2 extends Phaser.Scene {
    private _map: Map = null;
    private _levelData: LevelData = null;
    private _player1: Player = null;
    private _player2: Player2 = null;
    private _enemies: GroupOfEnemies = null;
    private _turret1: Turret = null;
    private _turret2: Turret = null;
    private _enemiesText: Phaser.GameObjects.Text = null;
    private _finishText: Phaser.GameObjects.Text = null;
    private _enemiesArray: number[] = null;
    private _enemiesCounter: number = 0;
    private _maxEnemies: number = 0;
    private _style: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _fightingMelody: Phaser.Sound.BaseSound = null;
    
    constructor() {super({key: "level-2"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this._style = { fontFamily: "RussoOne", fontSize: "40px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 };
        this._fightingMelody = this.sound.add("fightMelody", {volume: 0.1, loop: true});
    }

    protected create({ data }): void {
        const width: number = this.sys.game.canvas.width;
        this._map = new Map(this, 2);
        this._levelData = data;
        // add all enemies 1 - enemy BTR, 2 - enemy BMP, 3 - enemy tank, count reverse! number of bases on each level is different!!!
        this._enemiesArray = [3, 1, 2, 2, 3, 1, 3, 1, 2, 2, 3, 1, 2, 1, 1, 3, 2, 1];
        let position: StartPosition = null;
        // add player/s
        if (this._levelData.multiplayerGame && this._levelData.firstPlayer && this._levelData.secondPlayer) {
            this._maxEnemies = 10;
            this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if there are two players -> twice enemies
            const player = this._map.getPlayer(1);
            position = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
            this.showFirstPlayerExperience(width);
            // create 2 player
            const player2 = this._map.getPlayer(2);
            position = {x: player2.x, y: player2.y};
            this._player2 = new Player2(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
            this.showSecondPlayerExperience(width);
        } else if (this._levelData.multiplayerGame && this._levelData.firstPlayer && !this._levelData.secondPlayer) { // if second dead
            this._maxEnemies = 10;
            this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if there are two players -> twice enemies
            const player = this._map.getPlayer(1);
            position = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
            this.showFirstPlayerExperience(width);
        } else if (this._levelData.multiplayerGame && !this._levelData.firstPlayer && this._levelData.secondPlayer) { // if first dead
            this._maxEnemies = 10;
            this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if there are two players -> twice enemies
            const player = this._map.getPlayer(2);
            position = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience); // experience from 0 to 200
            this.showSecondPlayerExperience(width);
        } else {
            const player = this._map.getPlayer(1);
            let position: StartPosition = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
            this._maxEnemies = 6;
            this.showFirstPlayerExperience(width);
        }

        this._enemiesCounter = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2);
        let turretPosition: StartPosition = this._map.getTurretPosition(1);
        this._turret1 = new Turret(this, turretPosition, this._map, this._player1, this._player2, null, 1);
        this._enemiesCounter++;
        turretPosition = this._map.getTurretPosition(2);
        this._turret2 = new Turret(this, turretPosition, this._map, this._player1, this._player2, null, 2);
        this._enemiesCounter++;
        this._enemiesText = createLevelText(this, 15, 30, `Enemies: ${this._enemiesCounter}`, this._style);
        this.listenEvents();

        this._player1.enemyVehicles = this._enemies;
        this._player1.enemyTurrets = [this._turret1, this._turret2];
        this._player1.enemyTurretPlatforms = [this._turret1.platform, this._turret2.platform];
        this._player1.handleCollisions();


        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this.cameras.main.startFollow(this._player1); // set camera to center on the player`s tank
        this._fightingMelody.play();
        this.createFinishText();
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

    private listenEvents(): void {
        this.events.on("first_player_dead", this.firstPlayerDead, this);
        this.events.on("second_player_dead", this.secondPlayerDead, this);
        this.events.on("enemy_dead", this.enemyDead, this);
    }

    private createFinishText(): void {
        this._finishText = createText(this, this.sys.game.canvas.width, this.sys.game.canvas.height + 150, "GAME OVER", { fontFamily: "RussoOne", fontSize: "90px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 });
        this._finishText.setX(this.sys.game.canvas.width / 2 - this._finishText.width / 2);
        this._finishText.depth = 10;
    }

    private enemyDead(toCount: boolean, isHeadquarterRuDestroyed: boolean): void {
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesCounter;
            this._enemiesText.setText(`Enemies: ${this._enemiesCounter}`);
        }
        if (this._enemiesCounter <= 0) {
            // create LevelData and pass it to the next scene
            this._levelData.nextLevelNumber = "level-3";
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

    private firstPlayerDead(): void {
        this.runTween();
        // // if singleplayer game
        // if (!this._levelData.multiplayerGame) this.runTween();
        // // if multiplayer game and second player is alive
        // else if (this._levelData.multiplayerGame && this._levelData.secondPlayer) this._levelData.firstPlayer = null;
        // // if multiplayer game and second player is dead
        // else if (this._levelData.multiplayerGame && !this._levelData.secondPlayer) this.runTween();
    }

    private secondPlayerDead(): void {
        // this._levelData.secondPlayer = null;
        // if (!this._levelData.firstPlayer) this.runTween();
        this.runTween();
    }

    private runTween(): void {
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

    // see docs -> Scene.Methods
    update(): void {
        if (this._player1 && this._player1.active) this._player1.move();
        if (this._player2 && this._player2.active) this._player2.move();
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