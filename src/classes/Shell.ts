import Map from "./Map";

export default class Shell extends Phaser.GameObjects.GameObject {
    private _scene: Phaser.Scene = null;
    private _parentSprite: Phaser.Physics.Matter.Sprite = null;
    private _map: Map = null;
    private _texture: string = "";
    public _sprite: Phaser.Physics.Matter.Sprite = null;

    constructor(scene: Phaser.Scene, parentSprite: Phaser.Physics.Matter.Sprite, map: Map, texture: string) {
        super(scene, texture);
        this._scene = scene;
        this._parentSprite = parentSprite;
        this._map = map;
        this._texture = texture;
        this._scene.events.on("update", this.update, this);
    }

    // check if shell is out of boarders
    public update(): void {
        if (this._sprite.active && (this._sprite.x < -20 ||
            this._sprite.x > this._map.tilemap.widthInPixels + 20 ||
            this._sprite.y < -20 ||
            this._sprite.y > this._map.tilemap.heightInPixels + 20)) this.setAlive(false);
    }

    public setAlive(status: boolean): void {
        this._sprite.body.enable = status;
        this._sprite.setVisible(status);
        this._sprite.setActive(status);
        this.setActive(status);
        // if (!status) this.emit("object_killed");
    }

    // direction has to be among 1 and -1. 1 for enemies, -1 for player
    public flyOut(direction: number) {
        const vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
        vector.setToPolar(this._parentSprite.rotation + (direction * Math.PI / 2), 30); // (this._tank.vehicle.rotation - Math.PI) - correct side from where shell throws, 30 - distance from tank`s core and shell
        this._sprite = this._scene.matter.add.sprite(this._parentSprite.x + vector.x, this._parentSprite.y + vector.y, "objects", this._texture);
        this._sprite.angle = this._parentSprite.angle; // tank and shell sprites should be on the same direction
        this._sprite.setVelocity(vector.x * 0.9, vector.y * 0.9); // shell`s speed
    }

    public reset(): void {
        this.setAlive(true);
    }
}