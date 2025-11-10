import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
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

export const useWeatherStore = defineStore('weather', () => {
  const city = ref<string>('')
  const current = ref<Current>({} as Current)
  const forecast = ref<Forecast>({} as Forecast)
  const location = ref<Location>({} as Location)
  const loading = ref<boolean>(false)

  // выбранный день прогноза
  const activeDay = ref<string>()

  const setActiveDay = (date: string) => {
    activeDay.value = date
  }

  const fetchForecastWeatherByCity = async () => {
    loading.value = true
    clearWeatherData()
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

  const clearWeatherData = () => {
    current.value = {} as Current
    forecast.value = {} as Forecast
    location.value = {} as Location
  }

  return {
    fetchForecastWeatherByCity,
    fetchForecastWeatherByCoords,
    city,
    current,
    forecast,
    location,
    loading,
    activeDay,
    setActiveDay,
    clearWeatherData,
  }
})
