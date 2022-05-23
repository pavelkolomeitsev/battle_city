import Map from "../Map";
import EnemyVehicle from "./EnemyVehicle";
import { StartPosition } from "../../utils/utils";
import Player from "../Player";

export default class GroupOfEnemies extends Phaser.Physics.Arcade.Group {
    private _scene: Phaser.Scene = null;
    private _map: Map = null;
    private _timer: Phaser.Time.TimerEvent = null;
    private _enemiesAmount: number = 0;
    private _createdEnemies: number = 0;
    private _player: Player = null;
    public counter: number = 0;

    constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, map: Map, enemiesAmount: number, player: Player) {
        super(world, scene);
        this._scene = scene;
        this._map = map;
        this._enemiesAmount = enemiesAmount;
        this._player = player;
        this._timer = this._scene.time.addEvent({ // add new enemy every 3 seconds
            delay: 3000,
            loop: true,
            callback: this.addEnemy,
            callbackScope: this
        });
        // prevent enemy`s overlapping with each other
        this._scene.physics.add.collider(this, this, this.handleEnemyVehicleCollision, null, this);
        this._scene.events.on("update", this.update, this); // prevent enemy`s moving out of restricted zone
    }

    private addEnemy(): void {
        if (this.counter < 6) {
            this._createdEnemies < this._enemiesAmount ? this.createEnemy() : this._timer?.remove();
        }
    }

    private createEnemy(): void {
        // let enemy: EnemyVehicle = this.getFirstDead();
        const baseNumber: number = Math.floor(Math.random() * 2) + 1;
        const position: StartPosition = this._map.getBasePosition(baseNumber); // there are two places on the map where enemies appear
        
        const enemy: EnemyVehicle = new EnemyVehicle(this._scene, position, "objects", "tank_sand", this._map, this._player);
        this.add(enemy);

        enemy.moveOut();
        ++this._createdEnemies;
        ++this.counter;
    }

    private handleEnemyVehicleCollision(firstEnemy: EnemyVehicle, secondEnemy: EnemyVehicle): void {
        firstEnemy.changeDirection();
        secondEnemy.changeDirection();
    }

    private update(): void {
        if (this.children.size > 0) {
            const array: EnemyVehicle[] = this.children.getArray() as EnemyVehicle[];
            for (let i = 0; i < this.children.size; i++) {
                if (!array[i].isAppear && this._map.isInCheckZone(array[i])) {
                    array[i].body.y += 30;
                    array[i].changeDirection();
                }
            }
        }
    }
}