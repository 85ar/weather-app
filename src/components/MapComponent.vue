<template>
  <div class="mb-2">
    <div class="flex items-center gap-2">
      <div v-if="city.length">Текущий город: {{ city }}</div>
      <button
        v-if="city.length && !isFavorite"
        @click="addFavoriteCity()"
        class="rounded hover:text-green-700 text-green-500 transition-colors cursor-pointer"
        v-tippy="{
          content: 'Добавить город в Избранное',
          placement: 'top',
        }"
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
  </div>

  <div ref="mapContainer" class="map-container mt-2"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import L, { type Map as LMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useWeatherStore } from '../stores/weatherStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { HeartPlus } from 'lucide-vue-next'
import { useFavorites } from '../composable/useFavorites'
import { useToast } from 'vue-toastification'
import { useFavoritesStore } from '../stores/favoritesStore'

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<LMap | null>(null)
const route = useRoute()

const storeWeather = useWeatherStore()
const { city, location } = storeToRefs(storeWeather)

const storeFavorites = useFavoritesStore()
const { favorites } = storeToRefs(storeFavorites)
const { isFavorite, add } = useFavorites()
const toast = useToast()

type FavCity = {
  id: string | number
  name: string
  country: string
  lat: number
  lon: number
  temp_c: number
}

let openedPopup: L.Popup | null = null

const focusCity = (fav: FavCity) => {
  if (!map.value) return

  // Плавный перелет
  map.value.flyTo([fav.lat, fav.lon], 10, { duration: 1.2 })

  // Закрываем предыдущий popup
  if (openedPopup) {
    map.value.closePopup(openedPopup)
  }

  openedPopup = L.popup({ offset: [0, -30] })
    .setLatLng([fav.lat, fav.lon])
    .setContent(`<b>${fav.name}</b><br>${fav.country}<br>${Math.round(fav.temp_c)}°C`)
    .openOn(map.value as LMap)
}

const addFavoriteCity = () => {
  add()
  toast.success('Город добавлен в Избранное')
}

onMounted(() => {
  if (!mapContainer.value) return

  map.value = L.map(mapContainer.value).setView([55.75, 37.62], 5)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value as LMap)

  nextTick(() => {
    setTimeout(() => {
      map.value?.invalidateSize()
    }, 80)

    const lat = Number(route.query.lat)
    const lon = Number(route.query.lon)

    if (lat && lon) {
      map.value?.setView([lat, lon], 10)
    }
  })

  // Текущий город
  if (location.value.lat && location.value.lon) {
    L.marker([location.value.lat, location.value.lon])
      .addTo(map.value as LMap)
      .bindPopup(`${location.value.name}<br>${location.value.country}`)
      .openPopup()
  }

  // Избранные из Pinia
  favorites.value.forEach((fav) => {
    if (fav.lat && fav.lon) {
      L.marker([fav.lat, fav.lon])
        .addTo(map.value! as LMap)
        .bindPopup(`<b>${fav.name}</b><br>${fav.country}<br>${Math.round(fav.temp_c)}°C`)
    }
  })
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
