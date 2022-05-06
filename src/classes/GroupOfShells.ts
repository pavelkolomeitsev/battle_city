import Map from "./Map";
import Shell from "./Shell";
import Vehicle from "./Vehicle";

export default class GroupOfShells extends Phaser.GameObjects.Group {
    private _scene: Phaser.Scene = null;
    private _vehicle: Vehicle = null;
    private _map: Map = null;
    private _nextShoot: number = 0;

    constructor(scene: Phaser.Scene, vehicle: Vehicle, map: Map) {
        super(scene);
        this._scene = scene;
        this._vehicle = vehicle;
        this._map = map;
    }

    // mechanism for sprites` reusing for better performance
    public createFire(): void {
        if (this._nextShoot > this._scene.time.now) return; // to prevent toans of fires

        let shell: Shell = this.getFirstDead();
        
        if (!shell) {
            shell = new Shell(this._scene, this._vehicle, this._map, "bulletRed1_outline.png");
            this.add(shell);
        } else {
            shell.reset();
        }
        shell.flyOut();

        this._nextShoot = this._scene.time.now + 500; // instead one fire per 0.5 second
    }
}