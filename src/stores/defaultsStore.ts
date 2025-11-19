import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CityOptions } from './types'
import { getCityBySearch } from '../api/service'

export const useDefaultsStore = defineStore('defaults', () => {
  const defaultCity = ref<CityOptions>({} as CityOptions)

const isSavingDefault = ref<boolean>(false)

const loadDefaults = () => {
  const data = localStorage.getItem('defaults')
  defaultCity.value = data ? JSON.parse(data) : {}
}

const saveDefaults = (city: CityOptions) => {
  localStorage.setItem('defaults', JSON.stringify(city))
}

const fetchCityBySearchDefault = async (city: string) => {
  isSavingDefault.value = true
  try {
    const result = await getCityBySearch(city)
    const newCity = result[0]
    defaultCity.value = {
      id: `${newCity.lat}_${newCity.lon}`,
      name: newCity.name,
      country: newCity.country,
      region: newCity.region,
      lat: newCity.lat,
      lon: newCity.lon,
    }
    saveDefaults(defaultCity.value)
  } catch (error) {
    console.error(error)
  } finally {
    isSavingDefault.value = false
  }
}

  return {
    loadDefaults,
    saveDefaults,
    defaultCity,
    fetchCityBySearchDefault,
    isSavingDefault,
  }
})
