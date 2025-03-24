import { Command } from "obsidian";
import { getCurrentSettings } from "settings";

export default async function callback() {
    const settings = await getCurrentSettings();
    fetch(settings.displayURL + "/api/audio/pause", {
        method: "POST",
    });
}

export const pauseMusicCommand:Command = {
    id: "pause-music-display-link",
    name: "Pause the Display Link current music",
    callback: callback,
}