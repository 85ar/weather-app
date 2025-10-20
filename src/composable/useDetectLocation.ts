import { ref, computed } from 'vue'

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Ошибка геолокации:', error)
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationError.value =
            'Доступ к геолокации запрещен. Разрешите доступ в настройках браузера.'
          break
        case error.POSITION_UNAVAILABLE:
          locationError.value = 'Информация о местоположении недоступна.'
          break
        case error.TIMEOUT:
          locationError.value = 'Время ожидания определения местоположения истекло.'
          break
        default:
          locationError.value = 'Не удалось определить местоположение.'
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
    isSuccessDetecting
  }
}
