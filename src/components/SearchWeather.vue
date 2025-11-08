<template>
  <div class="mb-4">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input
          v-model="letter"
          type="text"
          @focus="showOptions = true"
          @keydown="handleKeydown"
          placeholder="Введите город..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500 pr-10"
          @input="searchCity(letter)"
        />
        <ul
          v-if="showOptions && citiesOptions.length"
          class="absolute z-10 w-full bg-white border border-t-0 border-gray-300 rounded-b shadow mt-0"
        >
          <li
            v-for="(item, index) in citiesOptions"
            :key="item.id"
            @click="searchWeather(item)"
            @mouseenter="highlightedIndex = index"
            :class="{
              'bg-blue-100': highlightedIndex === index,
              'p-2 hover:bg-gray-100 cursor-pointer': true,
            }"
          >
            {{ item.name }} ({{ item.country }})
          </li>
        </ul>
        <span v-if="loadingOptions" class="loader absolute right-4 top-2"></span>

        <button
          v-if="city"
          @click="resetInput"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- <button
        @click="store.fetchForecastWeatherByCity()"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        :disabled="!city.length"
      >
        Поиск
      </button> -->

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

      <button
        v-if="city"
        @click="addFavoriteCity()"
        class="px-4 py-2 text-gray-500 rounded-lg hover:bg-green-600 transition cursor-pointer flex items-center gap-2"
        :class="isFavorite ? 'bg-green-500 text-white' : 'bg-gray-300 '"
        v-tippy="{
          content: isFavorite ? 'Город в Избранном' : 'Добавить город в Избранное',
          placement: 'top',
        }"
      >
        <Heart class="w-4 h-4" />
      </button>

      <button
        class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg hover:bg-gray-400 transition cursor-pointer flex items-center gap-2"
      >
        <User class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore, type CityOptions } from '../stores/weather'
import { X, Navigation, Heart, User } from 'lucide-vue-next'
import { useDetectLocation } from '../composable/useDetectLocation'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'
import { useFavorites } from '../composable/useFavorites'

const store = useWeatherStore()

const highlightedIndex = ref(-1)

const showOptions = ref(false)

const { city, activeDay, citiesOptions, loadingOptions } = storeToRefs(store)

const { getLocation, isSupportedLocation, isDetectingLocation, locationError, isSuccessDetecting } =
  useDetectLocation()

const { isFavorite, add } = useFavorites()

const letter = ref<string>(city.value)

const toast = useToast()

// поиск погоды
const searchWeather = (item: CityOptions) => {
  city.value = item.name
  letter.value = item.name
  showOptions.value = false
  highlightedIndex.value = -1
  if (city.value) store.fetchForecastWeatherByCity()
  citiesOptions.value = []
}

// сброс инпута
const resetInput = () => {
  city.value = ''
  activeDay.value = ''
  store.clearData()
  highlightedIndex.value = -1
  showOptions.value = false
  citiesOptions.value = []
  letter.value = ''
}

// определяем местоположение
const detectLocation = async () => {
  const coordinates = await getLocation()
  showOptions.value = false
  citiesOptions.value = []
  if (locationError.value.length) {
    toast.error(locationError.value)
  }
  if (isSuccessDetecting.value) {
    toast.success('Местоположение определено успешно')
  }
  if (coordinates) {
    await store.fetchForecastWeatherByCoords(coordinates.latitude, coordinates.longitude)
    letter.value = city.value
  }
}

// ищем город по введенным символам
const searchCity = (value: string) => {
  if (!value.trim()) {
    citiesOptions.value = []
    showOptions.value = false
    store.clearData()
    return
  }
  store.fetchCityBySearch(value)
}

// управление стрелками в списке городов-опций
const handleKeydown = (e: KeyboardEvent) => {
  if (!showOptions.value || !citiesOptions.value.length) return
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
      showOptions.value = false
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
</script>

<style scoped>
.loader {
  width: 22px;
  height: 22px;
  border: 2px solid #ff8904;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
