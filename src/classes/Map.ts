import { GROUND_FRICTION, ROADS_FRICTION, StartPosition } from "../utils/utils";
import Radar from "./enemies/Radar";

export default class Map {
    private _scene: Phaser.Scene = null;
    private _tileset: Phaser.Tilemaps.Tileset = null;
    public tilemap: Phaser.Tilemaps.Tilemap = null;
    private _defenceArea: Phaser.Geom.Rectangle = null;
    private _baseArea: Phaser.Geom.Rectangle = null;
    private _checkZone: Phaser.Geom.Rectangle = null;
    public boxes: Phaser.GameObjects.Sprite[] = [];

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
        this.createAreas();
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
            // we have to cast implicitly
            // collisionObject - GameObject, but we need Sprite!
            const castedObject: Phaser.GameObjects.Sprite = collisionObject as Phaser.GameObjects.Sprite;
            let sprite: Phaser.GameObjects.Sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x, castedObject.y, "objects", "crateWood");
            // let sprite: Phaser.GameObjects.Sprite = new Phaser.GameObjects.Sprite(this._scene, castedObject.x, castedObject.y, "objects", "crateWood");
            this._scene.add.existing(sprite);
            this._scene.physics.add.existing(sprite, true); // true -> to make it static
            sprite.body.enable = true;
            this.boxes.push(sprite);
        });
    }

    private createAreas(): void {
        let array: Phaser.Types.Tilemaps.TiledObject[] = this.tilemap.filterObjects("defence_area", checkpoint => checkpoint.name === "defence_area");
        // create rectangle phaser object
        array.forEach((item: Phaser.Types.Tilemaps.TiledObject) => {
            this._defenceArea = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });

        array = this.tilemap.filterObjects("base_area", checkpoint => checkpoint.name === "base_area");
        array.forEach((item: Phaser.Types.Tilemaps.TiledObject) => {
            this._baseArea = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        
        array = this.tilemap.filterObjects("enemies", checkpoint => checkpoint.name === "check_zone");
        array.forEach((item: Phaser.Types.Tilemaps.TiledObject) => {
            this._checkZone = new Phaser.Geom.Rectangle(item.x, item.y, item.width, item.height);
        });
        array = null;
    }

    public getPlayer(): Phaser.Types.Tilemaps.TiledObject {
        // find a player object in tilemap
        return this.tilemap.findObject("player", playerObject => playerObject.name === "player");
    }

    public getTurretPosition(): StartPosition {
        const turret: Phaser.Types.Tilemaps.TiledObject = this.tilemap.findObject("enemies", playerObject => playerObject.name === "turret");
        const position: StartPosition = {x: turret.x, y: turret.y};
        return position;
    }

    public getRadarPosition(): StartPosition {
        const radar: Phaser.Types.Tilemaps.TiledObject = this.tilemap.findObject("enemies", playerObject => playerObject.name === "radar");
        const position: StartPosition = {x: radar.x, y: radar.y};
        return position;
    }

    public getBasePosition(baseNumber: number): StartPosition {
        const base: Phaser.Types.Tilemaps.TiledObject = this.tilemap.findObject("enemies", playerObject => playerObject.name === `base_${baseNumber}`);
        const position: StartPosition = {x: base?.x, y: base?.y};
        return position;
    }

    getTileFriction(vehicle: Phaser.GameObjects.Sprite): number {
        for (const roadType in ROADS_FRICTION) {
            // match different road`s types where the car is running now
            // if it`s in ROADS_FRICTION, return appropriate road`s type
            // important!!! road`s types have to match exactly with layers` names in the map
            const tile: Phaser.Tilemaps.Tile = this.tilemap.getTileAtWorldXY(vehicle.x, vehicle.y, false, this._scene.cameras.main, roadType);
            if (tile) return ROADS_FRICTION[roadType];
        }    
        // if it`s not -> return GRASS_FRICTION
        return GROUND_FRICTION;
    }

    public checkPlayersPosition(radar: Radar, playersTank: Phaser.GameObjects.Sprite): boolean {
        if (radar.active && playersTank.active) {
            return this.isInDefenceArea(playersTank);
        } else if (!radar.active && playersTank.active) {
            return this.isInBaseArea(playersTank);
        } else return false;
    }

    private isInDefenceArea(playersTank: Phaser.GameObjects.Sprite): boolean {
        // check if player is in the defence area or not
        if (playersTank.active) return this._defenceArea.contains(playersTank.x, playersTank.y);
    }

    private isInBaseArea(playersTank: Phaser.GameObjects.Sprite): boolean {
        // check if player is in the base area or not
        if (playersTank.active) return this._baseArea.contains(playersTank.x, playersTank.y);
    }

    public isInCheckZone(enemy: Phaser.GameObjects.Sprite): boolean {
        // check if player is in the base area or not
        if (enemy.active) return this._checkZone.contains(enemy.x, enemy.y);
    }
}