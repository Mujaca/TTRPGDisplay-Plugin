import DisplayLink from "main";
import { createApp, App as VueApp } from "vue";
import { App, Modal, Notice } from "obsidian";
import EnemyModalVue from "./Views/EnemyModal.vue";

export class EnemyModal extends Modal {
    vueApp: VueApp;
    constructor(app: App, public plugin: DisplayLink) {
        super(app);
        this.vueApp = createApp(EnemyModalVue);
    }

    onOpen() {
        let { contentEl } = this;
        this.vueApp.mount(contentEl);
    }

    onClose() {
        let { contentEl } = this;
        this.vueApp?.unmount();
        contentEl.empty();
    }
}