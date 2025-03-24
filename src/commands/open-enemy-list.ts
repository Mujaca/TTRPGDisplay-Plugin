import { view_type } from "ItemView/EnemyList";
import { Command, WorkspaceLeaf } from "obsidian";

export default async function callback() {
    // @ts-ignore
    let leaf: WorkspaceLeaf | null = app.workspace.getLeavesOfType(view_type)[0];

    if (!leaf) {
        // @ts-ignore
        leaf = app.workspace.getRightLeaf(false); 
        await leaf?.setViewState({ type: view_type, active: true });
      }
  
      // @ts-ignore
      app.workspace.revealLeaf(leaf);
}

export const openEnemyListCommand:Command = {
    id: "open-enemy-list",
    name: "Open the enemy list view",
    callback: callback,
}