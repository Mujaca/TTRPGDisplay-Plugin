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
import { openEnemyListCommand } from "commands/open-enemy-list";
import { EnemyListView, view_type } from "ItemView/EnemyList";
import { sendToEnemyListCommand } from "commands/send-to-enemy-list";
import { rebuildMonsterArray } from "manager/BestiarumManager";
import { BeastiarumModal } from "modals/BeastiarumModal";

import * as BestiarumManager from "manager/BestiarumManager";

export default class DisplayLink extends Plugin {
	settings: DisplayLinkSettings;
    statusBar: HTMLElement;

	async onload() {
		await this.loadSettings();

        this.registerView(
            view_type,
            (leaf) => new EnemyListView(leaf)
        );

        this.addRibbonIcon('pencil', 'Display Link', (evt: MouseEvent) => {
			new GMModal(this.app, this).open();
		});

        this.addRibbonIcon('star', 'Beastiarum', (evt: MouseEvent) => {
			new BeastiarumModal(this.app, this).open();
		});

		createStatusBar(this);

        this.addCommand(sendToDisplayLinkCommand);
        this.addCommand(resetDisplayLinkCommand);
        this.addCommand(playMusicCommand);
        this.addCommand(pauseMusicCommand);
        this.addCommand(openEnemyListCommand);
        this.addCommand(sendToEnemyListCommand);

		this.addSettingTab(new TTRPGSettingTab(this.app, this));

        rebuildMonsterArray();

        this.registerEvent(this.app.vault.on("create", (event) => {
            BestiarumManager.handleCreateEvent(event);
        }));

        this.registerEvent(this.app.vault.on("modify", (event) => {
            console.log("File modified: ", event.path);
            BestiarumManager.handleUpdateEvent(event);
        }));

        this.registerEvent(this.app.vault.on("delete", (event) => {
            BestiarumManager.handleDeleteEvent(event);
        }))

        this.registerEvent(this.app.vault.on("rename", (eventNewFile, oldPath) => {
            BestiarumManager.handleRenameEvent(eventNewFile, oldPath);
        }))
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

