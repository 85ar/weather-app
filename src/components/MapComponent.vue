<template>
  <div class="mb-2">
    <div class="flex items-center gap-2">
      <div v-if="city.length">Текущий город: {{ city }}</div>
      <button
        v-if="city.length && !isFavorite"
        @click="addFavoriteCity()"
        class="rounded hover:text-green-700 text-green-500 transition-colors cursor-pointer"
        v-tippy="{ content: 'Добавить город в Избранное', placement: 'top' }"
      >
        <HeartPlus class="w-5 h-5" />
      </button>
    </div>
    <div v-if="favorites.length">
      Избранные города:
      <span
        v-for="(fav, index) in favorites"
        :key="fav.id"
        class="cursor-pointer text-blue-600 hover:underline"
        @click="focusCity(fav)"
      >
        {{ fav.name }}<span v-if="index < favorites.length - 1">, </span>
      </span>
    </div>
    <div v-else>Нет избранных городов</div>

    <div ref="mapContainer" class="map-container mt-2"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import L, { type Map as LMap, type Marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useWeatherStore } from '../stores/weatherStore'
import { useFavoritesStore } from '../stores/favoritesStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { HeartPlus } from 'lucide-vue-next'
import { useFavorites } from '../composable/useFavorites'
import { useToast } from 'vue-toastification'

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<LMap | null>(null)

const currentMarker = ref<Marker | null>(null) // Маркер текущего города
const favoriteMarkers = ref<Marker[]>([]) // Маркеры избранных

const route = useRoute()
const storeWeather = useWeatherStore()
const { city, location } = storeToRefs(storeWeather)

const storeFavorites = useFavoritesStore()
const { favorites } = storeToRefs(storeFavorites)

const { isFavorite, add } = useFavorites()
const toast = useToast()

// Фокус на выбранный город
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const focusCity = (fav: any) => {
  if (!map.value) return
  map.value.flyTo([fav.lat, fav.lon], 10, { duration: 1.2 })

  const popupContent = `<b>${fav.name}</b><br>${fav.country}<br>${Math.round(fav.temp_c)}°C`

  // Закрываем предыдущий popup
  favoriteMarkers.value.forEach((marker) => marker.closePopup())

  // Ищем маркер города и открываем popup
  const marker = favoriteMarkers.value.find(
    (m) => m.getLatLng().lat === fav.lat && m.getLatLng().lng === fav.lon,
  )
  if (marker) marker.bindPopup(popupContent).openPopup()
}

const addFavoriteCity = () => {
  add()
  toast.success('Город добавлен в Избранное')
}

// Инициализация карты
onMounted(() => {
  if (!mapContainer.value) return

  map.value = L.map(mapContainer.value).setView([55.75, 37.62], 5)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value as LMap)

  nextTick(() => {
    map.value?.invalidateSize()

    const lat = Number(route.query.lat)
    const lon = Number(route.query.lon)
    if (lat && lon) map.value?.setView([lat, lon], 10)

    // Маркер текущего города
    if (location.value.lat && location.value.lon) {
      if (currentMarker.value) currentMarker.value.remove()
      currentMarker.value = L.marker([location.value.lat, location.value.lon])
        .addTo(map.value as LMap)
        .bindPopup(`${location.value.name}<br>${location.value.country}`)
        .openPopup()
    }

    // Маркеры избранных
    favoriteMarkers.value.forEach((m) => m.remove())
    favoriteMarkers.value = []
    favorites.value.forEach((fav) => {
      if (fav.lat && fav.lon) {
        const marker = L.marker([fav.lat, fav.lon])
          .addTo(map.value! as LMap)
          .bindPopup(`<b>${fav.name}</b><br>${fav.country}<br>${Math.round(fav.temp_c)}°C`)
        favoriteMarkers.value.push(marker)
      }
    })
  })
})

// Авто-обновление маркеров при изменении избранного списка
watch(favorites, () => {
  if (!map.value) return

  favoriteMarkers.value.forEach((m) => m.remove())
  favoriteMarkers.value = []

  favorites.value.forEach((fav) => {
    if (fav.lat && fav.lon) {
      const marker = L.marker([fav.lat, fav.lon])
        .addTo(map.value! as LMap)
        .bindPopup(`<b>${fav.name}</b><br>${fav.country}<br>${Math.round(fav.temp_c)}°C`)
      favoriteMarkers.value.push(marker)
    }
  })
})

// Авто-обновление текущего города
watch(location, (loc) => {
  if (!map.value) return
  if (!loc.lat || !loc.lon) return

  if (currentMarker.value) currentMarker.value.remove()
  currentMarker.value = L.marker([loc.lat, loc.lon])
    .addTo(map.value as LMap)
    .bindPopup(`${loc.name}<br>${loc.country}`)
    .openPopup()
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  z-index: 0;
}
</style>
