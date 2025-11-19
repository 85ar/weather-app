<template>
  <div class="mb-4">
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="relative flex-1">
        <input
          v-model="letter"
          type="text"
          @input="searchCity(letter)"
          @keydown="handleKeydown"
          placeholder="Введите город..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500 pr-10"
        />
        <ul
          v-if="citiesOptions.length && letter.length > 1"
          class="absolute z-10 w-full bg-white border border-t-0 border-gray-300 rounded-b shadow mt-0 max-h-60 overflow-y-auto"
        >
          <li
            v-for="(item, index) in citiesOptions"
            :key="item.id"
            @click="searchWeather(item)"
            class="p-2 hover:bg-blue-100 cursor-pointer last:border-b-0"
            :class="{ 'bg-blue-100': highlightedIndex === index }"
          >
            {{ item.name }} ({{ item.country }})
          </li>
        </ul>

        <span v-if="loadingOptions" class="loader absolute right-4 top-2"></span>

        <button
          v-if="letter && !loadingOptions"
          @click="resetInput"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="flex flex-row justify-center sm:flex-row gap-2">
        <button
          v-if="isSupportedLocation"
          @click="detectLocation"
          :disabled="isDetectingLocation"
          class="px-6 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          v-tippy="{
            content: 'Автоопределение местоположения',
            placement: 'top',
          }"
        >
          <Navigation class="w-4 h-4" />
          <span class="hidden sm:block">{{ isDetectingLocation ? '...' : 'Авто' }}</span>
        </button>

        <button
          v-if="Object.keys(activeCity).length"
          @click="updateData()"
          class="px-6 py-2 sm:px-4 sm:py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition cursor-pointer flex items-center gap-2"
          v-tippy="{
            content: 'Обновить данные',
            placement: 'top',
          }"
        >
          <RotateCcw class="w-4 h-4" />
        </button>

        <button
          v-if="Object.keys(activeCity).length"
          @click="addFavoriteCity()"
          class="px-6 py-2 sm:px-4 sm:py-2 text-gray-500 rounded-lg hover:bg-green-600 transition cursor-pointer flex items-center gap-2"
          :class="isFavorite ? 'bg-green-500 text-white' : 'bg-gray-300 '"
          v-tippy="{
            content: 'Добавить в Избранное',
            placement: 'top',
          }"
        >
          <Heart class="w-4 h-4" />
        </button>

        <button
          class="px-6 py-2 sm:px-4 sm:py-2 bg-gray-300 text-gray-500 rounded-lg hover:bg-gray-400 transition cursor-pointer flex items-center gap-2"
        >
          <User class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weatherStore'
import { X, Navigation, Heart, User, RotateCcw } from 'lucide-vue-next'
import { useDetectLocation } from '../composable/useDetectLocation'
import { useToast } from 'vue-toastification'
import { onMounted, onUnmounted, ref } from 'vue'
import { useFavorites } from '../composable/useFavorites'
import { useSearchStore } from '../stores/searchStore'
import type { CityOptions } from '../stores/types'
import { useDefaultsStore } from '../stores/defaultsStore'

const storeWeather = useWeatherStore()
const storeSearch = useSearchStore()
const storeDefaults = useDefaultsStore()

const highlightedIndex = ref(-1)

let searchTimeout: number | null = null
const DEBOUNCE_DELAY = 400

const { activeDay, activeCity } = storeToRefs(storeWeather)
const { citiesOptions, loadingOptions } = storeToRefs(storeSearch)

const { getLocation, isSupportedLocation, isDetectingLocation, locationError, isSuccessDetecting } =
  useDetectLocation()

const { isFavorite, add } = useFavorites()

const letter = ref<string>(activeCity.value.name)
const toast = useToast()

// поиск погоды
const searchWeather = (item: CityOptions) => {
  storeWeather.setActiveCity(item)
  letter.value = item.name
  citiesOptions.value = [] // очищаем опции после выбора
  highlightedIndex.value = -1

  if (activeCity.value) storeWeather.fetchForecastWeatherByCity()
}

// сброс инпута
const resetInput = () => {
  storeWeather.setActiveCity({} as CityOptions)
  activeDay.value = ''
  storeWeather.clearWeatherData()
  highlightedIndex.value = -1
  citiesOptions.value = []
  letter.value = ''
}

// определяем местоположение
const detectLocation = async () => {
  const coordinates = await getLocation()
  storeWeather.clearWeatherData()
  letter.value = ''
  citiesOptions.value = []
  if (locationError.value.length) {
    toast.error(locationError.value)
  }
  if (isSuccessDetecting.value) {
    toast.success('Местоположение определено успешно')
  }
  if (coordinates) {
    await storeWeather.fetchForecastWeatherByCoords(coordinates.latitude, coordinates.longitude)
    if (activeCity) letter.value = activeCity.value.name
  }
}

// ищем город по введенным символам
const searchCity = (value: string) => {
  if (!value.trim() || value.length < 2) {
    citiesOptions.value = []
    return
  }

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = window.setTimeout(() => {
    storeSearch.fetchCityBySearch(value)
  }, DEBOUNCE_DELAY)
}

// управление стрелками
const handleKeydown = (e: KeyboardEvent) => {
  if (!citiesOptions.value.length) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, citiesOptions.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      e.preventDefault()
      if (highlightedIndex.value >= 0) {
        searchWeather(citiesOptions.value[highlightedIndex.value]!)
      }
      break
    case 'Escape':
      citiesOptions.value = []
      highlightedIndex.value = -1
      break
  }
}

const addFavoriteCity = () => {
  if (isFavorite.value) {
    toast.info('Город уже находится в Избранном')
  } else {
    add()
    toast.success('Город добавлен в Избранное')
  }
}

const updateData = () => {
  searchWeather(activeCity.value)
}

onMounted(() => {
  storeDefaults.loadDefaults()

  // if (storeDefaults.defaultCity) {
  //   letter.value = storeDefaults.defaultCity.name
  //   searchWeather(storeDefaults.defaultCity)
  // }

  if (Object.keys(storeWeather.activeCity).length) updateData()
})

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<style scoped>

</style>
