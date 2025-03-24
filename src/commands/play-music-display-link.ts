import { Command } from "obsidian";
import { getCurrentSettings } from "settings";

export default async function callback() {
    const settings = await getCurrentSettings();
    fetch(settings.displayURL + "/api/audio/play", {
        method: "POST",
    });
}

export const playMusicCommand:Command = {
    id: "play-music-display-link",
    name: "Play the Display Link current music",
    callback: callback,
}