import Map from "../../Map";
import EnemyVehicle from "./EnemyVehicle";
import { handleDirection, StartPosition } from "../../../utils/utils";
import Player from "../player/Player";
import Player2 from "../player/Player2";

export default class GroupOfEnemies extends Phaser.Physics.Arcade.Group {
    private _scene: Phaser.Scene = null;
    private _map: Map = null;
    private _timer: Phaser.Time.TimerEvent = null;
    private _enemies: number[] = [];
    private _player1: Player = null;
    private _player2: Player2 = null;
    private _numberOfBase: number = 0;
    public counter: number = 0;

    constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, map: Map, enemies: number[], numberOfBase: number, player1: Player, player2: Player2 = null) {
        super(world, scene);
        this._scene = scene;
        this._map = map;
        this._enemies = enemies;
        this._player1 = player1;
        this._player2 = player2;
        this._numberOfBase = numberOfBase;
        this._timer = this._scene.time.addEvent({ // add new enemy every 3 seconds
            delay: 3000,
            loop: true,
            callback: this.addEnemy,
            callbackScope: this
        });
        // prevent enemy`s overlapping with each other
        this._scene.physics.add.collider(this, this, this.handleEnemyVehicleCollision, null, this);
    }

    private addEnemy(): void {
        if (this.counter < 6) { // hold no more than 6 enemies on the map at one time
            this._enemies.length > 0 ? this.createEnemy() : this._timer?.remove();
        }
    }

    private createEnemy(): void {
        const baseNumber: number = Math.floor(Math.random() * this._numberOfBase) + 1;
        const position: StartPosition = this._map.getBasePosition(baseNumber); // there are two places on the map where enemies appear
        // get last el from array
        // transform el into texture
        // delete last el from array
        // const enemiesTexture: string = this.getEnemyVehicleTexture(this._enemies[this._enemies.length - 1]);
        const enemiesTexture: string = this.getEnemyVehicleTexture(this._enemies.pop());
        const enemy: EnemyVehicle = new EnemyVehicle(this._scene, position, "objects", enemiesTexture, this._map, this._player1, this._player2);
        this.add(enemy);

        enemy.moveOut();
        ++this.counter;
    }

    private getEnemyVehicleTexture(index: number): string {
        switch (index) {
            case 1:
                return "enemy_btr"; // BTR
            case 2:
                return "enemy"; // BMP
            case 3:
                return "enemy_tank"; // tank
        }
    }

    private handleEnemyVehicleCollision(firstEnemy: EnemyVehicle, secondEnemy: EnemyVehicle): void {
        handleDirection(firstEnemy);
        handleDirection(secondEnemy);
        firstEnemy.changeDirection();
        secondEnemy.body.stop();
    }

    // private update(): void {
    //     if (this.children.size > 0) {
    //         const array: EnemyVehicle[] = this.children.getArray() as EnemyVehicle[];
    //         for (let i = 0; i < this.children.size; i++) {
    //             if (!array[i].isAppear && this._map.isInCheckZone(array[i])) {
    //                 array[i].body.y += 30;
    //                 array[i].changeDirection();
    //             }
    //         }
    //     }
    // }
}