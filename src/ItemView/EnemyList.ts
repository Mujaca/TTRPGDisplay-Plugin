import { ItemView, WorkspaceLeaf } from "obsidian";
import { createApp, App as VueApp } from "vue";
import EnemyList from "./Views/EnemyList.vue";

export const view_type = "enemy-list";

export class EnemyListView extends ItemView {
	vueApp: VueApp;

	constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.vueApp = createApp(EnemyList);
	}

	getViewType(): string {
		return view_type;
	}

	getDisplayText(): string {
		return "Enemy List Controller";
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl;
		container.empty();
		let content = container.createEl("div", {
			cls: "my-plugin-view",
		});
        content.style = "height: 100%";

		this.vueApp.mount(content);
	}

	async onClose() {
		this.vueApp?.unmount();
	}
}
