<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
    <div class="text-xs text-right text-gray-500">
      Обновлено: {{ formatDate(current.last_updated) }}
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-start gap-3 ">
        <ThermometerSun class="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
        <div class="min-w-0 flex-1">
          <p class="text-2xl font-bold text-gray-800">{{ current.temp_c }}°C</p>
          <p class="text-gray-600">Ощущается как {{ current.feelslike_c }}°C</p>
        </div>
      </div>

      <div class="text-center flex items-center">
        <img :src="`https:${current.condition.icon}`" />
        <p class="text-xs font-semibold">{{ current.condition.text }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div class="text-center">
        <p class="text-sm text-gray-500">Влажность</p>
        <p class="text-lg font-semibold">{{ current.humidity }}%</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Осадки</p>
        <p class="text-lg font-semibold">{{ current.precip_mm }} мм</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Точка росы</p>
        <p class="text-lg font-semibold">{{ current.dewpoint_c }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Скорость ветра</p>
        <p class="text-lg font-semibold">{{ current.wind_kph }} км/ч</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Порывы ветра до</p>
        <p class="text-lg font-semibold">{{ current.gust_kph }} км/ч</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Давление</p>
        <p class="text-lg font-semibold">{{ pressure }} мм.рт.ст.</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Видимость</p>
        <p class="text-lg font-semibold">{{ current.vis_km }} км</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weather'
import { formatDate } from '../tools/helper'
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
