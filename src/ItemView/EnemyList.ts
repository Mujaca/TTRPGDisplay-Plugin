import { ItemView, WorkspaceLeaf } from "obsidian";

export const view_type = "enemy-list";

export class EnemyListView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return view_type;
    }

    getDisplayText(): string {
        return "";
    }
}