import DisplayLink from "main";
import { App } from "obsidian";

let statusBarItemEl: HTMLElement;

export function createStatusBar(plugin: DisplayLink): HTMLElement {
    const statusBarItem = plugin.addStatusBarItem();
    statusBarItemEl = statusBarItem;
    statusBarItemEl.setText("Warte auf eingabe");

    return statusBarItem;
}

export function getStatusBarItemEl(): HTMLElement {
    if(!statusBarItemEl) {
        throw new Error("StatusBarItemEl is not initialized");
    }
    return statusBarItemEl;
}