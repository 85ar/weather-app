import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  getCityBySearch,
  getForecastWeatherByCity,
  getForecastWeatherByCoords,
} from '../api/service'

export interface Location {
  name: string
  region: string
  country: string
  lat: number
  lon: number
  tz_id: string
  localtime: string
}

export interface ConditionData {
  text: string
  icon: string
}

export interface CityOptions {
  id: number
  name: string
  country: string
}

export interface Current {
  temp_c: number
  last_updated: string
  feelslike_c: number
  humidity: number
  wind_kph: number
  gust_kph: number
  pressure_mb: number
  precip_mm: number
  vis_km: number
  condition: ConditionData
  dewpoint_c: number
}

export interface Forecast {
  forecastday: ForecastDay[]
}

export interface ForecastDay {
  date: string
  hour: HourData[]
  day: DayData
}

export interface DayData {
  maxtemp_c: number //макс темп
  mintemp_c: number //мин темп
  maxwind_kph: number // макс ветер, км/ч
  totalprecip_mm: number // общее кол-во осадков, мм
  avgvis_km: number // средн видимость, км
  daily_chance_of_rain: number // вероятность осадков, %
  condition: ConditionData
}

export interface HourData {
  time: string
  temp_c: number
  humidity: number
  wind_kph: number
  pressure_mb: number
}

export interface FavoriteCity {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  temp_c: number
  condition: {
    text: string
    icon: string
  }
}

export const useWeatherStore = defineStore('weather', () => {
  const city = ref<string>('')
  const citiesOptions = ref<CityOptions[]>([])
  const current = ref<Current>({} as Current)
  const forecast = ref<Forecast>({} as Forecast)
  const location = ref<Location>({} as Location)

  const loading = ref<boolean>(false)
  const loadingOptions = ref<boolean>(false)

  // Избранные города
  const favorites = ref<FavoriteCity[]>([])

  // выбранный день прогноза
  const activeDay = ref<string>()

  const setActiveDay = (date: string) => {
    activeDay.value = date
  }

  const fetchForecastWeatherByCity = async () => {
    loading.value = true
    clearData()
    try {
      const result = await getForecastWeatherByCity(city.value)
      city.value = result.location.name
      current.value = result.current
      forecast.value = result.forecast
      location.value = result.location
      activeDay.value = forecast.value.forecastday[0]?.date
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const fetchForecastWeatherByCoords = async (latitude: number, longitude: number) => {
    loading.value = true
    try {
      const result = await getForecastWeatherByCoords(latitude, longitude)
      city.value = result.location.name
      current.value = result.current
      forecast.value = result.forecast
      location.value = result.location

      activeDay.value = forecast.value.forecastday[0]?.date
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const fetchCityBySearch = async (search: string) => {
    loadingOptions.value = true
    try {
      const result = await getCityBySearch(search)
      citiesOptions.value = result
    } catch (error) {
      console.error(error)
    } finally {
      loadingOptions.value = false
    }
  }

  const clearData = () => {
    current.value = {} as Current
    forecast.value = {} as Forecast
    location.value = {} as Location
  }

  // работаем с localStorage
  const loadFavorites = () => {
    const data = localStorage.getItem('favorite')
    favorites.value = data ? JSON.parse(data) : []
  }

  const saveFavorites = () => {
    localStorage.setItem('favorite', JSON.stringify(favorites.value))
  }

  const addFavorite = (city: FavoriteCity) => {
    if (!favorites.value.some((f) => f.id === city.id)) {
      favorites.value.push(city)
      saveFavorites()
    }
  }

  const removeFavorite = (id: string) => {
    favorites.value = favorites.value.filter((f) => f.id !== id)
    saveFavorites()
  }

  const isFavorite = computed(() => {
    return favorites.value.some(
      (fav) => fav.lat === location.value.lat && fav.lon === location.value.lon,
    )
  })

  return {
    fetchForecastWeatherByCity,
    fetchForecastWeatherByCoords,
    fetchCityBySearch,
    citiesOptions,
    city,
    current,
    forecast,
    location,
    loading,
    loadingOptions,
    activeDay,
    setActiveDay,
    clearData,
    favorites,
    loadFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
})
