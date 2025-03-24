import DisplayLink from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface DisplayLinkSettings {
	displayURL: string;
}

export const DEFAULT_SETTINGS: DisplayLinkSettings = {
	displayURL: "http://localhost:3000",
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
    }
}

let currentSettings : DisplayLinkSettings | null = null;

export async function getCurrentSettings() {
    if (currentSettings) {
        return currentSettings;
    }
    // ts ignore, because app is a global variable
    // @ts-ignore
    const settings = await app.vault.getConfig("displayLinkSettings");
    if (settings) {
        currentSettings = settings;
        return settings;
    }
    return DEFAULT_SETTINGS;
}