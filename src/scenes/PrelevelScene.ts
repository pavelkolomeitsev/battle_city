import { createText, LevelData } from "../utils/utils";

export default class PrelevelScene extends Phaser.Scene {
    private _data: LevelData = null;
    private _timer1: Phaser.Time.TimerEvent = null;
    private _timer2: Phaser.Time.TimerEvent = null;
    private _levelNumberStyle: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _levelNameStyle: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _melody: Phaser.Sound.BaseSound = null;

    constructor() { super({ key: "prelevel-scene" }) }
    
    protected preload(): void {
        this._levelNumberStyle = { fontFamily: "RussoOne", fontSize: "60px", color: "#E62B0D" };
        this._levelNameStyle = { fontFamily: "RussoOne", fontSize: "80px", color: "#E62B0D" };
        this._melody = this.sound.add('prelevelMelody');
    }

    protected create(data: any): void {
        this._data = data.data;
        let levelNumber: string = data.data.nextLevelNumber;
        levelNumber = levelNumber.replace("-", " ");
        const levelNumberText: Phaser.GameObjects.Text = createText(this, 0, 300, levelNumber, this._levelNumberStyle);
        levelNumberText.setX(this.sys.game.canvas.width / 2 - levelNumberText.width / 2);
        let levelName: string = data.data.nextLevelName;
        const levelNameText: Phaser.GameObjects.Text = createText(this, 0, 400, levelName, this._levelNameStyle);
        levelNameText.setX(this.sys.game.canvas.width / 2 - levelNameText.width / 2);
        this._timer1 = this.time.addEvent({ // play melody in 0.4 sec
            delay: 400,
            loop: false,
            callback: this.playMelody,
            callbackScope: this
        });
        this._timer2 = this.time.addEvent({ // start level scene in 4.2 sec
            delay: 4200,
            loop: false,
            callback: this.startNextLevel,
            callbackScope: this
        });
    }

    private playMelody(): void {
        this._melody.play();
        this._timer1.remove();
    }

    private startNextLevel(): void {
        this.scene.start(this._data.nextLevelNumber, { data: this._data });
        this._timer2.remove();
    }
}