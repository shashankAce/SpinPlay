import { GameObjects, Tweens } from "phaser";
import { TitleOverlay } from "./TitleOverlay";
import { Config } from "./Config";
import { Sprite } from "./GameObjects/Sprite";
import { SpinWheel } from "./SpinWheel";
import { CoinShower } from "./CoinShower";
import { Button } from "./GameObjects/Button";
import { clientEvent } from "./EventListener/clientEvent";
import { EventName } from "./EventListener/EventName";
import { Presets } from "./Presets";

export type GAME_DATA = {
    credits: number[],
    weight: number[],
    presets: number[]
}

export class PlayGame extends Phaser.Scene {
    private wheel: SpinWheel;
    private soundManager: any;
    private gameData: GAME_DATA;

    private isSpinPressed: Boolean = false;

    private fpsLabel: GameObjects.Text;
    private lastUpdateTime: number;
    private frameCount: number;

    private presetLabel: GameObjects.Text;
    private presetValue: number = -1;

    private winningLabel: GameObjects.Text;

    private creditsLabel: GameObjects.Text;
    private creditsValue: number = 0;
    private coinShower: CoinShower;
    titleOverlay: TitleOverlay;
    landing_audio: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    spinBtn: Button;
    presetsContiner: Presets;

    constructor() {
        super({
            key: 'PlayGame'
        });

        clientEvent.on(EventName.preset_pick, this.applyPreset, this);
    }

    async create() {
        // LOADING GAME DATA FROM FILE
        this.gameData = this.cache.json.get('configuration');

        let g_width = Config.gameSize.width;
        let g_height = Config.gameSize.height;

        let bgimage = new Sprite(this, g_width / 2, g_height / 2, "background");
        bgimage.setOrigin(0.5);
        bgimage.scale = g_width / bgimage.width;
        this.add.existing(bgimage);

        // ADDING SPIN BUTTON
        let buttonSize = { width: 350, height: 80 };
        let button_posi = { x: g_width / 2, y: 1000 };

        this.spinBtn = new Button(this);
        this.spinBtn.create(button_posi.x, button_posi.y, buttonSize.width, buttonSize.height, this.onSpinClick.bind(this));
        this.spinBtn.addText('PRESS TO SPIN');
        this.add.existing(this.spinBtn);


        // ADDING SPIN WHEEL
        const pointer = new Sprite(this, g_width / 2, 185, 'pointer');
        this.add.existing(pointer);

        this.wheel = new SpinWheel(this);
        this.wheel.create(this.gameData);
        this.wheel.x = g_width / 2;
        this.wheel.y = g_height / 2;
        this.wheel.setScale(.7);

        // ADDING PRESETS CHEAT
        this.presetsContiner = new Presets(this);
        this.presetsContiner.create(this.gameData);
        this.presetsContiner.setPosition(Config.gameSize.width - 200, 70);

        this.presetLabel = new GameObjects.Text(this, Config.gameSize.width - 20, Config.gameSize.height - 200, '', {
            fontSize: '50px',
            color: '#00ff00'
        }).setOrigin(1, 0.5);
        this.add.existing(this.presetLabel);

        this.coinShower = new CoinShower(this);

        this.winningLabel = new GameObjects.Text(this, g_width / 2, 70, ``, {
            fontSize: '70px',
            color: '#ffffff',
            stroke: '#ff0000',
            strokeThickness: 4,
        }).setOrigin(0.5, 0);
        this.add.existing(this.winningLabel);

        this.titleOverlay = new TitleOverlay(this);

        // ADDING CREDIT INFO AND WINNING
        this.creditsLabel = new GameObjects.Text(this, 20, 20, 'Credits Balance 0', {
            fontSize: '40px',
        }).setOrigin(0, 0);
        this.add.existing(this.creditsLabel);

        // FPS TRACKING
        this.fpsLabel = new GameObjects.Text(this, 100, g_height - 50, 'Fps', {
            fontSize: '20px',
            color: '#00ff00'
        }).setOrigin(0.5);
        this.add.existing(this.fpsLabel);

        this.lastUpdateTime = performance.now();
        this.frameCount = 0;

        this.landing_audio = this.sound.add("wheel-landing");
        this.addParticle();
    }

