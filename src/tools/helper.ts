export const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDate = (timeString: string) => {
  return new Date(timeString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// км/ч в м/с и округление
export const formatSpeed = (value: number) => Math.round(value / 3.6)
