import { createText, LevelData } from "../utils/utils";

export default class PostlevelScene extends Phaser.Scene {
    private _data: LevelData = null;
    private _startTimer: Phaser.Time.TimerEvent = null;
    private _endTimer: Phaser.Time.TimerEvent = null;
    private _1PlayerBtrTween: Phaser.Tweens.Tween = null;
    private _1PlayerBtrText: Phaser.GameObjects.Text = null;
    private _1PlayerBmpTween: Phaser.Tweens.Tween = null;
    private _1PlayerBmpText: Phaser.GameObjects.Text = null;
    private _1PlayerTankTween: Phaser.Tweens.Tween = null;
    private _1PlayerTankText: Phaser.GameObjects.Text = null;
    private _1PlayerTotalTween: Phaser.Tweens.Tween = null;
    private _1PlayerTotalText: Phaser.GameObjects.Text = null;
    private _1PlayerTotal: number = 0;
    private _2PlayerBtrTween: Phaser.Tweens.Tween = null;
    private _2PlayerBtrText: Phaser.GameObjects.Text = null;
    private _2PlayerBmpTween: Phaser.Tweens.Tween = null;
    private _2PlayerBmpText: Phaser.GameObjects.Text = null;
    private _2PlayerTankTween: Phaser.Tweens.Tween = null;
    private _2PlayerTankText: Phaser.GameObjects.Text = null;
    private _2PlayerTotalTween: Phaser.Tweens.Tween = null;
    private _2PlayerTotalText: Phaser.GameObjects.Text = null;
    private _2PlayerTotal: number = 0;
    private _header: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _mainStyle: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _secondaryStyle: Phaser.Types.GameObjects.Text.TextStyle = null;
    private _melody: Phaser.Sound.BaseSound = null;
    private _coinSound: Phaser.Sound.BaseSound = null;
    private _width: number = null;

    constructor() { super({ key: "postlevel-scene" });}
    
    protected preload(): void {
        this._header = { fontFamily: "RussoOne", fontSize: "70px", color: "#00FF00" };
        this._mainStyle = { fontFamily: "RussoOne", fontSize: "65px", color: "#00FF00" };
        this._secondaryStyle = { fontFamily: "RussoOne", fontSize: "50px", color: "#00FF00" };
        this._melody = this.sound.add("mainMelody", { volume: 0.4, loop: true });
        this._coinSound = this.sound.add("coinSound", { volume: 1, loop: true });
        this._width = this.sys.game.canvas.width;
    }

    protected create({data}): void {
        this._data = data;

        // start counting points in 0.8 sec
        this._startTimer = this.time.addEvent({
            delay: 800,
            loop: false,
            callback: this.startCountPoints,
            callbackScope: this
        });

        const levelNumberText: Phaser.GameObjects.Text = createText(this, 0, 150, "Level complete!", this._header);
        levelNumberText.setX(this.sys.game.canvas.width / 2 - levelNumberText.width / 2);
        
        if (this._data.firstPlayer) this.firstPlayerResults();
        if (this._data.secondPlayer) this.secondPlayerResults();
        this._melody.play();
    }

    private startCountPoints(): void {
        if (this._data.firstPlayer) this._1PlayerBtrTween.resume();
        if (this._data.secondPlayer) this._2PlayerBtrTween.resume();
        this._startTimer.remove();
        this._coinSound.play();
    }

    private firstPlayerResults(): void {
        this._1PlayerTotal = this._data.firstPlayer.btrPerLevel * 1 + this._data.firstPlayer.bmpPerLevel * 2 + this._data.firstPlayer.tanksPerLevel * 3;
        const header: Phaser.GameObjects.Text = createText(this, 250, 250, "1st player", this._mainStyle);
        this._1PlayerBtrText = createText(this, 250, 330, `BTRs: ${this._data.firstPlayer.btrPerLevel} × 1xp = 0xp`, this._secondaryStyle);
        this._1PlayerBmpText = createText(this, 250, 410, `BMPs: ${this._data.firstPlayer.bmpPerLevel} × 2xp = 0xp`, this._secondaryStyle);
        this._1PlayerTankText = createText(this, 250, 490, `Tanks: ${this._data.firstPlayer.tanksPerLevel} × 3xp = 0xp`, this._secondaryStyle);
        const dash: Phaser.GameObjects.Text = createText(this, 250, 510, "_____________________", this._secondaryStyle);
        this._1PlayerTotalText = createText(this, 250, 580, `Total: 0xp`, this._secondaryStyle);
        header.setX(this._1PlayerTankText.width / 3);
        this._1PlayerBtrText.setX(this._1PlayerTankText.width / 3);
        this._1PlayerBmpText.setX(this._1PlayerTankText.width / 3);
        this._1PlayerTankText.setX(this._1PlayerTankText.width / 3);
        dash.setX(this._1PlayerTankText.width / 3);
        this._1PlayerTotalText.setX(this._1PlayerTankText.width / 3);

        this._1PlayerBtrTween = this.tweens.addCounter({
            from: 0,
            to: this._data.firstPlayer.btrPerLevel * 1,
            duration: 1000,
            paused: true,
            onComplete: () => this._1PlayerBmpTween.resume()
        });
        this._1PlayerBmpTween = this.tweens.addCounter({
            from: 0,
            to: this._data.firstPlayer.bmpPerLevel * 2,
            duration: 1000,
            paused: true,
            onComplete: () => this._1PlayerTankTween.resume()
        });
        this._1PlayerTankTween = this.tweens.addCounter({
            from: 0,
            to: this._data.firstPlayer.tanksPerLevel * 3,
            duration: 1000,
            paused: true,
            onComplete: () => this._1PlayerTotalTween.resume()
        });
        this._1PlayerTotalTween = this.tweens.addCounter({
            from: 0,
            to: this._1PlayerTotal,
            duration: 1500,
            paused: true,
            onComplete: () => this.pauseBeforeCloseScene()
        });
    }

