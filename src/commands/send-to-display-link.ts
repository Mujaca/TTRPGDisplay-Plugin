import { Command, MarkdownView, TFile } from "obsidian";
import { getCurrentSettings } from "settings";

export default async function callback() {
	const settings = await getCurrentSettings();
	const url = settings.displayURL + "/api/update";

    //@ts-ignore
	const activeView = app.workspace.getActiveViewOfType(MarkdownView);
	if (activeView && activeView.file) {
		const metaData = activeView.app.metadataCache.getFileCache(
			activeView.file
		);
		const title = activeView.file?.basename;

		let imagePath;
		if (metaData?.frontmatter?.["image"])
            //@ts-ignore
			imagePath = app.metadataCache.getFirstLinkpathDest(
				metaData?.frontmatter?.["image"]
					?.replaceAll("[", "")
					.replaceAll("]", ""),
				"./"
			);
		let audioPath;
		if (metaData?.frontmatter?.["audio"])
            //@ts-ignore
			audioPath = app.metadataCache.getFirstLinkpathDest(
				metaData?.frontmatter?.["audio"]
					?.replaceAll("[", "")
					.replaceAll("]", ""),
				"./"
			);

		const requestObject: { [key: string]: any } = {
			title,
		};

		if (metaData?.frontmatter?.["description"])
			requestObject.description = metaData?.frontmatter?.["description"];

		if (imagePath) {
			const res = await uploadFile(imagePath);
			requestObject.image = imagePath.name;
		}

		if (audioPath) {
			const res = await uploadFile(audioPath);
			requestObject.audio = audioPath.name;
		}

		await fetch(url, {
			method: "POST",
			body: JSON.stringify(requestObject),
		});
		//this.statusBar.setText(`Zeige ${title} auf Display Link`);
	}
}

export const sendToDisplayLinkCommand: Command = {
	id: "send-to-display-link",
	name: "Send to Display Link",
	callback: callback,
};

async function uploadFile(file: TFile) {
	const settings = await getCurrentSettings();
	const fileData = await this.app.vault.readBinary(file);
	const formdata = new FormData();
	formdata.append("file", new Blob([fileData]), file.name);

	const res = await fetch(settings.displayURL + "/api/upload", {
		method: "POST",
		body: formdata,
	});

	return res;
}
