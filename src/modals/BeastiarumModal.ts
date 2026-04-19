import DisplayLink from "main";
import { createApp, App as VueApp } from "vue";
import { App, Modal, Notice } from "obsidian";
import BeastiarumModalVue from "./Views/Beastiarum.vue";

export class BeastiarumModal extends Modal {
	vueApp: VueApp;
	constructor(
		app: App,
		public plugin: DisplayLink,
	) {
		super(app);
		this.vueApp = createApp(BeastiarumModalVue);
	}

	onOpen() {
		let { contentEl } = this;
		if (contentEl.parentElement) {
			contentEl.parentElement.style.minWidth = "80%";
		}
		this.vueApp.mount(contentEl);
	}

	onClose() {
		let { contentEl } = this;
		this.vueApp?.unmount();
		contentEl.empty();
	}
}
