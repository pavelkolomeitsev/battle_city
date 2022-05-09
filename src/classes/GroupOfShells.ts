import Map from "./Map";
import Shell from "./Shell";

export default class GroupOfShells extends Phaser.GameObjects.Group {
    private _scene: Phaser.Scene = null;
    private _parentSprite: Phaser.Physics.Matter.Sprite = null;
    private _map: Map = null;
    private _texture: string = "";
    private _enemy: number = 1;
    private _nextShoot: number = 0;

    constructor(scene: Phaser.Scene, parentSprite: Phaser.Physics.Matter.Sprite, map: Map, texture: string, enemy: boolean = true) {
        super(scene);
        this._scene = scene;
        this._parentSprite = parentSprite;
        this._map = map;
        this._texture = texture;
        this._enemy = enemy ? 1 : -1;
    }

    // mechanism for sprites` reusing for better performance
    public createFire(): void {
        if (this._nextShoot > this._scene.time.now) return; // to prevent toans of fires

        let shell: Shell = this.getFirstDead();
        
        if (!shell) {
            shell = new Shell(this._scene, this._parentSprite, this._map, this._texture);
            this.add(shell);
        } else {
            shell.reset();
        }
        shell.flyOut(this._enemy);

        this._nextShoot = this._scene.time.now + 500; // instead one fire per 0.5 second
    }
}