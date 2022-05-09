import { GROUND_FRICTION, ROADS_FRICTION, StartPosition } from "../utils/utils";

export default class Map {
    private _scene: Phaser.Scene = null;
    private _tileset: Phaser.Tilemaps.Tileset = null;
    public tilemap: Phaser.Tilemaps.Tilemap = null;

    constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this.init();
        this.create();
    }

    init(): void {
        // create a tilemap object
        this.tilemap = this._scene.make.tilemap({ key: "tilemap" });
        // add images to tilemap
        // 1 param look in "tilemap.json" prop tilesets - name
        this._tileset = this.tilemap.addTilesetImage("tilemap", "tileset", 64, 64, 0, 0);
    }

    create(): void {
        this.createLayers();
        this.createCollisions();
        // this.createChekpoints();
    }
    
    private createLayers(): void {
        // create 2 layers
        this.tilemap.createLayer("ground", this._tileset);
        this.tilemap.createLayer("road", this._tileset);
    }

    private createCollisions(): void {
        // first param - name of object`s layer in tilemap
        // second param - callback function, which called for every image in tileset
        this.tilemap.findObject("collisions", collisionObject => {
            // with the help of 'matter' engine we add every image to the scene

            // we have to cast implicitly
            // collisionObject - GameObject, but we need Sprite!
            const castedObject = collisionObject as Phaser.Physics.Matter.Sprite;
            const sprite: Phaser.Physics.Matter.Sprite = this._scene.matter.add.sprite(
                castedObject.x + castedObject.width / 2, // with the help of this trick
                castedObject.y - castedObject.height / 2, // we fixed incorrect displacement (смещение) of sprites on the map
                "objects", // key from 'PreloadScene -> this.load.atlas("objects"...'
                collisionObject.name // it`s to distinct each item in objects image collection
            );
            sprite.setStatic(true); // make the sprite static physical object
        });
    }

    createChekpoints(): void {
        // // get all game objects with name "checkpoint"
        // const array: Phaser.Types.Tilemaps.TiledObject[] = this.tilemap.filterObjects("checkpoints", checkpoint => checkpoint.name === "checkpoint");
        // // fill this._chekpoints-array with rectangle objects
        // array.forEach(item => {
        //     const rectangle: Checkpoint = new Checkpoint(item.x, item.y, item.width, item.height);
        //     rectangle.index = item.properties.find((prop: Phaser.Types.Tilemaps.TiledObject) => prop.name === "value").value;
        //     this.chekpoints.push(rectangle);
        // });
    }

    public getPlayer(): Phaser.Types.Tilemaps.TiledObject {
        // find a player object in tilemap
        return this.tilemap.findObject("player", playerObject => playerObject.name === "player");
    }

    public getTurretPosition(): StartPosition {
        const turret: Phaser.Types.Tilemaps.TiledObject = this.tilemap.findObject("enemy", playerObject => playerObject.name === "enemy");
        const position: StartPosition = {x: turret.x, y: turret.y};
        return position;
    }

    getTileFriction(car: Phaser.Physics.Matter.Sprite): number {
        for (const roadType in ROADS_FRICTION) {
            // match different road`s types where the car is running now
            // if it`s in ROADS_FRICTION, return appropriate road`s type
            // important!!! road`s types have to match exactly with layers` names in the map
            const tile: Phaser.Tilemaps.Tile = this.tilemap.getTileAtWorldXY(car.x, car.y, false, this._scene.cameras.main, roadType);
            if (tile) return ROADS_FRICTION[roadType];
        }    
        // if it`s not -> return GRASS_FRICTION
        return GROUND_FRICTION;
    }

    // getCheckpoint(car: Phaser.Physics.Matter.Sprite): number | boolean {
    //     const checkpoint = this.chekpoints.find(item => item.contains(car.x, car.y));
    //     // check if the car is in the exact checkpoint or car isn`t in the checkpoint area
    //     return checkpoint ? Number.parseInt(checkpoint.index) : false;
    // }
}