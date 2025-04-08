<template>
    <div class="enemy-modal">
        <div class="enemy-modal-header">
            <h1>{{ enemy.name }}</h1>
            <h2> {{ enemy.id }} </h2>
        </div>
        <div class="damage-container">
            <button @click="removeHealth()">
                <img :src="placeholderPNG" @load="setIcon($event.target.parentNode, 'minus')" />
            </button>
            <input type="number" placeholder="Schaden" v-model="damage" />
            <button @click="addHealth()">
                <img :src="placeholderPNG" @load="setIcon($event.target.parentNode, 'plus')" />
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { placeholderPNG } from '../../utils/variables';
import { setIcon, Notice } from 'obsidian';

import { getToBeEditedEnemy, updateEnemy } from '../../utils/EnemyManager';
const enemy = ref(getToBeEditedEnemy());
const damage = ref();

function addHealth() {
    if (damage.value) {
        enemy.value.damage -= damage.value;
        enemy.value.hp += damage.value;
        updateEnemy(enemy.value.id, enemy.value);
        damage.value = null;
    } else {
        new Notice('Bitte Schaden eingeben');
    }
}

function removeHealth() {
    if (damage.value) {
        enemy.value.damage += damage.value;
        enemy.value.hp -= damage.value;
        updateEnemy(enemy.value.id, enemy.value);
        damage.value = null;
    } else {
        new Notice('Bitte Schaden eingeben');
    }
}

</script>

<style lang="css">
.enemy-modal-header h1 {
    margin-bottom: 0;
}
.enemy-modal-header h2 {
    font-size: .8rem;
    opacity: .5;
    margin-top: 0;
}
.damage-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .2rem;
}
</style>
