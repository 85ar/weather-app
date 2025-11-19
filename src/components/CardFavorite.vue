<template>
  <div
    class="relative w-full bg-white rounded-2xl shadow-md hover:shadow-sm hover:bg-blue-50 transition-shadow p-4 border border-gray-100 cursor-pointer group"
    @click="showCityWeather()"
  >
    <button
      @click.stop="removeCard(props.favorite.id)"
      class="absolute top-2 right-3 rounded-full hover:bg-red-50 transition cursor-pointer"
      v-tippy="{
        content: 'Удалить из Избранного',
        placement: 'top',
      }"
    >
      <Trash2 class="w-5 h-5 text-gray-400 hover:text-red-400" />
    </button>

    <div class="flex flex-row sm:items-start gap-2 sm:gap-3 mb-4">
      <MapPin class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
      <div class="min-w-0 flex-1">
        <h2 class="text-lg md:text-xl font-semibold text-gray-900 truncate">
          {{ props.favorite.name }}
        </h2>
        <p class="text-sm text-gray-500 truncate">{{ props.favorite.country }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm text-gray-700">
      <div class="flex items-center gap-1.5">
        <Globe class="w-4 h-4 text-gray-500" />
        <span> Ш: {{ props.favorite.lat.toFixed(3) }}° </span>
      </div>

      <div class="flex items-center gap-1.5">
        <Globe class="w-4 h-4 text-gray-500" />
        <span> Д: {{ props.favorite.lon.toFixed(3) }}° </span>
      </div>
    </div>

    <button
      @click.stop="showCityMap()"
      class="flex items-center gap-2 text-sm md:text-md md:text-md font-medium mt-4 md:mt-6 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
    >
      <MapPinned class="w-5 h-5 text-blue-500" />
      Показать на карте
    </button>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { useFavorites } from '../composable/useFavorites'
import { MapPin, Trash2, Globe, MapPinned } from 'lucide-vue-next'
import type { CityOptions } from '../stores/types'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore'

const toast = useToast()
const storeWeather = useWeatherStore()

const props = defineProps<{
  favorite: CityOptions
}>()

const removeCard = (id: string) => {
  remove(id)
  toast.success('Город удален из Избранного')
}

const router = useRouter()

const showCityMap = () => {
  storeWeather.setActiveCity(props.favorite)
  router.push({
    path: '/map',
    query: {
      lat: props.favorite.lat,
      lon: props.favorite.lon,
    },
  })
}

const showCityWeather = () => {
  storeWeather.setActiveCity(props.favorite)
  router.push({
    path: '/',
    query: {
      city: props.favorite.name,
    },
  })
}

const { remove } = useFavorites()
</script>
