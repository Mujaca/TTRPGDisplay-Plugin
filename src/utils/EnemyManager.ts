import { getCurrentSettings } from "settings";
import { resetTurns } from "./TurnManager";
import { v4 } from "./uuid";
import { Observable, Subscriber } from "rxjs";

export class Enemy {
	id: string;
	name: string;
	hp: number;
	maxHp: number;
	damage: number;

	constructor(name: string, maxHp: number) {
		this.id = v4();
		this.name = name;
		this.maxHp = maxHp;
		this.hp = maxHp;
		this.damage = 0;
	}
}

let toBeEditedEnemy: Enemy | undefined = undefined;
let currentEnemys: Enemy[] = [];

export function getCurrentEnemys(): Enemy[] {
	return currentEnemys;
}

export async function setCurrentEnemys(enemys: Enemy[]): Promise<void> {
	currentEnemys = enemys;

	const settings = await getCurrentSettings();
	const url = settings.displayURL;

	await fetch(url + "/api/enemy", {
		method: "POST",
		body: JSON.stringify(currentEnemys),
	});
}

export async function addEnemy(enemy: Enemy): Promise<void> {
	currentEnemys.push(enemy);
	sendEnemyListToSubscriber();

	const settings = await getCurrentSettings();
	const url = settings.displayURL;

	fetch(url + "/api/enemy", {
		method: "POST",
		body: JSON.stringify(getCurrentEnemys()),
	});
}

export async function removeEnemy(id: string): Promise<void> {
	currentEnemys = currentEnemys.filter((enemy) => enemy.id !== id);
	sendEnemyListToSubscriber();

	const settings = await getCurrentSettings();
	const url = settings.displayURL;

	fetch(url + "/api/enemy/delete", {
		method: "POST",
		body: JSON.stringify({ id }),
	});
}

export async function updateEnemy(
	id: string,
	updatedEnemy: Enemy
): Promise<void> {
	const index = currentEnemys.findIndex((enemy) => enemy.id === id);
	if (index !== -1) {
		currentEnemys[index] = updatedEnemy;
	}
	sendEnemyListToSubscriber();

	const settings = await getCurrentSettings();
	const url = settings.displayURL;

	fetch(url + "/api/enemy/update", {
		method: "POST",
		body: JSON.stringify(updatedEnemy),
	});
}
export async function resetEnemys(): Promise<void> {
	currentEnemys = [];
	resetTurns();
	sendEnemyListToSubscriber();

    const settings = await getCurrentSettings();
	const url = settings.displayURL;

	await fetch(url + "/api/enemy", {
		method: "POST",
		body: JSON.stringify(currentEnemys),
	});
}

export function getEnemyById(id: string): Enemy | undefined {
	return currentEnemys.find((enemy) => enemy.id === id);
}

const observableSubscriber: Subscriber<Enemy[]>[] = [];
export const currentEnemysObvervable: Observable<Enemy[]> = new Observable(
	(subscriber: Subscriber<Enemy[]>) => {
		subscriber.next(currentEnemys);
		observableSubscriber.push(subscriber);

		return function unsubscribe() {
			const index = observableSubscriber.indexOf(subscriber);
			if (index !== -1) {
				return observableSubscriber.splice(index, 1);
			}

			subscriber.complete();
		};
	}
);

function sendEnemyListToSubscriber() {
	observableSubscriber.forEach((subscriber) => {
		subscriber.next(currentEnemys);
	});
}

export function setToBeEditedEnemy(enemy: Enemy): void {
	toBeEditedEnemy = enemy;
}

export function getToBeEditedEnemy(): Enemy | undefined {
	return toBeEditedEnemy;
}
