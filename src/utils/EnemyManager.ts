import { v4 } from "./uuid";
import { Observable, Subscriber } from 'rxjs';

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

export function setCurrentEnemys(enemys: Enemy[]): void {
	currentEnemys = enemys;
}

export function addEnemy(enemy: Enemy): void {
	currentEnemys.push(enemy);
    sendEnemyListToSubscriber();
}

export function removeEnemy(id: string): void {
	currentEnemys = currentEnemys.filter((enemy) => enemy.id !== id);
    sendEnemyListToSubscriber();
}

export function updateEnemy(id: string, updatedEnemy: Enemy): void {
	const index = currentEnemys.findIndex((enemy) => enemy.id === id);
	if (index !== -1) {
		currentEnemys[index] = updatedEnemy;
	}
    sendEnemyListToSubscriber();
}
export function resetEnemys(): void {
	currentEnemys = [];
    sendEnemyListToSubscriber();
}

export function getEnemyById(id: string): Enemy | undefined {
	return currentEnemys.find((enemy) => enemy.id === id);
}

const observableSubscriber: Subscriber<Enemy[]>[] = [];
export const currentEnemysObvervable: Observable<Enemy[]> = new Observable((subscriber: Subscriber<Enemy[]>) => {
    subscriber.next(currentEnemys);
    observableSubscriber.push(subscriber);

    return function unsubscribe() {
        const index = observableSubscriber.indexOf(subscriber);
        if (index !== -1) {
            return observableSubscriber.splice(index, 1);
        }
        
        subscriber.complete();
    }
});

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