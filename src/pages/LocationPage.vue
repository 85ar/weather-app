<template>
  <div>LocationPage</div>
  <input
    v-model="city"
    type="text"
    placeholder="Введите город или координаты"
    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
  <form @submit="submitForm()">
    <div>
      <label for="select">Выберите страну</label>
      <select id="select">
        <option>1</option>
        <option>2</option>
      </select>
    </div>

        <div>
      <label for="select">Выберите город</label>
      <select id="select">
        <option>1</option>
        <option>2</option>
      </select>
    </div>
  </form>

  <button>Сохранить</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weather'

const store = useWeatherStore()
const { city } = storeToRefs(store)

const submitForm = () => {
  console.log('submit')
}
</script>

<style scoped></style>
