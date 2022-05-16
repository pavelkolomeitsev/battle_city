import { StartPosition } from "../utils/utils";
import Map from "./Map";
import Shell from "./Shell";

export default class GroupOfShells extends Phaser.Physics.Arcade.Group {
    private _scene: Phaser.Scene = null;
    private _parentSprite: Phaser.GameObjects.Sprite = null;
    private _map: Map = null;
    private _texture: string = "";
    private _enemy: boolean = false;
    private _direction: number = 1;
    private _nextShoot: number = 0;

    constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, parentSprite: Phaser.GameObjects.Sprite, map: Map, texture: string, enemy: boolean = true) {
        super(world, scene);
        this._scene = scene;
        this._parentSprite = parentSprite;
        this._map = map;
        this._texture = texture;
        this._enemy = enemy;
        this._direction = enemy ? 1 : -1;
    }

    // mechanism for sprites` reusing for better performance
    public createFire(): void {
        if (this._nextShoot > this._scene.time.now) return; // to prevent toans of fires

        let shell: Shell = this.getFirstDead();
        const side: number = this._enemy ? -35 : 30;
        
        if (!shell) {
            const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(this._parentSprite.angle + 270, side); // +270 - trick to set shell just before barrel
            const position: StartPosition = { x: this._parentSprite.x + vector.x, y: this._parentSprite.y + vector.y };
            shell = new Shell(this._scene, position, "objects", this._texture, this._parentSprite, this._map);
            this.add(shell);
        } else {
            const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(this._parentSprite.angle + 270, side); // +270 - trick to set shell just before barrel
            const position: StartPosition = { x: this._parentSprite.x + vector.x - 6, y: this._parentSprite.y + vector.y - 6 };
            shell.body.x = position.x;
            shell.body.y = position.y;
            shell.setAlive(true);
        }
        shell.flyOut(this._direction);

        this._nextShoot = this._scene.time.now + 500; // instead one fire per 0.5 second
    }
}