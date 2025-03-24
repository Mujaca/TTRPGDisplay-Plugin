import { Command } from "obsidian";
import { getCurrentSettings } from "settings";

export default async function callback() {
    const settings = await getCurrentSettings();
    fetch(settings.displayURL + "/api/reset", {
        method: "POST",
    });
}

export const resetDisplayLinkCommand:Command = {
    id: "reset-display-link",
    name: "Reset the Display Link back to the default stuff",
    callback: callback,
}