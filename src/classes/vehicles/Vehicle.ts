import { StartPosition } from "../../utils/utils";
import Map from "../Map";

export default class Vehicle extends Phaser.GameObjects.Sprite {
    protected _scene: Phaser.Scene = null;
    protected _map: Map = null;

    constructor(scene: Phaser.Scene, position: StartPosition, atlasName: string, textureName: string, map: Map) {
        super(scene, position.x, position.y, atlasName, textureName);
        this._scene = scene;
        this._map = map;
        this.init();
    }
    
    protected init() {
        this._scene.add.existing(this); // add sprite to the scene
        this._scene.physics.add.existing(this); // add sprite as physic object to Phaser engine
        this.body.enable = true; // the physic body of "dragon" will be available for physic impacts
    }

    public fire(): void {}
}