import { getCurrentSettings } from "settings";
import { getCurrentEnemys } from "./EnemyManager";

let currentEnemy:number = 0;
let currentTurn:number = 1;

export function getTurnInformation(): { currentEnemy: number; currentTurn: number } {
    return { currentEnemy, currentTurn };
}

export async function advance(): Promise<{ currentEnemy: number; currentTurn: number }> {
    const settings = await getCurrentSettings();
    const url = settings.displayURL;

    currentEnemy++;
    if (currentEnemy >= getCurrentEnemys().length) {
        currentEnemy = 0;
        currentTurn++;

        await fetch(url + "/api/enemy/round", {
            method: "POST",
            body: JSON.stringify({
                currentEnemy,
                currentTurn,
            }),
        });

        return { currentEnemy, currentTurn };
    }

    await fetch(url + "/api/enemy/turn", {
        method: "POST",
        body: JSON.stringify({
            currentEnemy,
            currentTurn,
        }),
    });

    return { currentEnemy, currentTurn };
}

export function resetTurns() {
    currentEnemy = 0;
    currentTurn = 1;
}