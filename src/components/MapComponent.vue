<template>
  <div>Выбранный город: {{ city }}</div>
  <div>Координаты: {{ activeCoords }}</div>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useWeatherStore } from '../stores/weather'
import { storeToRefs } from 'pinia'

const mapContainer = ref<HTMLDivElement | null>(null)
const store = useWeatherStore();
const {city, location} = storeToRefs(store);

const activeCoords = computed(() => {
  return [location.value.lat, location.value.lon]
})

onMounted(() => {
  if (!mapContainer.value) return

  const map = L.map(mapContainer.value).setView(activeCoords.value, 10)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  z-index: 0; /* важно для иконок маркеров */
}
</style>
