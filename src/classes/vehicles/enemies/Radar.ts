import { goToOpositeDirection, RADAR_ANIMATION, StartPosition } from "../../../utils/utils";
import XpointsAnimation from "../../animation/XpointsAnimation";
import Shell from "../../shells/Shell";
import Player from "../player/Player";
import Player2 from "../player/Player2";
import EnemyVehicle from "./EnemyVehicle";
import GroupOfEnemies from "./GroupOfEnemies";

export default class Radar extends Phaser.GameObjects.Sprite {
    private _scene: Phaser.Scene = null;
    private _player1: Player = null;
    private _player2: Player2 = null;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, enemies: GroupOfEnemies, player1: Player = null, player2: Player2 = null) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = scene;
        this._player1 = player1;
        this._player2 = player2;
        this.init();
        this.runRadar();
        const stopableArray: Phaser.GameObjects.GameObject[] = enemies.getChildren();
        this._scene.physics.add.collider(stopableArray, this, this.handleCollision, null, this);
    }

    private init(): void {
        this._scene.add.existing(this); // add sprite to the scene
        this._scene.physics.add.existing(this); // add sprite as physic object to Phaser engine
        this.body.enable = true; // the physic body of "dragon" will be available for physic impacts
        this.body.setImmovable(true);
    }

    private runRadar(): void {
        this.play(RADAR_ANIMATION);
    }

    public destroyRadar(shell: Shell): void {
        const id: string = (shell.parentSprite as Player).id;
        const position: StartPosition = { x: shell.x, y: shell.y };
        XpointsAnimation.generateAnimation(this._scene, position, 1);
        this.calculateExperiencePoints(id, 0.4);
        this._scene.events.emit("enemy_dead", true, false);
        this._scene = null;
        this.destroy();
    }

    private calculateExperiencePoints(id: string, points: number): void {
        if (this._player1 && id === "P1") {
            this._player1.experience += points;
            this._player1.radarPerLevel++;
        } else if (this._player2 && id === "P2") {
            this._player2.experience += points;
            this._player2.radarPerLevel++;
        }
    }

    private handleCollision(enemy: EnemyVehicle, radar: Phaser.GameObjects.Sprite): void {
        goToOpositeDirection(enemy);
    }
}