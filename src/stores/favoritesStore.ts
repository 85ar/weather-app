import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FavoriteCity } from './types'

export const useFavoritesStore = defineStore('favorites', () => {
  // Избранные города
  const favorites = ref<FavoriteCity[]>([])

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

  const hasFavorite = (lat: number, lon: number) => {
    return favorites.value.some((fav) => fav.lat === lat && fav.lon === lon)
  }

  return {
    favorites,
    loadFavorites,
    addFavorite,
    removeFavorite,
    hasFavorite,
  }
})
