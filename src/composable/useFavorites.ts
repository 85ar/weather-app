import { computed } from 'vue'
import { useWeatherStore } from '../stores/weatherStore'
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '../stores/favoritesStore'

export function useFavorites() {
  const storeWeather = useWeatherStore()
  const storeFavorites = useFavoritesStore()
  const { location } = storeToRefs(storeWeather)
  const { favorites } = storeToRefs(storeFavorites)

  const isFavorite = computed(() => {
    return storeFavorites.hasFavorite(location.value.lat, location.value.lon)
  })

  const add = () => {
    if (!isFavorite.value) {
      storeFavorites.addFavorite({
        id: `${location.value.lat.toFixed(3)}_${location.value.lon.toFixed(3)}`,
        name: location.value.name,
        country: location.value.country,
        region: location.value.region,
        lat: location.value.lat,
        lon: location.value.lon,
      })
    }
  }

  const remove = (id: string) => {
    storeFavorites.removeFavorite(id)
  }

  return { favorites, isFavorite, add, remove }
}
