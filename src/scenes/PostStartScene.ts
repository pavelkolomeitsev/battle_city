import { createRectangleFrame, createText, LevelData } from "../utils/utils";

export default class PostStartScene extends Phaser.Scene {
    private _data: LevelData = null;
    private _style: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _tank1Rect: Phaser.GameObjects.Graphics = null;
    private _ifv1Rect: Phaser.GameObjects.Graphics = null;
    private _tank2Rect: Phaser.GameObjects.Graphics = null;
    private _ifv2Rect: Phaser.GameObjects.Graphics = null;
    private _buttonClick: Phaser.Sound.BaseSound = null;
    
    constructor() { super({ key: "post-start-scene" }); }
    
    protected preload(): void {this._buttonClick = this.sound.add("click");}

    protected create(data: any): void {
        this.init();
        data.onePlayer ? this.onePlayerMenu() : this.twoPlayerMenu();
    }
    
    private init(): void {
        this._data = {
            nextLevelNumber: "level-1",
            nextLevelName: "Training Camp",
            firstPlayer: {
                vehicle: "tank",
                shellType: "bulletRed2",
                experience: 0
            },
            secondPlayer: {
                vehicle: "tank",
                shellType: "bulletRed2",
                experience: 0
            }
        };
        this._style = { fontFamily: "RussoOne", fontSize: "55px", color: "#FFFFFF" };

        this._tank1Rect = createRectangleFrame(this, window.innerWidth / 2 + 90, window.innerHeight / 2 - 200);
        this._ifv1Rect = createRectangleFrame(this, window.innerWidth / 2 + 190, window.innerHeight / 2 - 200);
        this._tank2Rect = createRectangleFrame(this, window.innerWidth / 2 + 90, window.innerHeight / 2 - 50);
        this._ifv2Rect = createRectangleFrame(this, window.innerWidth / 2 + 190, window.innerHeight / 2 - 50);
    }

    private onePlayerMenu(): void {
        this._data.secondPlayer = null;

        this.add.graphics()
            .fillStyle(0xE7590D)
            .fillRoundedRect(window.innerWidth / 2 - 200, window.innerHeight / 2 - 125, 400, 250, 16);
        const style: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: "RussoOne", fontSize: "40px", color: "#FFFFFF" };
        createText(this, window.innerWidth / 2 - 155, window.innerHeight / 2 - 100, "Choose vehicle", style);
        this.add.sprite(window.innerWidth / 2 - 80, window.innerHeight / 2, "objects", "player_tank");
        this.add.sprite(window.innerWidth / 2 + 70, window.innerHeight / 2, "objects", "player_ifv");
        const tank: Phaser.GameObjects.Text = createText(this, window.innerWidth / 2 - 125, window.innerHeight / 2 + 50, "tank", style);
        tank.setInteractive({ useHandCursor: true });
        tank.once("pointerdown", () => {
            this._buttonClick.play();
            this.scene.start("prelevel-scene", { data: this._data })
        });
        const ifv: Phaser.GameObjects.Text = createText(this, window.innerWidth / 2 + 40, window.innerHeight / 2 + 50, "IFV", style);
        ifv.setInteractive({ useHandCursor: true });
        ifv.once("pointerdown", () => {
            this._buttonClick.play();
            this._data.firstPlayer.vehicle = "ifv";
            this._data.firstPlayer.shellType = "bulletSand1";
            this.scene.start("prelevel-scene", {data: this._data});
        });
    }

    private twoPlayerMenu(): void {
        createText(this, window.innerWidth / 2 - 300, 50, "Choose your vehicles", this._style);
        createText(this, window.innerWidth / 2 - 250, window.innerHeight / 2 - 170, "1st player", this._style);
        const tank1: Phaser.GameObjects.Sprite = this.add.sprite(window.innerWidth / 2 + 130, window.innerHeight / 2 - 150, "objects", "player_tank");
        tank1.setInteractive({ useHandCursor: true });
        tank1.on("pointerdown", () => {
            this._buttonClick.play();
            if (!this._tank1Rect.visible) {
                this._data.firstPlayer.vehicle = "tank";
                this._data.firstPlayer.shellType = "bulletRed2";
                this._tank1Rect.visible = true;
                this._ifv1Rect.visible = false;
            }
        });
        const ifv1: Phaser.GameObjects.Sprite = this.add.sprite(window.innerWidth / 2 + 230, window.innerHeight / 2 - 150, "objects", "player_ifv");
        ifv1.setInteractive({ useHandCursor: true });
        ifv1.on("pointerdown", () => {
            this._buttonClick.play();
            if (!this._ifv1Rect.visible) {
                this._data.firstPlayer.vehicle = "ifv";
                this._data.firstPlayer.shellType = "bulletSand1";
                this._ifv1Rect.visible = true;
                this._tank1Rect.visible = false;
            }
        });
        createText(this, window.innerWidth / 2 - 250, window.innerHeight / 2 - 20, "2nd player", this._style);
        const tank2: Phaser.GameObjects.Sprite = this.add.sprite(window.innerWidth / 2 + 130, window.innerHeight / 2, "objects", "player_tank");
        tank2.setInteractive({ useHandCursor: true });
        tank2.on("pointerdown", () => {
            this._buttonClick.play();
            if (!this._tank2Rect.visible) {
                this._data.secondPlayer.vehicle = "tank";
                this._data.secondPlayer.shellType = "bulletRed2";
                this._tank2Rect.visible = true;
                this._ifv2Rect.visible = false;
            }
        });
        const ifv2: Phaser.GameObjects.Sprite = this.add.sprite(window.innerWidth / 2 + 230, window.innerHeight / 2, "objects", "player_ifv");
        ifv2.setInteractive({ useHandCursor: true });
        ifv2.on("pointerdown", () => {
            this._buttonClick.play();
            if (!this._ifv2Rect.visible) {
                this._data.secondPlayer.vehicle = "ifv";
                this._data.secondPlayer.shellType = "bulletSand1";
                this._ifv2Rect.visible = true;
                this._tank2Rect.visible = false;
            }
        });

        this.add.graphics()
            .fillStyle(0xE7590D)
            .fillRoundedRect(window.innerWidth / 2 - 100, window.innerHeight - 175, 200, 100, 16);
        const startButtonText: Phaser.GameObjects.Text = createText(this, window.innerWidth / 2 - 69, window.innerHeight - 155, "Start", this._style);
        startButtonText.setInteractive({ useHandCursor: true });
        startButtonText.once("pointerdown", () => {
            this._buttonClick.play();
            this.scene.start("prelevel-scene", { data: this._data })
        });
    }
}