import Headquarter from "../classes/Headquarter";
import Map from "../classes/Map";
import GroupOfEnemies from "../classes/vehicles/enemies/GroupOfEnemies";
import Radar from "../classes/vehicles/enemies/Radar";
import Turret from "../classes/vehicles/enemies/Turret";
import Player from "../classes/vehicles/player/Player";
import Player2 from "../classes/vehicles/player/Player2";
import { createLevelText, createText, getPlayersRank, LevelData, showPlayerExperience, StartPosition } from "../utils/utils";

export default class Level_3 extends Phaser.Scene {
    private _map: Map = null;
    private _levelData: LevelData = null;
    private _player1: Player = null;
    private _player2: Player2 = null;
    private _enemies: GroupOfEnemies = null;
    private _turret: Turret = null;
    private _radar: Radar = null;
    private _headquarterRu: Headquarter = null;
    private _headquarterUa: Headquarter = null;
    private _enemiesText: Phaser.GameObjects.Text = null;
    private _finishText: Phaser.GameObjects.Text = null;
    private _enemiesArray: number[] = null;
    private _enemiesLeft: number = 0;
    private _maxEnemies: number = 6;
    private _style: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _fightingMelody: Phaser.Sound.BaseSound = null;
    
    constructor() {super({key: "level-3"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this._style = { fontFamily: "RussoOne", fontSize: "40px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 };
        this._fightingMelody = this.sound.add("fightMelody", {volume: 0.1, loop: true});
    }

    protected create({data}): void {
        const width: number = this.sys.game.canvas.width;
        this._map = new Map(this, 3);
        this._levelData = data;
        // add all enemies 1 - enemy BTR, 2 - enemy BMP, 3 - enemy tank, count reverse! number of bases on each level is different!!!
        this._enemiesArray = [3, 1, 2, 3, 2, 1, 1, 3, 2, 1, 1, 3, 2, 1, 2, 2, 3, 1, 2, 1];
        let position: StartPosition = null;
        // add player/s
        if (this._levelData.multiplayerGame && this._levelData.firstPlayer && this._levelData.secondPlayer) {
            this._maxEnemies = 10;
            this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if there are two players -> twice enemies
            const player = this._map.getPlayer(1);
            position = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
            showPlayerExperience(this, this._style, true, this._levelData.firstPlayer.experience);
            // this.showFirstPlayerExperience(width);
            // create 2 player
            const player2 = this._map.getPlayer(2);
            position = {x: player2.x, y: player2.y};
            this._player2 = new Player2(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
            showPlayerExperience(this, this._style, false, this._levelData.secondPlayer.experience);
            // this.showSecondPlayerExperience(width);
        } else if (this._levelData.multiplayerGame && this._levelData.firstPlayer && !this._levelData.secondPlayer) { // if second dead
            this._maxEnemies = 10;
            this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if there are two players -> twice enemies
            const player = this._map.getPlayer(1);
            position = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
            showPlayerExperience(this, this._style, true, this._levelData.firstPlayer.experience);
            // this.showFirstPlayerExperience(width);
        } else if (this._levelData.multiplayerGame && !this._levelData.firstPlayer && this._levelData.secondPlayer) { // if first dead
            this._maxEnemies = 10;
            this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if there are two players -> twice enemies
            const player = this._map.getPlayer(2);
            position = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience); // experience from 0 to 200
            showPlayerExperience(this, this._style, false, this._levelData.secondPlayer.experience);
            // this.showSecondPlayerExperience(width);
        } else {
            const player = this._map.getPlayer(1);
            let position: StartPosition = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
            showPlayerExperience(this, this._style, true, this._levelData.firstPlayer.experience);
            // this.showFirstPlayerExperience(width);
        }


        // const player = this._map.getPlayer(1);
        // let position: StartPosition = {x: player.x, y: player.y};
        // this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
        // this._maxEnemies = 6;
        // this.showFirstPlayerExperience(width);
        // if (this._levelData.secondPlayer) {
        //     const player2 = this._map.getPlayer(2);
        //     position = {x: player2.x, y: player2.y};
        //     this._player2 = new Player2(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
        //     this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if there are two players -> twice enemies
        //     this._maxEnemies = 10;
        //     // create exp level 2 player
        //     this.showSecondPlayerExperience(width);
        // }
        this._headquarterRu = new Headquarter(this, this._map.getHeadquarterPosition(true), "objects", "headquarterRu");
        this._headquarterUa = new Headquarter(this, this._map.getHeadquarterPosition(false), "objects", "headquarterUa");
        this._enemiesLeft = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2, this._headquarterUa, this._headquarterRu);
        let turretPosition: StartPosition = this._map.getTurretPosition(1);
        this._turret = new Turret(this, turretPosition, this._map, this._enemies, this._player1, this._player2);
        this._enemiesLeft++;
        turretPosition = this._map.getRadarPosition();
        this._radar = new Radar(this, turretPosition, "objects", "platform1", this._enemies, this._player1, this._player2);
        this._turret.radar = this._radar;
        this._enemiesLeft++;
        this._enemiesText = createLevelText(this, 15, 30, `Enemies: ${this._enemiesLeft}`, this._style);
        this.listenEvents();
        
        this._player1.enemyVehicles = this._enemies;
        this._player1.enemyTurrets = [this._turret];
        this._player1.enemyTurretPlatforms = [this._turret.platform];
        this._player1.enemiesStatic = [this._radar, this._headquarterRu, this._headquarterUa];
        this._player1.handleCollisions();

        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this.cameras.main.startFollow(this._player1); // set camera to center on the player`s tank
        this._fightingMelody.play();
        this.createFinishText();
    }

    // private showFirstPlayerExperience(width: number): void {
    //     createLevelText(this, width - 80, 30, "1st", this._style);
    //     const rank: string = getPlayersRank(this._levelData.firstPlayer.experience);
    //     const sprite: Phaser.GameObjects.Sprite = this.add.sprite(width - 40, 130, "objects", rank);
    //     sprite.depth = 10;
    // }

    // private showSecondPlayerExperience(width: number): void {
    //     createLevelText(this, width - 90, 200, "2nd", this._style);
    //     const rank: string = getPlayersRank(this._levelData.secondPlayer.experience);
    //     const sprite: Phaser.GameObjects.Sprite = this.add.sprite(window.innerWidth - 40, 300, "objects", rank);
    //     sprite.depth = 10;
    // }

    private listenEvents(): void {
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

    private createFinishText(): void {
        this._finishText = createText(this, this.sys.game.canvas.width, this.sys.game.canvas.height + 150, "GAME OVER", { fontFamily: "RussoOne", fontSize: "90px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 });
        this._finishText.setX(this.sys.game.canvas.width / 2 - this._finishText.width / 2);
        this._finishText.depth = 10;
    }

    private enemyDead(toCount: boolean, isHeadquarterRuDestroyed: boolean): void {
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesLeft;
            this._enemiesText.setText(`Enemies: ${this._enemiesLeft}`);
        }
        if (this._enemiesLeft <= 0 && isHeadquarterRuDestroyed) {
            // create LevelData and pass it to the next scene
            this._levelData.nextLevelNumber = "level-4";
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
            this.scene.start("postlevel-scene", { data: this._levelData });
        }
    }

    private firstPlayerDead(): void {
        this.events.removeListener("first_player_dead");
        this.events.removeListener("second_player_dead");
        this.events.removeListener("enemy_dead");
        this.runTween();
        // if singleplayer game
        // if (!this._levelData.multiplayerGame) this.runTween();
        // if multiplayer game and second player is alive
        // else if (this._levelData.multiplayerGame && this._levelData.secondPlayer) this._levelData.firstPlayer = null;
        // if multiplayer game and second player is dead
        // else if (this._levelData.multiplayerGame && !this._levelData.secondPlayer) this.runTween();
    }

    private secondPlayerDead(): void {
        this.events.removeListener("first_player_dead");
        this.events.removeListener("second_player_dead");
        this.events.removeListener("enemy_dead");
        this.runTween();
        // this._levelData.secondPlayer = null;
        // if (!this._levelData.firstPlayer) this.runTween();
    }

    private headquarterDestroyed(): void {
        this._headquarterUa = null;
        if (!this._headquarterUa) this.runTween();
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