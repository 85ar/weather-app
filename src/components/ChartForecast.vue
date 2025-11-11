<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  type ChartOptions,
} from 'chart.js'
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { storeToRefs } from 'pinia'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
)

const storeWeather = useWeatherStore()
const { activeDay } = storeToRefs(storeWeather)

// Преобразуем выбранную дату в формат API
const filteredHours = computed(() => {
  if (!activeDay.value) return []
  const isoDate = activeDay.value.split('.').reverse().join('-')
  const day = storeWeather.forecast.forecastday.find((item) => item.date === isoDate)
  if (!day) return []

  return day.hour.map((h) => ({
    time: h.time.split(' ')[1],
    temp: h.temp_c,
    humidity: h.humidity,
    pressure: Number((h.pressure_mb * 0.750062).toFixed(1)),
  }))
})

const chartData = computed(() => {
  return {
    labels: filteredHours.value.map((h) => h.time),
    datasets: [
      {
        label: 'Температура (°C)',
        data: filteredHours.value.map((h) => h.temp),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: true,
        tension: 0.35,
        yAxisID: 'y',
      },
      {
        label: 'Влажность (%)',
        data: filteredHours.value.map((h) => h.humidity),
        borderColor: '#10b981',
        tension: 0.3,
        fill: false,
        yAxisID: 'y1',
      },
      {
        label: 'Давление (мм рт.ст.)',
        data: filteredHours.value.map((h) => h.pressure),
        borderColor: '#f97316',
        borderDash: [4, 4],
        tension: 0.25,
        fill: false,
        yAxisID: 'y2',
      },
    ],
  }
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      labels: { usePointStyle: true },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const v = ctx.formattedValue
          if (ctx.dataset.label?.includes('Температура')) return `🌡 ${v}°C`
          if (ctx.dataset.label?.includes('Влажность')) return `💧 ${v}%`
          if (ctx.dataset.label?.includes('Давление')) return `🧭 ${v} мм`
          return v
        },
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: 'Время', color: '#6b7280' },
      ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
    },
    y: {
      // Температура
      title: { display: true, text: '°C', color: '#3b82f6' },
      beginAtZero: false,
    },
    y1: {
      // Влажность
      position: 'right',
      title: { display: true, text: '%', color: '#10b981' },
      grid: { drawOnChartArea: false },
      min: 0,
      max: 100,
    },
    y2: {
      // Давление
      position: 'right',
      title: { display: true, text: 'мм рт.ст.', color: '#f97316' },
      grid: { drawOnChartArea: false },
    },
  },
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-width: 900px;
  height: 420px;
  margin: 0 auto;
}
</style>
