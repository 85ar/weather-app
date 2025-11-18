import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CityOptions } from './types'

export const useFavoritesStore = defineStore('favorites', () => {
  // Избранные города
  const favorites = ref<CityOptions[]>([])

  const loadFavorites = () => {
    const data = localStorage.getItem('favorite')
    favorites.value = data ? JSON.parse(data) : []
  }

  const saveFavorites = () => {
    localStorage.setItem('favorite', JSON.stringify(favorites.value))
  }

  const addFavorite = (city: CityOptions) => {
    if (!favorites.value.some((f) => f.id === city.id)) {
      favorites.value.push(city)
      saveFavorites()
    }
  }

  const removeFavorite = (id: string) => {
    favorites.value = favorites.value.filter((f) => f.id !== id)
    saveFavorites()
  }

  const hasFavorite = (lat: number, lon: number) => {
    return favorites.value.some(
      (fav) => fav.lat?.toFixed(3) === lat?.toFixed(3) && fav.lon?.toFixed(3) === lon?.toFixed(3),
    )
  }

  return {
    favorites,
    loadFavorites,
    addFavorite,
    removeFavorite,
    hasFavorite,
  }
})
