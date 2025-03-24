import {
	App,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
    TFile,
} from "obsidian";

interface DisplayLinkSettings {
	displayURL: string;
}

const DEFAULT_SETTINGS: DisplayLinkSettings = {
	displayURL: "http://localhost:3000",
};

export default class DisplayLink extends Plugin {
	settings: DisplayLinkSettings;
    statusBar: HTMLElement;

	async onload() {
		await this.loadSettings();

        const ribbonIconGMModal = this.addRibbonIcon('pencil', 'Display Link', (evt: MouseEvent) => {
			new GMModal(this.app, this).open();
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
        this.statusBar = statusBarItemEl;
		statusBarItemEl.setText("Warte auf eingabe");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "send-to-display-link",
			name: "Send to Display Link",
			callback: () => {
				this.sendToDisplayLink();
			},
		});

        this.addCommand({
			id: "reset-display-link",
			name: "Reset the Display Link back to the default stuff",
			callback: () => {
                fetch(this.settings.displayURL + "/api/reset", {
                    method: "POST",
                });
			},
		});

        this.addCommand({
			id: "play-music-display-link",
			name: "Play the Display Link current music",
			callback: () => {
                fetch(this.settings.displayURL + "/api/audio/play", {
                    method: "POST",
                });
			},
		});

        this.addCommand({
			id: "pause-music-display-link",
			name: "Pause the Display Link current music",
			callback: () => {
                fetch(this.settings.displayURL + "/api/audio/pause", {
                    method: "POST",
                });
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async sendToDisplayLink() {
		const url = this.settings.displayURL + "/api/update";
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView && activeView.file) {
			const metaData = activeView.app.metadataCache.getFileCache(
				activeView.file
			);
			const title = activeView.file?.basename;

			let imagePath;
            if(metaData?.frontmatter?.["image"]) imagePath = this.app.metadataCache.getFirstLinkpathDest(
				metaData?.frontmatter?.["image"]
					?.replaceAll("[", "")
					.replaceAll("]", ""),
				"./"
			);
			let audioPath;
            if(metaData?.frontmatter?.["audio"]) audioPath = this.app.metadataCache.getFirstLinkpathDest(
				metaData?.frontmatter?.["audio"]
					?.replaceAll("[", "")
					.replaceAll("]", ""),
				"./"
			);

			const requestObject: { [key: string]: any } = {
				title,
			};

			if (metaData?.frontmatter?.["description"])
				requestObject.description =
					metaData?.frontmatter?.["description"];

			if (imagePath) {
                const res = await this.uploadFile(imagePath);
				requestObject.image = imagePath.name;
			}

            if(audioPath) {
                const res = await this.uploadFile(audioPath);
                requestObject.audio = audioPath.name;
            }

			await fetch(url, {
				method: "POST",
				body: JSON.stringify(requestObject),
			});
            this.statusBar.setText(`Zeige ${title} auf Display Link`);
		}
	}

    async uploadFile(file: TFile) {
        const fileData = await this.app.vault.readBinary(file);
        const formdata = new FormData();
        formdata.append("file", new Blob([fileData]), file.name);

        const res = await fetch(this.settings.displayURL + "/api/upload", {
            method: "POST",
            body: formdata,
        });

        return res;
    }
}

class SampleSettingTab extends PluginSettingTab {
	plugin: DisplayLink;

	constructor(app: App, plugin: DisplayLink) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Display Link URL")
			.setDesc("The URL the display link is reachable")
			.addText((text) =>
				text
					.setPlaceholder("Enter the URL")
					.setValue(this.plugin.settings.displayURL)
					.onChange(async (value) => {
						this.plugin.settings.displayURL = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

class GMModal extends Modal {
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