<template>
  <SearchWeather />
  <div class="overflow-y-auto h-[calc(100vh-74px)] hide-scrollbar">
    <div class="flex gap-4 flex-col md:flex-row px-2 md:px-0">
      <div v-if="loading" class="w-full text-center py-6 text-gray-500">
        Идет загрузка данных ...
      </div>
      <LocationData v-if="Object.keys(location).length" class="w-full md:w-1/2 lg:w-1/3" />
      <CurrentWeather v-if="Object.keys(current).length" class="w-full md:w-2/3 lg:w-2/3" />
    </div>
    <div class="px-2 md:px-0"><CardDays v-if="Object.keys(forecast).length" /></div>
    <div class="px-2 md:px-0 mt-4">
      <ChartForecast v-if="storeWeather.activeDay && Object.keys(forecast).length" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchWeather from './../components/SearchWeather.vue'
import CurrentWeather from '../components/CurrentWeather.vue'
import ChartForecast from '../components/ChartForecast.vue'
import LocationData from '../components/LocationData.vue'
import { useWeatherStore } from '../stores/weatherStore'
import { storeToRefs } from 'pinia'
import CardDays from '../components/CardDays.vue'

const storeWeather = useWeatherStore()
const { location, current, forecast, loading } = storeToRefs(storeWeather)
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
