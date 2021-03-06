import { StartPosition, SPEED, ENEMY, PLAYER } from "../../utils/utils";
import Map from "../Map";
import Player from "../vehicles/player/Player";

export default class Shell extends Phaser.GameObjects.Sprite {
    private _scene: Phaser.Scene = null;
    private _map: Map = null;
    private _shellSpeed: number = 0;
    private _shellPower: number = 0;
    public parentSprite: Phaser.GameObjects.Sprite = null;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, parentSprite: Phaser.GameObjects.Sprite, map: Map) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = scene;
        this.parentSprite = parentSprite;
        this._map = map;
        this.init(textureName);
        this._scene.events.on("update", this.update, this);
    }

    protected init(textureName: string) {
        this._scene.add.existing(this); // add sprite to the scene
        this._scene.physics.add.existing(this); // add sprite as physic object to Phaser engine
        this.body.enable = true; // the physic body of "dragon" will be available for physic impacts

        switch (textureName) {
            case ENEMY.BTR.SHELL_TYPE:
                this._shellSpeed = SPEED.FASTER;
                this._shellPower = ENEMY.BTR.SHELL_POWER;
                break;
            case ENEMY.BMP.SHELL_TYPE:
                this._shellSpeed = SPEED.FASTER;
                this._shellPower = ENEMY.BMP.SHELL_POWER;
                break;
            case ENEMY.TANK.SHELL_TYPE:
                this._shellSpeed = SPEED.FASTER;
                this._shellPower = ENEMY.TANK.SHELL_POWER;
                break;
            case PLAYER.BMP.SHELL_TYPE:
                this._shellSpeed = SPEED.FASTEST;
                this._shellPower = PLAYER.BMP.SHELL_POWER;
                break;
            case PLAYER.TANK.SHELL_TYPE:
                this._shellSpeed = SPEED.FASTEST;
                this._shellPower = PLAYER.TANK.SHELL_POWER;
                break;
        }
    }

    public get damage(): number {
        return this._shellPower;
    }

    // check if shell is out of boarders
    public update(): void {
        if (this.active && (this.body.x < -20 ||
            this.body.x > this._map.tilemap.widthInPixels + 20 ||
            this.body.y < -20 ||
            this.body.y > this._map.tilemap.heightInPixels + 20)) this.setAlive(false);
    }

    public setAlive(status: boolean): void {
        this.body.enable = status;
        this.setVisible(status);
        this.setActive(status);
    }

    // direction has to be among 1 and -1. 1 for enemies, -1 for player
    public flyOut(direction: number) {
        const vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
        vector.setToPolar(this.parentSprite.rotation + (direction * Math.PI / 2)); // (this._tank.vehicle.rotation - Math.PI) - correct side from where shell throws, 30 - distance from tank`s core and shell
        this.angle = this.parentSprite.angle; // tank and shell sprites should be on the same direction
        this.body.setVelocity(vector.x * this._shellSpeed, vector.y * this._shellSpeed);
        if (this.parentSprite instanceof Player) (this.parentSprite as Player).shootingSound.play();
    }
}