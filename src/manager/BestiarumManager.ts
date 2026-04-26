import { TAbstractFile, TFile } from "obsidian";
import { Observable, Subscriber } from "rxjs";
import { getCurrentSettings } from "settings";

export const species = [
    "Bestie",
    "Dämon",
    "Elementar",
    "Humanoid",
    "Konstrukt",
    "Monster",
    "Pflanze",
    "Untot"
]

// Hardcoded to german, may change in the future
export type MonsterData = {
    tags: string[];
	Stufe: number;
	Spezies:
		| "Bestie"
		| "Dämon"
		| "Elementar"
		| "Humanoid"
		| "Konstrukt"
		| "Monster"
		| "Pflanze"
		| "Untot";
	LP: number;
	GP: number;

	Initiative: number;
	Verteidigung: number;
	["Magische Verteidigung"]: number;

	Geschicklichkeit: string;
	Einsicht: string;
	Macht: string;
	Willenskraft: string;
};

export class Monster {
	name: string;
	path: string;

	data: MonsterData | undefined;

	constructor(name: string, path: string) {
		this.name = name;
		this.path = path;

		this.getData();
	}

	async getData(): Promise<MonsterData | undefined> {
		if (this.data) return this.data;

		await this.refreshData();

		return this.data;
	}

    async refreshData():Promise<MonsterData> {
        // ts ignore, because app is a global variable
		// @ts-ignore
		const file: TFile = (await app.vault.getAbstractFileByPath(
			this.path,
		)) as TFile;

		// @ts-ignore
		const frontMatter = app.metadataCache.getFileCache(file)?.frontmatter;
		if (!frontMatter) {
			throw new Error("No frontmatter found for monster: " + this.name);
		}

        const data = frontMatter as MonsterData;
        this.data = data;


        return data;
    }

}

type monsterObject = {
	[path: string]: Monster;
};

let monsters: monsterObject = {};

const monsterSubscriber: Subscriber<Monster[]>[] = [];

export const monsterObservable: Observable<Monster[]> = new Observable(
	(subscriber: Subscriber<Monster[]>) => {
		subscriber.next(getMonsters());
		monsterSubscriber.push(subscriber);

		return function unsubscribe() {
			const index = monsterSubscriber.indexOf(subscriber);
			if (index !== -1) {
				return monsterSubscriber.splice(index, 1);
			}

			subscriber.complete();
		};
	},
);

function updateMonsterForSubscriber() {
	monsterSubscriber.forEach((subscriber) => {
		subscriber.next(getMonsters());
	});
}

async function getBestiarumFolder() {
	const settings = await getCurrentSettings();
	const folder = settings.bestiarumFolder;

	return folder;
}

async function checkIfFileIsMonster(file: TAbstractFile): Promise<boolean> {
    const folder = await getBestiarumFolder();
    return file.path.startsWith(folder) && file instanceof TFile && file.extension === "md";
}

export async function handleCreateEvent(
	eventFile: TAbstractFile,
): Promise<void> {
	const isMonsterFile = await checkIfFileIsMonster(eventFile);
    if(!isMonsterFile) return;

    const path = eventFile.path;
    const name = eventFile.name.replace(".md", "");

    monsters[path] = new Monster(name, path);
    updateMonsterForSubscriber();
}

export async function handleUpdateEvent(
    eventFile: TAbstractFile,
): Promise<void> {
    const isMonsterFile = await checkIfFileIsMonster(eventFile);
    if(!isMonsterFile) return;

    const path = eventFile.path;
    
    if(monsters[path]) {
        await monsters[path].refreshData();
        updateMonsterForSubscriber();
    }
}

export async function handleDeleteEvent(
	eventFile: TAbstractFile,
): Promise<void> {
    const isMonsterFile = await checkIfFileIsMonster(eventFile);
    if(!isMonsterFile) return;
    
    const path = eventFile.path;
    delete monsters[path];
    updateMonsterForSubscriber();
}

export async function handleRenameEvent(
	eventNewFile: TAbstractFile,
	oldPath: string,
): Promise<void> {
    const isMonsterFile = await checkIfFileIsMonster(eventNewFile);
    if(!isMonsterFile) return;

    const newPath = eventNewFile.path;
    const name = eventNewFile.name.replace(".md", "");

    delete monsters[oldPath];
    monsters[newPath] = new Monster(name, newPath);
    updateMonsterForSubscriber();
}

export async function rebuildMonsterArray() {
	monsters = {};
	const folder = await getBestiarumFolder();

	// @ts-ignore
	const files = app.vault
		.getFiles()
		.filter((file: TFile) => file.path.startsWith(folder))
		.filter((file: TFile) => file.extension === "md");

	for (const file of files) {
		const path = file.path;
		const name = file.name.replace(".md", "");

		monsters[path] = new Monster(name, path);
	}
}

export function getMonsters(): Monster[] {
	return Object.values(monsters);
}