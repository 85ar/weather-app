<template>
  <div class="flex items-center gap-4 my-4">
    <div class="my-4">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Прогноз на ближайшие дни</h3>
      <div class="flex gap-4">
        <div
          v-for="item in forecast.forecastday"
          :key="item.date"
          class="rounded-2xl shadow-lg p-4 border border-gray-100 w-80 hover:bg-blue-100 hover:cursor-pointer transition"
          :class="activeDay === item.date ? 'bg-gray-200 text-white' : 'bg-white text-gray-800'"
          @click="handleClick(item.date)"
        >
          <div class="flex items-center gap-2 mb-2">
            <Calendar class="w-5 h-5 text-blue-600" />
            <span class="text-lg font-bold text-gray-800">{{ dateTransform(item.date) }}</span>
          </div>
          <div class="flex items-center mb-2">
            <img :src="`https:${item.day.condition.icon}`" />
            <p class="ml-2 text-gray-700 font-medium">{{ item.day.condition.text }}</p>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500 flex items-center gap-1">
                <Thermometer class="w-4 h-4" /> Макс. / Мин.
              </span>
              <span class="text-gray-800 font-medium">
                {{ item.day.maxtemp_c }}° / {{ item.day.mintemp_c }}°
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-500 flex items-center gap-1">
                <Wind class="w-4 h-4" /> Ветер
              </span>
              <span class="text-gray-800">{{ item.day.maxwind_kph }} км/ч</span>
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
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weather'
import { Calendar, Thermometer, Wind, CloudRain, Eye } from 'lucide-vue-next'

const store = useWeatherStore()

const dateTransform = (date: string) => date.split('-').reverse().join('.')

const handleClick = (date: string) => {
  store.setActiveDay(date)
}

const { forecast, activeDay } = storeToRefs(store)
</script>

<style scoped></style>
