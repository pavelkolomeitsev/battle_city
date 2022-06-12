export default class GameOverScene extends Phaser.Scene {
    constructor() { super({ key: "gameover-scene" }) }
    
    protected create(): void {
        console.log("Game over scene");
    }
}