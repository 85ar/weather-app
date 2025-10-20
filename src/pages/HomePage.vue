<template>
  <SearchWeather />
  <div class="flex gap-4">
    <div v-if="loading">Идет загрузка данных ...</div>
    <LocationData v-if="Object.keys(location).length" />
    <CurrentWeather v-if="Object.keys(current).length" />
  </div>
  <ForecastWeather v-if="Object.keys(forecast).length" />
</template>

<script setup lang="ts">
import SearchWeather from './../components/SearchWeather.vue'
import CurrentWeather from '../components/CurrentWeather.vue'
import ForecastWeather from '../components/ForecastWeather.vue'
import LocationData from '../components/LocationData.vue'
import { useWeatherStore } from '../stores/weather'
import { storeToRefs } from 'pinia'

const store = useWeatherStore()
const { location, current, forecast, loading } = storeToRefs(store)
</script>

<style scoped></style>
