import { ref } from 'vue'
import { getCityBySearch } from '../api/service'
import { defineStore } from 'pinia'
import type { CityOptions } from './types'

export const useSearchStore = defineStore('search', () => {
  const citiesOptions = ref<CityOptions[]>([])
  const loadingOptions = ref<boolean>(false)

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

  return {
    fetchCityBySearch,
    citiesOptions,
    loadingOptions,
  }
})
