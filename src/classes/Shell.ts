import { StartPosition, SPEED } from "../utils/utils";
import Map from "./Map";

export default class Shell extends Phaser.GameObjects.Sprite {
    private _scene: Phaser.Scene = null;
    private _parentSprite: Phaser.GameObjects.Sprite = null;
    private _map: Map = null;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, parentSprite: Phaser.GameObjects.Sprite, map: Map) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = scene;
        this._parentSprite = parentSprite;
        this._map = map;
        this.init();
        this._scene.events.on("update", this.update, this);
    }

    protected init() {
        this._scene.add.existing(this); // add sprite to the scene
        this._scene.physics.add.existing(this); // add sprite as physic object to Phaser engine
        this.body.enable = true; // the physic body of "dragon" will be available for physic impacts
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
        // if (!status) this.emit("object_killed");
    }

    // direction has to be among 1 and -1. 1 for enemies, -1 for player
    public flyOut(direction: number) {
        const vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
        vector.setToPolar(this._parentSprite.rotation + (direction * Math.PI / 2)); // (this._tank.vehicle.rotation - Math.PI) - correct side from where shell throws, 30 - distance from tank`s core and shell
        this.angle = this._parentSprite.angle; // tank and shell sprites should be on the same direction
        this.body.setVelocity(vector.x * SPEED.FASTEST * 3, vector.y * SPEED.FASTEST * 3); // shell`s speed
    }

    public reset(): void {
        const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(this._parentSprite.angle + 270, 30); // +270 - trick to set shell just before barrel
        const position: StartPosition = { x: this._parentSprite.x + vector.x - 6, y: this._parentSprite.y + vector.y - 6 };
        this.body.x = position.x;
        this.body.y = position.y;
        this.setAlive(true);
    }
}