import { computed } from 'vue'
import { useWeatherStore } from '../stores/weather'
import { storeToRefs } from 'pinia'

export function useFavorites() {
  const store = useWeatherStore()
  const { favorites, current, location } = storeToRefs(store)

  const isFavorite = computed(() => {
    return favorites.value.some(
      (fav) => fav.lat === location.value.lat && fav.lon === location.value.lon,
    )
  })

  const add = () => {
    if (!isFavorite.value) {
      store.addFavorite({
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
    store.removeFavorite(id)
  }

  return { favorites, isFavorite, add, remove }
}
