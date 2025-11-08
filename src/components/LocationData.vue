<template>
  <div
    class="relative w-90 bg-white rounded-2xl shadow-md hover:shadow-sm transition-shadow p-5 border border-gray-100"
  >
    <div class="flex items-start gap-3 mb-5">
      <MapPin class="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />

      <div class="min-w-0 flex-1">
        <h2 class="text-lg font-semibold text-gray-900 truncate">
          {{ location.name }}
        </h2>
        <p
          class="text-sm text-gray-500 truncate"
          v-tippy="{
            content: `${location.region}, ${location.country}`,
            placement: 'top'
          }"
        >
          {{ location.region }}, {{ location.country }}
        </p>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm text-gray-700 mb-4">
      <div class="flex items-center gap-1.5">
        <Globe class="w-4 h-4 text-gray-500" />
        <span
          v-tippy="{ content: `Широта: ${location.lat?.toFixed(6)}°`, placement: 'top' }"
        >
          Ш: {{ location.lat?.toFixed(3) || '-' }}°
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <Globe class="w-4 h-4 text-gray-500" />
        <span
          v-tippy="{ content: `Долгота: ${location.lon?.toFixed(6)}°`, placement: 'top' }"
        >
          Д: {{ location.lon?.toFixed(3) || '-' }}°
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm text-gray-700 mb-5">
      <div class="flex items-center gap-1.5">
        <Clock class="w-4 h-4 text-gray-500" />
        <span>{{ formatTime(location.localtime) }}</span>
      </div>

      <div
        class="flex items-center gap-1.5 truncate"
        v-tippy="{ content: location.tz_id, placement: 'top' }"
      >
        <Map class="w-4 h-4 text-gray-500" />
        <span class="truncate">{{ location.tz_id }}</span>
      </div>
    </div>

    <button
      @click="goActiveCity"
      class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
    >
      <MapPinned class="w-4 h-4 text-blue-500" />
      Показать на карте
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weather'
import { MapPin, Clock, Globe, Map, MapPinned } from 'lucide-vue-next'
import { formatTime } from '../tools/helper'
import { useRouter } from 'vue-router'

const store = useWeatherStore()
const { location } = storeToRefs(store)
const router = useRouter()

const goActiveCity = () => {
  router.push({
    path: '/map',
    query: {
      lat: location.value.lat,
      lon: location.value.lon,
    },
  })
}
</script>