    private secondPlayerResults(): void {
        this._2PlayerTotal = this._data.secondPlayer.btrPerLevel * 1 + this._data.secondPlayer.bmpPerLevel * 2 + this._data.secondPlayer.tanksPerLevel * 3;
        const header: Phaser.GameObjects.Text = createText(this, this._width - 750, 250, "2nd player", this._mainStyle);
        this._2PlayerBtrText = createText(this, this._width - 750, 330, `BTRs: ${this._data.secondPlayer.btrPerLevel} × 1xp = 0xp`, this._secondaryStyle);
        this._2PlayerBmpText = createText(this, this._width - 750, 410, `BMPs: ${this._data.secondPlayer.bmpPerLevel} × 2xp = 0xp`, this._secondaryStyle);
        this._2PlayerTankText = createText(this, this._width - 750, 490, `Tanks: ${this._data.secondPlayer.tanksPerLevel} × 3xp = 0xp`, this._secondaryStyle);
        const dash: Phaser.GameObjects.Text = createText(this, this._width - 750, 510, "_____________________", this._secondaryStyle);
        this._2PlayerTotalText = createText(this, this._width - 750, 580, `Total: 0xp`, this._secondaryStyle);
        header.setX(this._width - this._2PlayerTankText.width - this._2PlayerTankText.width / 3);
        this._2PlayerBtrText.setX(this._width - this._2PlayerTankText.width - this._2PlayerTankText.width / 3);
        this._2PlayerBmpText.setX(this._width - this._2PlayerTankText.width - this._2PlayerTankText.width / 3);
        this._2PlayerTankText.setX(this._width - this._2PlayerTankText.width - this._2PlayerTankText.width / 3);
        dash.setX(this._width - this._2PlayerTankText.width - this._2PlayerTankText.width / 3);
        this._2PlayerTotalText.setX(this._width - this._2PlayerTankText.width - this._2PlayerTankText.width / 3);

        this._2PlayerBtrTween = this.tweens.addCounter({
            from: 0,
            to: this._data.secondPlayer.btrPerLevel * 1,
            duration: 1000,
            paused: true,
            onComplete: () => this._2PlayerBmpTween.resume()
        });
        this._2PlayerBmpTween = this.tweens.addCounter({
            from: 0,
            to: this._data.secondPlayer.bmpPerLevel * 2,
            duration: 1000,
            paused: true,
            onComplete: () => this._2PlayerTankTween.resume()
        });
        this._2PlayerTankTween = this.tweens.addCounter({
            from: 0,
            to: this._data.secondPlayer.tanksPerLevel * 3,
            duration: 1000,
            paused: true,
            onComplete: () => this._2PlayerTotalTween.resume()
        });
        this._2PlayerTotalTween = this.tweens.addCounter({
            from: 0,
            to: this._2PlayerTotal,
            duration: 1500,
            paused: true,
            onComplete: this._data.firstPlayer ? () => { } : () => this.pauseBeforeCloseScene()
        });
    }

    private pauseBeforeCloseScene(): void {
        this._coinSound.stop();
        this._endTimer = this.time.delayedCall(2000, this.startNextLevel, null, this)
    }

    private startNextLevel(): void {
        this._endTimer.remove();
        this._melody.stop();
        this.scene.start("prelevel-scene", { data: this._data })
    }

    update(): void {
        if (this._data.firstPlayer) {
            this._1PlayerBtrText.setText(`BTRs: ${this._data.firstPlayer.btrPerLevel} × 1xp = ${this._1PlayerBtrTween.getValue().toFixed(0)}xp`);
            this._1PlayerBmpText.setText(`BMPs: ${this._data.firstPlayer.bmpPerLevel} × 2xp = ${this._1PlayerBmpTween.getValue().toFixed(0)}xp`);
            this._1PlayerTankText.setText(`Tanks: ${this._data.firstPlayer.tanksPerLevel} × 3xp = ${this._1PlayerTankTween.getValue().toFixed(0)}xp`);
            this._1PlayerTotalText.setText(`Total: ${this._1PlayerTotalTween.getValue().toFixed(0)}xp`);
        }

        if (this._data.secondPlayer) {
            this._2PlayerBtrText.setText(`BTRs: ${this._data.secondPlayer.btrPerLevel} × 1xp = ${this._2PlayerBtrTween.getValue().toFixed(0)}xp`);
            this._2PlayerBmpText.setText(`BMPs: ${this._data.secondPlayer.bmpPerLevel} × 2xp = ${this._2PlayerBmpTween.getValue().toFixed(0)}xp`);
            this._2PlayerTankText.setText(`Tanks: ${this._data.secondPlayer.tanksPerLevel} × 3xp = ${this._2PlayerTankTween.getValue().toFixed(0)}xp`);
            this._2PlayerTotalText.setText(`Total: ${this._2PlayerTotalTween.getValue().toFixed(0)}xp`);
        }
    }
}