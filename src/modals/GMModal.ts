import DisplayLink from "main";
import { App, Modal, Notice } from "obsidian";

export class GMModal extends Modal {
    constructor(app: App, public plugin: DisplayLink) {
        super(app);
    }

    onOpen() {
        let { contentEl } = this;
        contentEl.style.display = 'flex';
        contentEl.style.flexDirection = 'column';
        contentEl.style.gap = '10px';
        let input1 = contentEl.createEl('input', { type: 'text', placeholder: 'GM Tip Titel' });
        let input2 = contentEl.createEl('input', { type: 'text', placeholder: 'GM Tip Text' });

        input1.style.width = '75%';
        input2.style.width = '75%';

        let buttonGroup = contentEl.createDiv('button-group');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '4px';

        let resetButton = buttonGroup.createEl('button', { text: 'Zurücksetzen' });
        resetButton.addEventListener('click', async () => {
            await fetch(this.plugin.settings.displayURL + "/api/tip/reset", {
                method: "POST"
            });
            new Notice('Erfolgreich zurückgesetzt!');
            this.close();
        });
        resetButton.style.marginLeft = 'auto';
        resetButton.style.backgroundColor = 'red';

        let confirmButton = buttonGroup.createEl('button', { text: 'Bestätigen' });
        confirmButton.addEventListener('click', async () => {
            await fetch(this.plugin.settings.displayURL + "/api/tip/", {
                method: "POST",
                body: JSON.stringify({
                    title: input1.value,
                    description: input2.value,
                }),
            });
            new Notice('Erfolgreich bestätigt!');
            this.close();
        });
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}