import { GMModal } from "modals/GMModal";
import {
	Plugin,
} from "obsidian";
import { DEFAULT_SETTINGS, DisplayLinkSettings, TTRPGSettingTab } from "settings";

import { resetDisplayLinkCommand } from "commands/reset-display-link";
import { playMusicCommand } from "commands/play-music-display-link";
import { pauseMusicCommand } from "commands/pause-music-display-link";
import { sendToDisplayLinkCommand } from "commands/send-to-display-link";
import { createStatusBar } from "statusBar";

export default class DisplayLink extends Plugin {
	settings: DisplayLinkSettings;
    statusBar: HTMLElement;

	async onload() {
		await this.loadSettings();

        const ribbonIconGMModal = this.addRibbonIcon('pencil', 'Display Link', (evt: MouseEvent) => {
			new GMModal(this.app, this).open();
		});

		createStatusBar(this);

        this.addCommand(sendToDisplayLinkCommand);
        this.addCommand(resetDisplayLinkCommand);
        this.addCommand(playMusicCommand);
        this.addCommand(pauseMusicCommand);

		this.addSettingTab(new TTRPGSettingTab(this.app, this));
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
}

