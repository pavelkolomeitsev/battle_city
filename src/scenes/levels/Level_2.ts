import Map from "../../classes/Map";
import Player from "../../classes/vehicles/player/Player";
import { createLevelText, showPlayerExperience, StartPosition } from "../../utils/utils";
import GroupOfEnemies from "../../classes/vehicles/enemies/GroupOfEnemies";
import Player2 from "../../classes/vehicles/player/Player2";
import Turret from "../../classes/vehicles/enemies/Turret";
import Level from "./Level";

export default class Level_2 extends Level {
    private _turret1: Turret = null;
    private _turret2: Turret = null;
    
    constructor() {super("level-2");}

    protected create({ data }): void {
        this._map = new Map(this, 2);
        this._levelData = data;
        // add all enemies 1 - enemy BTR, 2 - enemy BMP, 3 - enemy tank, count reverse! number of bases on each level is different!!!
        this._enemiesArray = [3, 1, 2, 3, 1, 3, 2, 1, 2, 1, 3, 2, 1];
        let position: StartPosition = null;
        // add player/s
        if (this._levelData.multiplayerGame) {
            this._maxEnemies = 8;
            this._enemiesArray.forEach((item: number, _, array) => array.push(item)); // if it`s multiplayerGame -> twice enemies

            if (this._levelData.firstPlayer) {
                const player = this._map.getPlayer(1);
                position = { x: player.x, y: player.y };
                this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
                showPlayerExperience(this, this._style, true, this._levelData.firstPlayer.experience);
            }
            if (this._levelData.secondPlayer) {
                const player2 = this._map.getPlayer(2);
                position = {x: player2.x, y: player2.y};
                this._player2 = new Player2(this, position, "objects", `player_${this._levelData.secondPlayer.vehicle}`, this._map, this._levelData.secondPlayer.shellType, this._levelData.secondPlayer.experience);
                showPlayerExperience(this, this._style, false, this._levelData.secondPlayer.experience);
            }
        } else {
            const player = this._map.getPlayer(1);
            let position: StartPosition = { x: player.x, y: player.y };
            this._player1 = new Player(this, position, "objects", `player_${this._levelData.firstPlayer.vehicle}`, this._map, this._levelData.firstPlayer.shellType, this._levelData.firstPlayer.experience); // experience from 0 to 200
            showPlayerExperience(this, this._style, true, this._levelData.firstPlayer.experience);
        }

        this._enemiesLeft = this._enemiesArray.length;
        this._enemies = new GroupOfEnemies(this.physics.world, this, this._map, this._enemiesArray, this._maxEnemies, 3, this._player1, this._player2);
        let turretPosition: StartPosition = this._map.getTurretPosition(1);
        this._turret1 = new Turret(this, turretPosition, this._map, this._enemies, this._player1, this._player2, null, 1);
        this._enemiesLeft++;
        turretPosition = this._map.getTurretPosition(2);
        this._turret2 = new Turret(this, turretPosition, this._map, this._enemies, this._player1, this._player2, null, 2);
        this._enemiesLeft++;
        this._enemiesText = createLevelText(this, 15, 30, `Enemies: ${this._enemiesLeft}`, this._style);
        
        if (this._player1) {
            this._players.push(this._player1);
            this._player1.enemyVehicles = this._enemies;
            this._player1.enemyTurrets = [this._turret1, this._turret2];
            this._player1.enemyTurretPlatforms = [this._turret1.platform, this._turret2.platform];
            if (this._player2) this._player1.player2 = this._player2;
            this._player1.handleCollisions();
        }
        if (this._player2) {
            this._players.push(this._player2);
            this._player2.enemyVehicles = this._enemies;
            this._player2.enemyTurrets = [this._turret1, this._turret2];
            this._player2.enemyTurretPlatforms = [this._turret1.platform, this._turret2.platform];
            if (this._player1) this._player2.player1 = this._player1;
            this._player2.handleCollisions();
        }

        this.listenEvents();
        this.cameras.main.setBounds(0, 0, this._map.tilemap.widthInPixels, this._map.tilemap.heightInPixels); // set map`s bounds as camera`s bounds
        this._player1 ? this.cameras.main.startFollow(this._player1) : this.cameras.main.startFollow(this._player2); // set camera to center on the player`s tank
        this._fightingMelody.play();
        this.createFinishText();
    }

    protected listenEvents(): void {
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

    protected enemyDead(toCount: boolean): void {
        if (toCount) {
            --this._enemies.counter;
            --this._enemiesLeft;
            this._enemiesText.setText(`Enemies: ${this._enemiesLeft}`);
        }
        if (this._enemiesLeft <= 0) {
            // create LevelData and pass it to the next scene
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