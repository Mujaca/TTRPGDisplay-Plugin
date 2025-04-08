<template>
	<div class="main">
		<h1>Zug Reinfolge</h1>
		<draggable
			v-if="!reload"
			v-model="currentEnemys"
			item-key="id"
			@start="ignoreUpdate = false"
			@end="ignoreUpdate = false"
			class="enemy-container"
		>
			<template #item="{ element: enemy, index }">
				<div class="enemy-item">
					<div class="enemy-information">
						<div
							class="turn-indicator"
							:class="
								index == currentEnemyTurn
									? 'active'
									: 'inactive'
							"
						>
							<div class="turn-index">{{ index + 1 }}.</div>
							<div class="turn-icon">
								<img
									:src="placeholderPNG"
									@load="
										setIcon(
											$event.target.parentNode,
											'arrow-right'
										)
									"
								/>
							</div>
						</div>
						<div
							class="enemy-text"
							:class="
								index == currentEnemyTurn
									? 'active'
									: 'inactive'
							"
						>
							{{ enemy.name }} ({{ enemy.hp }}/{{ enemy.maxHp }})
						</div>
					</div>
					<div class="enemy-control-items">
						<button @click="openModal(enemy)">
							<img
								:src="placeholderPNG"
								@load="
									setIcon($event.target.parentNode, 'pencil')
								"
							/>
						</button>
						<button @click="removeEnemy(enemy.id)">
							<img
								:src="placeholderPNG"
								@load="
									setIcon($event.target.parentNode, 'trash-2')
								"
							/>
						</button>
					</div>
				</div>
			</template>
		</draggable>
		<div class="control-footer">
			<button class="advance-turn" @click="advanceTurn()">
				Advance turn
			</button>
            <button class="advance-turn" @click="resetEnemys()">
                Reset
            </button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, Ref, watch, nextTick } from "vue";
import { setIcon, Notice } from "obsidian";
import draggable from "vuedraggable";

import {
	currentEnemysObvervable,
	setCurrentEnemys,
	setToBeEditedEnemy,
	removeEnemy,
    resetEnemys,
	Enemy,
} from "../../utils/EnemyManager";
import { getTurnInformation, advance } from "../../utils/TurnManager";
import { EnemyModal } from "../../modals/EnemyModal";

import { placeholderPNG } from "../../utils/variables";

const reload: Ref<boolean> = ref(false);
const ignoreUpdate: Ref<boolean> = ref(false);
const currentEnemys: Ref<Enemy> = ref([]);

const currentEnemyTurn: Ref<number> = ref(0);
const currentTurn: Ref<number> = ref(0);

const turnInformation = getTurnInformation();
currentEnemyTurn.value = turnInformation.currentEnemy;
currentTurn.value = turnInformation.currentTurn;

async function advanceTurn() {
	const information = await advance();

	currentEnemyTurn.value = information.currentEnemy;
	currentTurn.value = information.currentTurn;
	reloadView();
	new Notice(
		`Turn ${currentTurn.value} - Enemy ${currentEnemyTurn.value + 1}`
	);
}

watch(currentEnemys, async (newList, oldList) => {
	if (ignoreUpdate.value) {
		ignoreUpdate.value = false;
		return;
	}

	const listCopy = JSON.parse(JSON.stringify(newList));

	setCurrentEnemys(listCopy);
});

currentEnemysObvervable.subscribe((enemys) => {
	currentEnemys.value = enemys;

	ignoreUpdate.value = true;
	reloadView();
});

function openModal(enemy: Enemy) {
	setToBeEditedEnemy(enemy);
	new EnemyModal(app, app.plugins["de-mujaca-ttrpg-display-link"]).open();
}

function reloadView() {
	reload.value = true;

	nextTick(() => {
		reload.value = false;
	});
}
</script>

<style lang="css">
.main {
	height: 92%;
	position: relative;
	padding: 0 1rem;
}

.control-footer {
	position: absolute;
	bottom: 1rem;
	left: 0;
	right: 0;

    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 0 1rem;
}

.control-footer button {
	width: 50%;
}

.enemy-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.enemy-information {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.enemy-item {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.enemy-control-items {
	margin-left: auto;
	display: flex;
	flex-direction: row;
	gap: 0.2rem;
}

.turn-indicator {
	width: 24px;
}

.turn-icon {
	display: flex;
	align-items: center;
}

.turn-indicator.inactive .turn-index {
	display: block;
}

.turn-indicator.active .turn-index {
	display: none;
}

.turn-indicator.inactive .turn-icon {
	display: none;
}

.turn-indicator.active .turn-icon {
	display: block;
}

.enemy-text.active {
	color: var(--color-accent);
}
</style>
