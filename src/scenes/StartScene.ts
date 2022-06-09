import { createText, createTextButton } from "../utils/utils";

export default class StartScene extends Phaser.Scene {
    private _style: Phaser.Types.GameObjects.Text.TextStyle;
    private _onePlayerTextButton: Phaser.GameObjects.Text;
    private _twoPlayersTextButton: Phaser.GameObjects.Text;
    private _help: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "start-scene" });
        this._style = { fontFamily: "RussoOne", fontSize: "55px", color: "#FFFFFF" };
    }

    protected preload(): void {
        const sprite: Phaser.GameObjects.Sprite = this.add.sprite(0, 0, "logo").setOrigin(0);
        sprite.setX(window.innerWidth / 2 - sprite.width / 2);
        sprite.setY(window.innerHeight / 2 - sprite.height / 2 - 200);
    }

    protected create(): void {
        this._onePlayerTextButton = createTextButton(this, 50, "1 player", this._style);
        this._onePlayerTextButton.once("pointerdown", () => {
            this.scene.start("post-start-scene", {onePlayer: true});
        });
        this._twoPlayersTextButton = createTextButton(this, 130, "2 players", this._style, this._onePlayerTextButton.width);
        this._twoPlayersTextButton.once("pointerdown", () => {
            this.scene.start("post-start-scene", {onePlayer: false});
        });
        this._help = createTextButton(this, 210, "Help", this._style, this._onePlayerTextButton.width);
        this._help.on("pointerdown", () => {
            this.scene.start("help-scene");
        });
    }
}