import { Command, MarkdownView } from "obsidian";
import { addEnemy, Enemy } from "utils/EnemyManager";

export default async function callback() {
	//@ts-ignore
	const activeView = app.workspace.getActiveViewOfType(MarkdownView);
	if (activeView && activeView.file) {
        const metaData = activeView.app.metadataCache.getFileCache(activeView.file);
        const title = activeView.file?.basename;

        let maxHp = 0;
        if (metaData?.frontmatter?.["LP"])
			maxHp = metaData?.frontmatter?.["LP"];
        
        if(typeof maxHp !== "number") maxHp = parseInt(maxHp);

        const enemy = new Enemy(title, maxHp);
        addEnemy(enemy);
    }
}

export const sendToEnemyListCommand: Command = {
	id: "send-to-enemy-list",
	name: "Sends the current opened enemy list to the display link",
	callback: callback,
};
