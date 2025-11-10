import { computed } from 'vue'
import { useWeatherStore } from '../stores/weatherStore'
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '../stores/favoritesStore'

export function useFavorites() {
  const storeWeather = useWeatherStore()
  const storeFavorites = useFavoritesStore()

  const { current, location } = storeToRefs(storeWeather)
  const { favorites } = storeToRefs(storeFavorites)

  const isFavorite = computed(() => {
    return favorites.value.some(
      (fav) => fav.lat === location.value.lat && fav.lon === location.value.lon,
    )
  })

  const add = () => {
    if (!isFavorite.value) {
      storeFavorites.addFavorite({
        id: `${location.value.lat}_${location.value.lon}`,
        name: location.value.name,
        country: location.value.country,
        lat: location.value.lat,
        lon: location.value.lon,
        temp_c: current.value.temp_c,
        condition: {
          text: current.value.condition.text,
          icon: current.value.condition.icon,
        },
      })
    }
  }

  const remove = (id: string) => {
    storeFavorites.removeFavorite(id)
  }

  return { favorites, isFavorite, add, remove }
}
