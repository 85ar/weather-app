import { ref, computed } from 'vue'

interface GeolocationError extends Error {
  code: number
}

export function useDetectLocation() {
  const isSuccessDetecting = ref(false)
  const isDetectingLocation = ref(false)
  const locationError = ref('')
  const coords = ref<{ latitude: number; longitude: number } | null>(null)

  const isSupportedLocation = computed(() => !!navigator.geolocation)

  const getLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    if (!isSupportedLocation.value) {
      locationError.value = 'Геолокация не поддерживается вашим браузером'
      return null
    }

    isDetectingLocation.value = true
    locationError.value = ''
    coords.value = null

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const { latitude, longitude } = position.coords
      coords.value = { latitude, longitude }
      isSuccessDetecting.value = true
      return coords.value
    } catch (error: unknown) {
      const geolocationError = error as GeolocationError

      if (geolocationError.code !== undefined) {
        switch (geolocationError.code) {
          case 1: // PERMISSION_DENIED
            locationError.value =
              'Доступ к геолокации запрещен. Разрешите доступ в настройках браузера.'
            break
          case 2: // POSITION_UNAVAILABLE
            locationError.value = 'Информация о местоположении недоступна.'
            break
          case 3: // TIMEOUT
            locationError.value = 'Время ожидания определения местоположения истекло.'
            break
          default:
            locationError.value = 'Не удалось определить местоположение.'
        }
      } else {
        locationError.value = 'Неожиданная ошибка при определении местоположения.'
      }
      return null
    } finally {
      isDetectingLocation.value = false
    }
  }

  return {
    coords,
    isDetectingLocation,
    locationError,
    getLocation,
    isSupportedLocation,
    isSuccessDetecting,
  }
}
