import BangAnimation from "../classes/animation/BangAnimation";
import Map from "../classes/Map";
import Player from "../classes/vehicles/player/Player";
import Shell from "../classes/shells/Shell";
import { BANG_ANIMATION, createLevelText, createText, getPlayersRank, handleDirection, LevelData, SPARKLE_ANIMATION, StartPosition } from "../utils/utils";
import GroupOfEnemies from "../classes/vehicles/enemies/GroupOfEnemies";
import EnemyVehicle from "../classes/vehicles/enemies/EnemyVehicle";
import Player2 from "../classes/vehicles/player/Player2";

export default class Level_1 extends Phaser.Scene {
    private _map: Map = null;
    private _player1: Player = null;
    private _player1Data: any = null;
    private _player2: Player2 = null;
    private _player2Data: any = null;
    private _enemies: GroupOfEnemies = null;
    private _enemiesText: Phaser.GameObjects.Text = null;
    private _enemiesArray: number[] = null;
    private _enemiesCounter: number = 0;
    private _maxEnemies: number = 0;
    private _style: Phaser.Types.GameObjects.Text.TextStyle = null;
    
    constructor() {super({key: "level-1"});}

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this.loadAnimation();
        this._style = { fontFamily: "RussoOne", fontSize: "45px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 };
    }

    protected create(data: any): void {
        this._map = new Map(this, 1);
        // add all enemies 1 - enemy BTR, 2 - enemy BMP, 3 - enemy tank, count reverse! number of bases on each level is different!!!
        this._enemiesArray = [3, 2, 3, 1, 2, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1];
        // add player/s
        this._player1Data = data.data.firstPlayer;
        const player = this._map.getPlayer(1);
        let position: StartPosition = {x: player.x, y: player.y};
        this._player1 = new Player(this, position, "objects", `player_${this._player1Data.vehicle}`, this._map, this._player1Data.shellType, this._player1Data.experience); // experience from 0 to 200
        this._maxEnemies = 6;
        const width: number = this.sys.game.canvas.width;
        this.showFirstPlayerExperience(width);
        if (data.data.secondPlayer) {
            this._player2Data = data.data.secondPlayer;
            const player2 = this._map.getPlayer(2);
            position = {x: player2.x, y: player2.y};
            this._player2 = new Player2(this, position, "objects", `player_${this._player2Data.vehicle}`, this._map, this._player2Data.shellType, this._player2Data.experience);
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
    }

    private showFirstPlayerExperience(width: number): void {
        // createLevelText(this, window.innerWidth - 80, 30, "1st", this._style);
        createLevelText(this, width - 80, 30, "1st", this._style);
        const rank: string = getPlayersRank(this._player1Data.experience);
        // const sprite: Phaser.GameObjects.Sprite = this.add.sprite(window.innerWidth - 40, 140, "objects", rank);
        const sprite: Phaser.GameObjects.Sprite = this.add.sprite(width - 40, 140, "objects", rank);
        sprite.depth = 10;
    }

    private showSecondPlayerExperience(width: number): void {
        createLevelText(this, window.innerWidth - 90, 200, "2nd", this._style);
        const rank: string = getPlayersRank(this._player2Data.experience);
        const sprite: Phaser.GameObjects.Sprite = this.add.sprite(window.innerWidth - 40, 310, "objects", rank);
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
        if (this._enemies.counter <= 0 && (this._player1 || this._player2)) {
            // create LevelData and pass it to the next scene
            const levelData: LevelData = {
                firstPlayer: {
                    vehicle: this._player1Data.vehicle,
                    shellType: this._player1Data.shellType,
                    experience: this._player1.experience // calculate player`s experience!!!
                },
                secondPlayer: null
            };
            if (this._player2) {
                levelData.secondPlayer.vehicle = this._player2Data.vehicle;
                levelData.secondPlayer.shellType = this._player2Data.shellType;
                levelData.secondPlayer.experience = this._player2.experience; // calculate player`s experience!!!
            }
            
            // level is finished
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

    // private getVehicleConfig(): any {
    //     // config for the first player
    //     let config: any = { player1: TANKS.RED, player2: TANKS.BLUE };
    //     // if (this._client && !this._client._isFirst) {
    //     //     // config for the second player
    //     //     config = { player1: CARS.BLUE, player2: CARS.RED };
    //     // }
    //     return config;
    // }

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

    private loadAnimation(): void {
        // to garantee safe and correct loading of animation
        const bangFrames: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "explosion",
            start: 1,
            end: 5
        });
        this.anims.create({
            key: BANG_ANIMATION,
            frames: bangFrames,
            frameRate: 5,
            duration: 800, // miliseconds
            repeat: 0, // to play animation only once
        });

        // const frames: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
        //     prefix: "platform",
        //     start: 1,
        //     end: 8
        // });
        // this.anims.create({
        //     key: RADAR_ANIMATION,
        //     frames: frames,
        //     frameRate: 7,
        //     duration: 1000, // miliseconds
        //     repeat: -1, // to play animation infinitely
        // });

        const sparkleFrame: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames("objects", {
            prefix: "sparkle",
            start: 1,
            end: 1
        });
        this.anims.create({
            key: SPARKLE_ANIMATION,
            frames: sparkleFrame,
            frameRate: 7,
            duration: 350, // miliseconds
            repeat: 0, // to play animation only once
        });
    }
}