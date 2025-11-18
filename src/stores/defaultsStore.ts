import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CityOptions } from './types'
import { getCityBySearch } from '../api/service'

export const useDefaultsStore = defineStore('defaults', () => {
  const defaultCity = ref<CityOptions>({} as CityOptions)

  const loadDefaults = () => {
    const data = localStorage.getItem('defaults')
    defaultCity.value = data ? JSON.parse(data) : {}
  }

  const saveDefaults = (city: CityOptions) => {
    localStorage.setItem('defaults', JSON.stringify(city))
  }

  const fetchCityBySearchDefault = async (city: string) => {
    try {
      const result = await getCityBySearch(city)
      defaultCity.value = {
        id: `${result[0].lat}_${result[0].lon}`,
        name: result[0].name,
        country: result[0].country,
        region: result[0].region,
        lat: result[0].lat,
        lon: result[0].lon,
      }
      saveDefaults(defaultCity.value)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    loadDefaults,
    saveDefaults,
    defaultCity,
    fetchCityBySearchDefault,
  }
})
