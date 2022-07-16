import Map from "../classes/Map";
import GroupOfEnemies from "../classes/vehicles/enemies/GroupOfEnemies";
import Player from "../classes/vehicles/player/Player";
import Player2 from "../classes/vehicles/player/Player2";
import { createText, LevelData } from "../utils/utils";

export default class Level extends Phaser.Scene {
    protected _map: Map = null;
    protected _levelData: LevelData = null;
    protected _player1: Player = null;
    protected _player2: Player2 = null;
    protected _players: Player[] = [];
    protected _enemies: GroupOfEnemies = null;
    protected _enemiesText: Phaser.GameObjects.Text = null;
    protected _finishText: Phaser.GameObjects.Text = null;
    protected _enemiesArray: number[] = null;
    protected _enemiesLeft: number = 0;
    protected _maxEnemies: number = 6;
    protected _style: Phaser.Types.GameObjects.Text.TextStyle = null;
    protected _fightingMelody: Phaser.Sound.BaseSound = null;

    constructor(levelName: string) {
        super({ key: levelName });
    }

    protected preload(): void {
        this.add.sprite(0, 0, "background").setOrigin(0);
        this._style = { fontFamily: "RussoOne", fontSize: "40px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 };
        this._fightingMelody = this.sound.add("fightMelody", {volume: 0.1, loop: true});
    }

    protected createFinishText(): void {
        this._finishText = createText(this, this.sys.game.canvas.width, this.sys.game.canvas.height + 150, "GAME OVER", { fontFamily: "RussoOne", fontSize: "90px", color: "#E62B0D", stroke: "#000000", strokeThickness: 3 });
        this._finishText.setX(this.sys.game.canvas.width / 2 - this._finishText.width / 2);
        this._finishText.depth = 10;
    }

    protected listenEvents(): void {}
    
    protected enemyDead(toCount: boolean, isHeadquarterRuDestroyed?: boolean): void { }
    
    protected headquarterDestroyed(): void {}

    protected firstPlayerDead(): void {
        this._levelData.firstPlayer = null;
        this._player1 = null;
        if (this._levelData.multiplayerGame && this._player2) return;
        else {
            this.events.removeListener("first_player_dead");
            this.events.removeListener("second_player_dead");
            this.events.removeListener("enemy_dead");
            this.runTween();
        }
    }

    protected secondPlayerDead(): void {
        this._levelData.secondPlayer = null;
        this._player2 = null;
        if (this._levelData.multiplayerGame && !this._player1) {
            this.events.removeListener("first_player_dead");
            this.events.removeListener("second_player_dead");
            this.events.removeListener("enemy_dead");
            this.runTween();
        }
    }

    protected runTween(): void {
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
        this._players.forEach((player: Player) => {
            if (player && player.active) player.move();
        });
        this.checkMapBounds([...this._enemies.getChildren(), ...this._players]);
    }

    protected checkMapBounds(vehicles: Phaser.GameObjects.GameObject[]): void {
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