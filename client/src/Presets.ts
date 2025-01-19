import { GameObjects } from "phaser";
import { Button } from "./GameObjects/Button";
import { clientEvent } from "./EventListener/clientEvent";
import { EventName } from "./EventListener/EventName";
import { GAME_DATA } from "./PlayGame";

export class Presets extends GameObjects.Container {
    presetLabel: GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
    }

    create(gameData: GAME_DATA) {

        let margin = 10;
        let buttonSize = { width: 350, height: 80 };

        let btn = new Button(this.scene);
        btn.create(0, 0, buttonSize.width, buttonSize.height, () => { });
        btn.addText(`Click Presets`);
        btn.disableClick(true);
        this.add(btn);

        for (let index = 0; index < gameData.presets.length; index++) {
            const element = gameData.presets[index];

            let btn = new Button(this.scene);
            btn.id = element;
            btn.create(0, buttonSize.height * (index + 1) + margin * (index + 1), buttonSize.width, buttonSize.height, this.onOptionPick.bind(this));
            btn.addText(`${element}`);
            this.add(btn);

        }
    }

    onOptionPick(button: Button) {
        clientEvent.dispatchEvent(EventName.preset_pick, button.id);
    }
}