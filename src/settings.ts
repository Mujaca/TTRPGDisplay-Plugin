import DisplayLink from "main";
import { rebuildMonsterArray } from "manager/BestiarumManager";
import { App, PluginSettingTab, Setting } from "obsidian";
import { FolderSuggest } from "utils/helper";

export interface DisplayLinkSettings {
	displayURL: string;
    bestiarumFolder: string;
}

export const DEFAULT_SETTINGS: DisplayLinkSettings = {
	displayURL: "http://localhost:3000",
    bestiarumFolder: "Bestiarum",
};

export class TTRPGSettingTab extends PluginSettingTab {
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
        
        new Setting(containerEl)
            .setName("Bestiarum Folder")
            .setDesc("The folder where the bestiarum entries are stored")
            .addSearch((search) => {
                search.setPlaceholder("Select the folder")
                    .setValue(this.plugin.settings.bestiarumFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.bestiarumFolder = value;
                        await this.plugin.saveSettings();
                    })
                    
                    const selector = new FolderSuggest(this.app, search.inputEl);
                    selector.onSelect((value) => {
                        search.setValue(value);
                        this.plugin.settings.bestiarumFolder = value;
                        this.plugin.saveSettings();
                        rebuildMonsterArray();
                    });
            })
    }
}

let currentSettings : DisplayLinkSettings | null = null;

export async function getCurrentSettings() {
    console.log("settings ", currentSettings)
    if (currentSettings) {
        return currentSettings;
    }

    // ts ignore, because app is a global variable
    // @ts-ignore
    console.log("settings from vault ", app.plugins.plugins["de-mujaca-ttrpg-display-link"].settings) // @ts-ignore
    // @ts-ignore
    const settings = app.plugins.plugins["de-mujaca-ttrpg-display-link"].settings;
    if (settings) {
        currentSettings = settings;
        return settings;
    }
    return DEFAULT_SETTINGS;
}