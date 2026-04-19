import { AbstractInputSuggest, TFolder } from "obsidian";

export class FolderSuggest extends AbstractInputSuggest<string> {
	protected getSuggestions(query: string): string[] | Promise<string[]> {
		const folders = this.app.vault.getAllLoadedFiles();

		const folderPaths = folders
			.filter((file) => file instanceof TFolder)
			.filter((folder) =>
				folder.path.toLowerCase().includes(query.toLowerCase()),
			)
			.map(
				(folder) =>
					`${folder.path.endsWith("/") ? folder.path : folder.path + "/"}`,
			);

		return folderPaths;
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		el.setText(value);
	}
}
