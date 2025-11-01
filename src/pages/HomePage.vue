<template>
  <SearchWeather />
  <div class="overflow-y-auto h-[calc(100vh-74px)] hide-scrollbar">
    <div class="flex gap-4">
      <div v-if="loading">Идет загрузка данных ...</div>
      <LocationData v-if="Object.keys(location).length" />
      <CurrentWeather v-if="Object.keys(current).length" />
    </div>
    <CardDays v-if="Object.keys(forecast).length" />
    <ChartForecast v-if="store.activeDay && Object.keys(forecast).length" />
  </div>
</template>

<script setup lang="ts">
import SearchWeather from './../components/SearchWeather.vue'
import CurrentWeather from '../components/CurrentWeather.vue'
import ChartForecast from '../components/ChartForecast.vue'
import LocationData from '../components/LocationData.vue'
import { useWeatherStore } from '../stores/weather'
import { storeToRefs } from 'pinia'
import CardDays from '../components/CardDays.vue'

const store = useWeatherStore()
const { location, current, forecast, loading } = storeToRefs(store)
</script>

<style scoped></style>
