import { getCurrentEnemys } from "./EnemyManager";

let currentEnemy:number = 0;
let currentTurn:number = 1;

export function getTurnInformation(): { currentEnemy: number; currentTurn: number } {
    return { currentEnemy, currentTurn };
}

export function advance(): { currentEnemy: number; currentTurn: number } {
    currentEnemy++;
    if (currentEnemy >= getCurrentEnemys().length) {
        currentEnemy = 0;
        currentTurn++;
    }

    return { currentEnemy, currentTurn };
}