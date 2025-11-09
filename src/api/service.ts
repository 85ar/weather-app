import axios from 'axios'

export const getForecastWeatherByCity = async (city: string) => {
  const response = await axios.get('/api/weather', { params: { q: city, days: 3 } })
  return response.data
}

export const getForecastWeatherByCoords = async (latitude: number, longitude: number) => {
  const response = await axios.get('/api/weather', {
    params: {
      q: `${latitude},${longitude}`,
      days: 3,
    },
  })
  return response.data
}

export const getCityBySearch = async (search: string) => {
  const response = await axios.get('/api/search', {
    params: { q: search },
  })
  return response.data
}
