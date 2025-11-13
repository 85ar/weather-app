import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getForecastWeatherByCity, getForecastWeatherByCoords } from '../api/service'
import type { CityOptions, Current, Forecast, Location } from './types'

export const useWeatherStore = defineStore('weather', () => {
  const current = ref<Current>({} as Current)
  const forecast = ref<Forecast>({} as Forecast)
  const location = ref<Location>({} as Location)
  const loading = ref<boolean>(false)

  const error = ref<string | null>(null)

  // текущий выбранный город
  const activeCity = ref<CityOptions>({} as CityOptions)

  const setActiveCity = (item: CityOptions) => {
    activeCity.value = item
  }

  // выбранный день прогноза
  const activeDay = ref<string>()

  const setActiveDay = (date: string) => {
    activeDay.value = date
  }

  const fetchForecastWeatherByCity = async () => {
    loading.value = true
    error.value = null
    clearWeatherData()
    try {
      const result = await getForecastWeatherByCity(activeCity.value.name)

      current.value = result.current
      forecast.value = result.forecast
      location.value = result.location
      activeDay.value = forecast.value.forecastday[0]?.date
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch weather'
    } finally {
      loading.value = false
    }
  }

  const fetchForecastWeatherByCoords = async (latitude: number, longitude: number) => {
    loading.value = true
    error.value = null
    try {
      const result = await getForecastWeatherByCoords(latitude, longitude)
      setActiveCity({
        id: result.location.id,
        name: result.location.name,
        country: result.location.country,
        region: result.location.region,
        lat: result.location.lat,
        lon: result.location.lon,
      })
      current.value = result.current
      forecast.value = result.forecast
      location.value = result.location
      activeDay.value = forecast.value.forecastday[0]?.date
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch weather'
    } finally {
      loading.value = false
    }
  }

  const clearWeatherData = () => {
    current.value = {} as Current
    forecast.value = {} as Forecast
    location.value = {} as Location
  }

  return {
    fetchForecastWeatherByCity,
    fetchForecastWeatherByCoords,
    current,
    forecast,
    location,
    loading,
    activeDay,
    setActiveDay,
    clearWeatherData,
    error,
    activeCity,
    setActiveCity,
  }
})
