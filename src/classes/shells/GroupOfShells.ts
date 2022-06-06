import { ENEMY, StartPosition } from "../../utils/utils";
import Map from "../Map";
import Shell from "./Shell";

export default class GroupOfShells extends Phaser.Physics.Arcade.Group {
    private _scene: Phaser.Scene = null;
    private _map: Map = null;
    private _texture: string = "";
    private _enemy: boolean = false;
    private _direction: number = 1;
    private _nextShoot: number = 0;
    private _pauseBetweenShoots: number = 0;

    constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, map: Map, texture: string, enemy: boolean = true) {
        super(world, scene);
        this._scene = scene;
        this._map = map;
        this._texture = texture;
        this._enemy = enemy;
        this._direction = enemy ? 1 : -1;
        this.setPauseBetweenShoots();
    }

    // mechanism for sprites` reusing for better performance
    public createFire(parentSprite: Phaser.GameObjects.Sprite): void {
        if (this._nextShoot > this._scene.time.now) return; // to prevent toans of fires

        let shell: Shell = this.getFirstDead();
        const side: number = this._enemy ? -37 : 40;
        
        if (!shell) {
            const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(parentSprite.angle + 270, side); // +270 - trick to set shell just before barrel
            const position: StartPosition = { x: parentSprite.x + vector.x, y: parentSprite.y + vector.y };
            shell = new Shell(this._scene, position, "objects", this._texture, parentSprite, this._map);
            this.add(shell);
        } else {
            const vector: Phaser.Math.Vector2 = this._scene.physics.velocityFromAngle(parentSprite.angle + 270, side); // +270 - trick to set shell just before barrel
            const position: StartPosition = { x: parentSprite.x + vector.x - 5, y: parentSprite.y + vector.y - 5};
            shell.body.x = position.x;
            shell.body.y = position.y;
            shell.setAlive(true);
        }
        shell.flyOut(this._direction);

        this._nextShoot = this._scene.time.now + this._pauseBetweenShoots; // instead one fire per 0.5 second
    }

    private setPauseBetweenShoots(): void {
        switch (this._texture) {
            case ENEMY.TANK.SHELL_TYPE:
                this._pauseBetweenShoots = 1200; // enemy`s tank
                break;
            case ENEMY.BMP.SHELL_TYPE:
                this._pauseBetweenShoots = 600; // enemy`s BMP
                break;
            case ENEMY.BTR.SHELL_TYPE:
                this._pauseBetweenShoots = 300; // enemy`s BTR
                break;
            case "bulletRed1":
                this._pauseBetweenShoots = 400; // player`s BMP
                break;
            case "bulletRed2":
                this._pauseBetweenShoots = 800; // player`s tank
                break;
        }
    }
}