    private applyPreset(preset: number) {
        if (this.isSpinPressed)
            return;
        this.presetValue = preset;
        this.presetLabel.setText(`Preset Applied ${preset}`);
    }

    async onSpinClick() {
        if (!this.isSpinPressed) {
            this.isSpinPressed = true;

            this.spinBtn.disableClick(true);
            this.presetsContiner.disableClick(true);

            this.winningLabel.setText("");
            // this.soundManager.playSound(1);

            if (this.presetValue == -1) {

                let indx = this.getRandWeight(this.gameData.weight);
                this.presetLabel.setText(`Random Credit ${this.gameData.credits[indx]}`);

                await this.wheel.spin(indx);
                this.onSpinComplete(this.gameData.credits[indx]);

            }
            else {

                let index = this.gameData.credits.indexOf(this.presetValue);
                await this.wheel.spin(index);
                this.onSpinComplete(this.presetValue);
            }
        }

    }

    async onSpinComplete(value: number) {
        this.winningLabel.setText(`YOU WON ${value} CREDITS!`);
        this.landing_audio.once('complete', () => {
            this.addCredits(value);
            this.coinShower.dropCoins(() => {
                this.titleOverlay.show(() => {
                    this.reset();
                });
            });
        });
        this.landing_audio.play();
    }

    reset() {
        this.presetLabel.setText("");
        this.presetValue = -1;
        this.isSpinPressed = false;
        this.spinBtn.disableClick(false);
        this.presetsContiner.disableClick(false);
    }

    private getRandWeight(weights: number[]) {
        let totalWeight = 0, i, random;
        for (i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        random = Math.random() * totalWeight;
        for (i = 0; i < weights.length; i++) {
            if (random < weights[i]) {
                return i;
            }
            random -= weights[i];
        }
        return -1;
    }

    update(time: number, delta: number): void {
        this.trackFps();
    }

    private trackFps() {
        this.frameCount++;
        const currentTime = performance.now();
        if (currentTime - this.lastUpdateTime >= 1000) {
            const fps = this.frameCount;
            this.fpsLabel.setText(`FPS: ${fps}`);
            this.frameCount = 0;
            this.lastUpdateTime = currentTime;
        }
    }

    async addCredits(value: number) {
        return new Promise((resolve: Function, reject) => {
            this.sound.play("credits-rollup", {
                volume: 1,
                rate: 1,
                loop: true,
                delay: 0
            });

            this.tweens.addCounter({
                from: this.creditsValue,
                to: this.creditsValue + value,
                ease: 'Linear',
                duration: 2000,
                onUpdate: (tween) => {
                    let value = Math.floor(tween.getValue());
                    this.creditsLabel.setText(`Credit Balance ${value}`);
                },
                onComplete: () => {
                    this.creditsValue += value;
                    this.sound.stopByKey("credits-rollup");
                    resolve();
                }
            });
        })

    }

    private addParticle() {

        let g_width = Config.gameSize.width;
        let g_height = Config.gameSize.height;

        const particles = this.add.particles(0, 0, 'snow-particle', {
            x: 0,
            y: 0,
            // emitZone
            emitZone: {
                source: new Phaser.Geom.Rectangle(-100, -100, g_width + 100, 100),
                type: 'random',
                quantity: 70
            },
            speedY: { min: 50, max: 70 },
            speedX: { min: -20, max: 20 },
            accelerationY: { random: [10, 15] },
            // lifespan
            lifespan: { min: 8000, max: 10000 },
            scale: .1,
            alpha: { random: [0.1, 0.8] },
            gravityY: 20,
            frequency: 100,
            blendMode: 'SCREEN',
        });
    }
}