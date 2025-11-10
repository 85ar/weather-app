import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useWeatherStore } from './weatherStore'

export interface FavoriteCity {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  temp_c: number
  condition: {
    text: string
    icon: string
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const storeWeather = useWeatherStore()

  // Избранные города
  const favorites = ref<FavoriteCity[]>([])

  // работаем с localStorage
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

  const isFavorite = computed(() => {
    return favorites.value.some(
      (fav) => fav.lat === storeWeather.location.lat && fav.lon === storeWeather.location.lon,
    )
  })

  return {
    favorites,
    loadFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
})
