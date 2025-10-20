import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getForecastWeatherByCity, getForecastWeatherByCoords } from '../api/service'

export interface Location {
  name: string
  region: string
  country: string
  lat: number
  lon: number
  tz_id: string
  localtime: string
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
  condition: {
    text: string
    icon: string
  }
  dewpoint_c: number
}

// type Forecast = ForecastDay[]

export const useWeatherStore = defineStore('weather', () => {
  const city = ref<string>('')
  const current = ref<Current>({} as Current)
  const forecast = ref([])
  const location = ref<Location>({} as Location)
  const loading = ref<boolean>(false)

  const fetchForecastWeatherByCity = async () => {
    loading.value = true
    try {
      const result = await getForecastWeatherByCity(city.value)
      city.value = result.location.name
      current.value = result.current
      forecast.value = result.forecast
      location.value = result.location
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
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return {
    fetchForecastWeatherByCity,
    fetchForecastWeatherByCoords,
    city,
    current,
    forecast,
    location,
    loading,
  }
})
