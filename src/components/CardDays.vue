<template>
  <div class="my-6">
    <h3 class="text-2xl font-semibold text-gray-900 mb-5">
      Прогноз на ближайшие дни
    </h3>

    <div class="flex gap-5 overflow-x-auto pb-2">
      <div
        v-for="item in forecast.forecastday"
        :key="item.date"
        @click="handleClick(item.date)"
        class="w-76 flex-shrink-0 rounded-2xl border border-gray-100 p-5 cursor-pointer transition-all shadow-sm hover:shadow-lg"
        :class="activeDay === item.date ? 'bg-blue-50 border-blue-200' : 'bg-white'"
      >

        <div class="flex items-center gap-2 mb-3">
          <Calendar class="w-5 h-5 text-blue-600" />
          <span class="text-lg font-bold text-gray-800">
            {{ dateTransform(item.date) }}
          </span>
        </div>

        <div class="flex items-center mb-4">
          <img :src="`https:${item.day.condition.icon}`" class="w-10 h-10" />
          <p class="ml-2 text-gray-700 font-medium leading-tight max-w-[150px] truncate">
            {{ item.day.condition.text }}
          </p>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500 flex items-center gap-1">
              <Thermometer class="w-4 h-4" /> Макс / Мин
            </span>
            <span class="text-gray-800 font-medium">
              {{ Math.round(item.day.maxtemp_c) }}° / {{ Math.round(item.day.mintemp_c) }}°
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500 flex items-center gap-1">
              <Wind class="w-4 h-4" /> Ветер
            </span>
            <span class="text-gray-800">
              {{ formatSpeed(item.day.maxwind_kph) }} м/с
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500 flex items-center gap-1">
              <CloudRain class="w-4 h-4" /> Осадки
            </span>
            <span class="text-gray-800">{{ item.day.totalprecip_mm }} мм</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500 flex items-center gap-1">
              <Eye class="w-4 h-4" /> Видимость
            </span>
            <span class="text-gray-800">{{ item.day.avgvis_km }} км</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weatherStore'
import { Calendar, Thermometer, Wind, CloudRain, Eye } from 'lucide-vue-next'
import { formatSpeed } from '../tools/helper'

const storeWeather = useWeatherStore()
const { forecast, activeDay } = storeToRefs(storeWeather)

const dateTransform = (date: string) => date.split('-').reverse().join('.')

const handleClick = (date: string) => {
  storeWeather.setActiveDay(date)
}
</script>

<style scoped></style>
