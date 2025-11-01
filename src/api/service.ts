import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const API_URL = import.meta.env.VITE_WEATHER_API_URL

export const getForecastWeatherByCity = async (city: string) => {
  const result = await axios.get(`${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&lang=ru`)
  return result.data
}

export const getForecastWeatherByCoords = async (latitude: number, longitude: number) => {
  const result = await axios.get(
    `${API_URL}/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=3&lang=ru`,
  )
  return result.data
}

export const getCityBySearch = async (search: string) => {
  const result = await axios.get(`${API_URL}/search.json?key=${API_KEY}&q=${search}`)
  return result.data
}
