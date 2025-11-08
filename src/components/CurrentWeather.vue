<template>
  <div
    class="bg-white rounded-2xl shadow-md hover:shadow-sm transition-shadow p-5 border border-gray-100"
  >

    <div class="text-xs text-right text-gray-500 mb-2">
      Обновлено: {{ formatDate(current.last_updated) }}
    </div>

    <div class="flex items-center justify-between mb-4">
      <div class="flex items-start gap-3">
        <ThermometerSun class="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
        <div>
          <p class="text-3xl font-semibold text-gray-900 leading-none">
            {{ Math.round(current.temp_c) }}°
          </p>
          <p class="text-sm text-gray-600 mt-1">
            Ощущается как {{ Math.round(current.feelslike_c) }}°
          </p>
        </div>
      </div>

      <div class="flex items-center text-right">
        <img :src="`https:${current.condition.icon}`" class="w-12 h-12" />
        <p class="ml-2 text-gray-700 font-medium max-w-[240px] truncate">
          {{ current.condition.text }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">

      <div class="text-center">
        <p class="text-xs text-gray-500 mb-1">Влажность</p>
        <p class="text-lg font-semibold text-gray-800">{{ current.humidity }}%</p>
      </div>

      <div class="text-center">
        <p class="text-xs text-gray-500 mb-1">Осадки</p>
        <p class="text-lg font-semibold text-gray-800">{{ current.precip_mm }} мм</p>
      </div>

      <div class="text-center">
        <p class="text-xs text-gray-500 mb-1">Точка росы</p>
        <p class="text-lg font-semibold text-gray-800">{{ current.dewpoint_c }}°</p>
      </div>

      <div class="text-center">
        <p class="text-xs text-gray-500 mb-1">Ветер</p>
        <p class="text-lg font-semibold text-gray-800">{{ formatSpeed(current.wind_kph) }} м/с</p>
      </div>

      <div class="text-center">
        <p class="text-xs text-gray-500 mb-1">Порывы ветра</p>
        <p class="text-lg font-semibold text-gray-800">{{ formatSpeed(current.gust_kph) }} м/с</p>
      </div>

      <div class="text-center">
        <p class="text-xs text-gray-500 mb-1">Давление</p>
        <p class="text-lg font-semibold text-gray-800">{{ pressure }} мм рт.ст.</p>
      </div>

      <div class="text-center">
        <p class="text-xs text-gray-500 mb-1">Видимость</p>
        <p class="text-lg font-semibold text-gray-800">{{ current.vis_km }} км</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weather'
import { formatDate, formatSpeed } from '../tools/helper'
import { computed } from 'vue'
import { ThermometerSun } from 'lucide-vue-next'

const store = useWeatherStore()
const { current } = storeToRefs(store)

const pressure = computed(() => {
  const pres = current.value.pressure_mb * 0.750062
  return pres.toFixed(1)
})
</script>

<style scoped></style>
