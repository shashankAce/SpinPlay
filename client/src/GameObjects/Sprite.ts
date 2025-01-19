
export class Sprite extends Phaser.GameObjects.Sprite {
    private isButton: boolean = false;

    constructor(
        scene: Phaser.Scene,
        x: number = 0,
        y: number = 0,
        texture: string | Phaser.Textures.Texture = '',
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.isButton = false;
    }

    setButtonEnabled(enabled: any) {
        this.isButton = enabled;

        if (enabled) {
            this.setInteractive();
            // this.on('pointerover', this.onHover, this);
            // this.on('pointerout', this.onOut, this);
            this.on('pointerdown', this.onClick, this);
        } else {
            this.disableInteractive();
            // this.off('pointerover', this.onHover, this);
            // this.off('pointerout', this.onOut, this);
            this.off('pointerdown', this.onClick, this);

            this.setTint(0xffffff);
        }
    }

    private onHover() {
        if (this.isButton) {
            this.setTint(0xcccccc);
        }
    }

    private onOut() {
        if (this.isButton) {
            this.setTint(0xffffff);
        }
    }

    private onClick() {
        if (this.isButton) {
            console.log('Button clicked:', this.texture.key);
            this.emit('buttonclick'); // Emit a custom event
        }
    }

    makeDraggable() {
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.displayWidth || 1, this.displayHeight || 1),
            Phaser.Geom.Rectangle.Contains)
    }
}