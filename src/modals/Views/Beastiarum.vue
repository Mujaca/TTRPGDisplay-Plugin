<template>
	<div class="beastiarum">
		<div class="beastiarum-header">
			<h1>Bestiarum</h1>
			<div class="beastiarum-filter-container">
				<select name="Spezies" v-model="filterSpecies">
					<option :value="null" default>Alle Spezien</option>
					<option
						v-for="(species, index) in bestiarumManager.species"
						:key="index"
						:value="species"
					>
						{{ species }}
					</option>
				</select>
				<select name="Tags" v-model="filterTag">
					<option :value="null" default>Alle Tags</option>
					<option
						v-for="(tag, index) in allTags"
						:key="index"
						:value="tag"
					>
						{{ tag }}
					</option>
				</select>
				<input type="text" placeholder="Filter..." v-model="filter" />
			</div>
		</div>
		<div class="bestiarum-slider-filter">
			<div
				:class="
					numberFilter['Level'] !== undefined
						? 'badge active'
						: 'badge'
				"
				@click="openedFilter = 'Level'"
			>
				Level
				<div class="filter-indicator" v-if="numberFilter['Level']">
					{{ numberFilter["Level"] }}
				</div>
				<div class="filter-input" v-if="openedFilter === 'Level'">
					<input
						type="text"
						placeholder="Level..."
						@change="onFilterBadgeClick($event, 'Level')"
					/>
				</div>
			</div>
			<div
				:class="
					numberFilter['LP'] !== undefined ? 'badge active' : 'badge'
				"
				@click="openedFilter = 'LP'"
			>
				LP
				<div class="filter-indicator" v-if="numberFilter['LP']">
					{{ numberFilter["LP"] }}
				</div>
				<div class="filter-input" v-if="openedFilter === 'LP'">
					<input
						type="text"
						placeholder="LP..."
						@change="onFilterBadgeClick($event, 'LP')"
					/>
				</div>
			</div>
			<div
				:class="
					numberFilter['GP'] !== undefined ? 'badge active' : 'badge'
				"
				@click="openedFilter = 'GP'"
			>
				GP
				<div class="filter-indicator" v-if="numberFilter['GP']">
					{{ numberFilter["GP"] }}
				</div>
				<div class="filter-input" v-if="openedFilter === 'GP'">
					<input
						type="text"
						placeholder="GP..."
						@change="onFilterBadgeClick($event, 'GP')"
					/>
				</div>
			</div>
			<div
				:class="
					numberFilter['Initiative'] !== undefined
						? 'badge active'
						: 'badge'
				"
				@click="openedFilter = 'Initiative'"
			>
				Initiative
				<div class="filter-indicator" v-if="numberFilter['Initiative']">
					{{ numberFilter["Initiative"] }}
				</div>
				<div class="filter-input" v-if="openedFilter === 'Initiative'">
					<input
						type="text"
						placeholder="Initiative..."
						@change="onFilterBadgeClick($event, 'Initiative')"
					/>
				</div>
			</div>
			<div
				:class="
					numberFilter['Verteidigung'] !== undefined
						? 'badge active'
						: 'badge'
				"
				@click="openedFilter = 'Verteidigung'"
			>
				Verteidigung
				<div
					class="filter-indicator"
					v-if="numberFilter['Verteidigung']"
				>
					{{ numberFilter["Verteidigung"] }}
				</div>
				<div
					class="filter-input"
					v-if="openedFilter === 'Verteidigung'"
				>
					<input
						type="text"
						placeholder="Verteidigung..."
						@change="onFilterBadgeClick($event, 'Verteidigung')"
					/>
				</div>
			</div>
			<div
				:class="
					numberFilter['Magische Verteidigung'] !== undefined
						? 'badge active'
						: 'badge'
				"
				@click="openedFilter = 'Magische Verteidigung'"
			>
				Magische Verteidigung
				<div
					class="filter-indicator"
					v-if="numberFilter['Magische Verteidigung']"
				>
					{{ numberFilter["Magische Verteidigung"] }}
				</div>
				<div
					class="filter-input"
					v-if="openedFilter === 'Magische Verteidigung'"
				>
					<input
						type="text"
						placeholder="Magische Verteidigung..."
						@change="
							onFilterBadgeClick($event, 'Magische Verteidigung')
						"
					/>
				</div>
			</div>
			<div
				:class="
					diceFilter['Macht'] !== undefined ? 'badge active' : 'badge'
				"
				@click="openedFilter = 'Macht'"
			>
				Macht
				<div class="filter-indicator" v-if="diceFilter['Macht']">
					{{ diceFilter["Macht"] }}
				</div>
				<div class="filter-input" v-if="openedFilter === 'Macht'">
					<input
						type="text"
						placeholder="Macht..."
						@change="onDiceFilterBadgeClick($event, 'Macht')"
					/>
				</div>
			</div>
			<div
				:class="
					diceFilter['Geschicklichkeit'] !== undefined
						? 'badge active'
						: 'badge'
				"
				@click="openedFilter = 'Geschicklichkeit'"
			>
				Geschicklichkeit
				<div
					class="filter-indicator"
					v-if="diceFilter['Geschicklichkeit']"
				>
					{{ diceFilter["Geschicklichkeit"] }}
				</div>
				<div
					class="filter-input"
					v-if="openedFilter === 'Geschicklichkeit'"
				>
					<input
						type="text"
						placeholder="Geschicklichkeit..."
						@change="
							onDiceFilterBadgeClick($event, 'Geschicklichkeit')
						"
					/>
				</div>
			</div>
			<div
				:class="
					diceFilter['Einsicht'] !== undefined
						? 'badge active'
						: 'badge'
				"
				@click="openedFilter = 'Einsicht'"
			>
				Einsicht
				<div class="filter-indicator" v-if="diceFilter['Einsicht']">
					{{ diceFilter["Einsicht"] }}
				</div>
				<div class="filter-input" v-if="openedFilter === 'Einsicht'">
					<input
						type="text"
						placeholder="Einsicht..."
						@change="onDiceFilterBadgeClick($event, 'Einsicht')"
					/>
				</div>
			</div>
			<div
				:class="
					diceFilter['Willenskraft'] !== undefined
						? 'badge active'
						: 'badge'
				"
				@click="openedFilter = 'Willenskraft'"
			>
				Willenskraft
				<div class="filter-indicator" v-if="diceFilter['Willenskraft']">
					{{ diceFilter["Willenskraft"] }}
				</div>
				<div
					class="filter-input"
					v-if="openedFilter === 'Willenskraft'"
				>
					<input
						type="text"
						placeholder="Willenskraft..."
						@change="onDiceFilterBadgeClick($event, 'Willenskraft')"
					/>
				</div>
			</div>
		</div>
		<hr />
		<div class="monster-list-container">
			<div
				class="monster-card"
				v-for="monster in filteredMonsters"
				:key="monster.path"
			>
				<div class="monster-card-header">
					<h2>
						<p>{{ monster.name }}</p>
						<p>
							{{
								monster.data ? ` Lv. ${monster.data.Stufe}` : ""
							}}
						</p>
						<div
							class="monster-badge-container"
							v-if="monster.data?.tags.length"
						>
							<div
								class="badge"
								v-for="tag in monster.data.tags"
								:key="tag"
							>
								{{ tag }}
							</div>
						</div>
					</h2>
					<button @click="addMonsterAsEnemy(monster)">
						<img
							:src="placeholderPNG"
							@load="setIcon($event.target.parentNode, 'plus')"
						/>
					</button>
				</div>
				<div class="monster-information" v-if="monster.data">
					<hr />
					<span>
						<strong>Spezies:</strong> {{ monster.data.Spezies }}
					</span>
					<div class="information-group">
						<span>
							<strong>LP:</strong> {{ monster.data.LP }}
						</span>
						<span><strong>GP:</strong> {{ monster.data.LP }}</span>
						<span
							><strong>Initiative:</strong>
							{{ monster.data.Initiative }}</span
						>
					</div>
					<div class="information-group">
						<span
							><strong>Verteidigung:</strong>
							{{ monster.data.Verteidigung }}</span
						>
						<span
							><strong>M. Verteidigung:</strong>
							{{ monster.data["Magische Verteidigung"] }}</span
						>
					</div>
					<hr />
					<div class="information-group">
						<span>
							<strong>Macht</strong> {{ monster.data.Macht }}
						</span>
						<span>
							<strong>Geschicklichkeit</strong>
							{{ monster.data.Geschicklichkeit }}
						</span>
					</div>
					<div class="information-group">
						<span>
							<strong>Einsicht</strong>
							{{ monster.data.Einsicht }}
						</span>
						<span>
							<strong>Willenkraft</strong>
							{{ monster.data.Willenskraft }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import * as bestiarumManager from "../../manager/BestiarumManager";

import { placeholderPNG } from "../../utils/variables";
import { Notice, setIcon } from "obsidian";
import { addEnemy, Enemy } from "manager/EnemyManager";

const monsters = ref(bestiarumManager.getMonsters());

const filter = ref("");
const filterSpecies = ref<string | null>(null);
const filterTag = ref<string | null>(null);

const diceFilter = ref<{
	Macht?: string;
	Geschicklichkeit?: string;
	Einsicht?: string;
	Willenskraft?: string;
}>({
	Macht: undefined,
	Geschicklichkeit: undefined,
	Einsicht: undefined,
	Willenskraft: undefined,
});

const numberFilter = ref<{
	Level?: string;
	LP?: string;
	GP?: string;
	Initiative?: string;
	Verteidigung?: string;
	["Magische Verteidigung"]?: string;
}>({
	Level: undefined,
	LP: undefined,
	GP: undefined,
	Initiative: undefined,
	Verteidigung: undefined,
	["Magische Verteidigung"]: undefined,
});

const openedFilter = ref<string | null>(null);

const allTags = computed(() => {
	const tags: string[] = [];
	for (const monster of monsters.value) {
		if (!monster.data?.tags) continue;

		tags.push(...monster.data.tags);
	}

	const uniqueTags = tags.filter((tag, index) => tags.indexOf(tag) === index);

	return Array.from(uniqueTags);
});

const filteredMonsters = computed(() => {
	let filtered = monsters.value
		.filter((monster) => {
			if (!filter.value) return true;
			return monster.name
				.toLowerCase()
				.includes(filter.value.toLowerCase());
		})
		.filter((monster) => {
			if (!filterTag.value) return true;
			return monster.data?.tags.includes(filterTag.value);
		})
		.filter((monster) => {
			if (!filterSpecies.value) return true;
			return monster.data?.Spezies === filterSpecies.value;
		});

	for (const [key, filterValue] of Object.entries(numberFilter.value)) {
		if (!filterValue) continue;

		const operator = filterValue[0];
		const value = parseInt(filterValue.substring(1));

		filtered = filtered.filter((monster) => {
			if (!monster.data) return false;
			// @ts-ignore
			const monsterValue =
				key === "Level" ? monster.data?.Stufe : monster.data?.[key];
			if (monsterValue === undefined) return false;

			switch (operator) {
				case "<":
					return monsterValue < value;
				case ">":
					return monsterValue > value;
				case "=":
					return monsterValue === value;
				default:
					return true;
			}
		});
	}

	for (const [key, filterValue] of Object.entries(diceFilter.value)) {
		if (!filterValue) continue;

		const operator = filterValue[0];
		const value = parseInt(filterValue.substring(1));

		filtered = filtered.filter((monster) => {
			if (!monster.data) return false;
			// @ts-ignore
			let monsterValue = monster.data?.[key];
			monsterValue = monsterValue.replace("W", "");
			monsterValue = parseInt(monsterValue);

			if (monsterValue === undefined) return false;

			switch (operator) {
				case "<":
					return monsterValue < value;
				case ">":
					return monsterValue > value;
				case "=":
					return monsterValue === value;
				default:
					return true;
			}
		});
	}

	return filtered;
});

bestiarumManager.monsterObservable.subscribe((updatedMonsters) => {
	monsters.value = updatedMonsters;
});

function addMonsterAsEnemy(monster: bestiarumManager.Monster) {
	if (monster.data?.LP === undefined) {
		new Notice(
			"Das Monster hat keine LP und kann daher nicht als Gegner hinzugefügt werden.",
		);
		return;
	}

	const enemy: Enemy = new Enemy(monster.name, monster.data?.LP);
	addEnemy(enemy);
}

function onFilterBadgeClick(
	event: Event,
	type: keyof typeof numberFilter.value,
) {
	const target = event.target as HTMLInputElement;

	if (target.value === "") {
		numberFilter.value[type] = undefined;
		return;
	}

	const isValidFilterInput = new RegExp(/(<|>|=)[0-9]*/gm).test(target.value);
	if (!isValidFilterInput) {
		new Notice("Ungültiger Filter. Bitte verwende das Format: <5, >3, =10");
		return;
	}

	numberFilter.value[type] = target.value;
}

function onDiceFilterBadgeClick(
	event: Event,
	type: keyof typeof diceFilter.value,
) {
	const target = event.target as HTMLInputElement;

	if (target.value === "") {
		diceFilter.value[type] = undefined;
		return;
	}

	const isValidFilterInput = new RegExp(/(<|>|=)[0-9]*/gm).test(target.value);
	if (!isValidFilterInput) {
		new Notice("Ungültiger Filter. Bitte verwende das Format: <5, >3, =10");
		return;
	}

	diceFilter.value[type] = target.value;
}

document.addEventListener("click", (event) => {
	const target = event.target as HTMLElement;

	if (
		target.classList.contains("badge") ||
		target.classList.contains("filter-input") ||
		target.parentNode?.classList.contains("filter-input")
	) {
		return;
	}

	openedFilter.value = null;
});
</script>

<style>
.badge {
	padding: 0.2rem 0.7rem;
	border-radius: 8rem;
	font-size: 0.7rem;
	height: min-content;
	width: min-content;
	min-width: 3rem;

	word-break: keep-all;
	white-space: nowrap;
	text-align: center;
}

.beastiarum-header {
	display: flex;
	flex-direction: row;
}

.beastiarum-header h1 {
	margin: 0;
}

.beastiarum-filter-container {
	margin-left: auto;
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
}

.bestiarum-slider-filter {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.3rem;
	justify-content: space-between;

	margin-top: 1rem;
	margin-bottom: 0;
}

.bestiarum-slider-filter .badge {
	font-size: 0.9rem;
	background-color: var(--background-secondary-alt);
	cursor: pointer;
	position: relative;
    box-shadow: var(--input-shadow);
}

.bestiarum-slider-filter .badge:hover {
	background-color: var(--background-modifier-hover);
    box-shadow: var(--input-shadow-hover);
}

.bestiarum-slider-filter .badge.active {
	background-color: var(--color-blue);
}

.filter-indicator {
	position: absolute;
	top: -0.5rem;
	right: -0.5rem;
	font-size: 0.6rem;
	background-color: var(--tag-background);
	color: var(--tag-color);
	border-radius: 50%;
	width: 1.2rem;
	height: 1.2rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.filter-input {
	position: absolute;
	bottom: -2.5rem;
	left: 0.1rem;
	padding: 0rem;
}

.monster-list-container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 1rem;
}

.monster-card {
	border-radius: 5px;
	padding: 0.5rem;
    box-shadow: var(--input-shadow);
    max-width: calc(25% - 1rem);
}

.monster-badge-container {
	margin-top: 0.3rem;
	display: flex;
	flex-direction: row;
	gap: 0.3rem;
}

.monster-card-header .badge {
	background-color: var(--tag-background);
}

.monster-card-header h2 {
	margin: 0;
	font-size: 1.3rem;
}

.monster-card-header h2 p {
	margin: 0;
}

.monster-card-header {
	margin-bottom: 0.5rem;
	display: flex;
	gap: 0.3rem;
}

.monster-card-header button {
	margin-left: auto;
	width: 20%;
}

.monster-information {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.monster-information span {
	font-size: 0.8rem;
}

.monster-information hr {
	margin: 0.5rem 0;
}

.information-group {
	display: flex;
	flex-direction: row;
	gap: 1rem;
}

hr {
    border-top: 1px solid var(--divider-color);
}
</style>
