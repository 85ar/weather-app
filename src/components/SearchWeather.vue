<template>
  <div class="mb-4">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input
          v-model="city"
          @keyup.enter="searchWeather"
          type="text"
          placeholder="Введите город..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500 pr-10"
        />
        <button
          v-if="city"
          @click="resetInput"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <button
        @click="searchWeather"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        :disabled="!city.length"
      >
        Поиск
      </button>

      <button
        v-if="isSupportedLocation"
        @click="detectLocation"
        :disabled="isDetectingLocation"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        v-tippy="{
          content: 'Автоматическое определение местоположения',
          placement: 'top',
        }"
      >
        <Navigation class="w-4 h-4" />
        <span>{{ isDetectingLocation ? '...' : 'Авто' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore, type Current, type Location } from '../stores/weather'
import { X, Navigation } from 'lucide-vue-next'
import { useDetectLocation } from '../composable/useDetectLocation'
import { useToast } from 'vue-toastification'

const store = useWeatherStore()
const { city, location, current, forecast } = storeToRefs(store)
const toast = useToast()

const searchWeather = () => {
  if (city.value) store.fetchForecastWeatherByCity()
}

const resetInput = () => {
  city.value = ''
  location.value = {} as Location
  current.value = {} as Current
  forecast.value = []
}

const { getLocation, isSupportedLocation, isDetectingLocation, locationError, isSuccessDetecting } =
  useDetectLocation()

const detectLocation = async () => {
  const coordinates = await getLocation()
  if (locationError.value.length) {
    toast.error(locationError.value)
  }
  if (isSuccessDetecting.value) {
    toast.success('Местоположение определено успешно')
  }
  if (coordinates) {
    await store.fetchForecastWeatherByCoords(coordinates.latitude, coordinates.longitude)
  }
}
</script>

<style scoped></style>
