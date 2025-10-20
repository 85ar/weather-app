<template>
  <div class="w-90 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
    <div class="flex items-start gap-3 mb-5">
      <MapPin class="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
      <div class="min-w-0 flex-1">
        <h2 class="text-xl font-bold text-gray-800 truncate">
          {{ location.name }}
        </h2>
        <p
          class="text-gray-600 mt-1 truncate"
          v-tippy="{
            content: `${location.region}, ${location.country}`,
            placement: 'top',
          }"
        >
          {{ location.region }}, {{ location.country }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4 mb-4">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <Globe class="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span
          class="text-sm text-gray-700 truncate"
          v-tippy="{
            content: `Широта: ${location.lat?.toFixed(6)}°`,
            placement: 'top',
          }"
        >
          Ш: {{ location.lat?.toFixed(3) || '-' }}°
        </span>
      </div>
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <Globe class="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span
          class="text-sm text-gray-700 truncate"
          v-tippy="{
            content: `Долгота: ${location.lon?.toFixed(6)}°`,
            placement: 'top',
          }"
        >
          Д: {{ location.lon?.toFixed(3) || '-' }}°
        </span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <Clock class="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span class="text-sm text-gray-700 truncate">
          {{ formatTime(location.localtime) }}
        </span>
      </div>
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <Map class="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span
          class="text-sm text-gray-700 truncate"
          v-tippy="{
            content: location.tz_id,
            placement: 'top',
          }"
        >
          {{ location.tz_id }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weather'
import { MapPin, Clock, Globe, Map } from 'lucide-vue-next'
import { formatTime } from '../tools/helper'

const store = useWeatherStore()
const { location } = storeToRefs(store)
</script>

<style scoped></style>
