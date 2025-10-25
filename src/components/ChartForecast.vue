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
  type ChartOptions,
} from 'chart.js'
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { storeToRefs } from 'pinia'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const store = useWeatherStore()
const { activeDay } = storeToRefs(store)

const filteredHours = computed(() => {
  if (!activeDay.value) return []
  const targetData = activeDay.value?.split('.').reverse().join('-')
  const day = store.forecast.forecastday.find((item) => item.date === targetData)
  return day?.hour ?? []
})

const chartData = computed(() => {
  const labels = filteredHours.value.map((h) => h.time.split(' ')[1])

  // температура
  const temperatureData = filteredHours.value.map((h) => h.temp_c)

  // // влажность
  const humidityData = filteredHours.value.map((h) => h.humidity)

  // // давление
  const pressureData = filteredHours.value.map((h) => Number((h.pressure_mb * 0.750062).toFixed(1)))

  return {
    labels,
    datasets: [
      {
        label: 'Температура (°C)',
        data: temperatureData,
        borderColor: '#3b82f6',
        tension: 0.3,
        fill: false,
        yAxisID: 'y',
      },
      {
        label: 'Влажность',
        data: humidityData,
        borderColor: '#36a2eb',
        tension: 0.3,
        fill: false,
        yAxisID: 'y1',
      },
      {
        label: 'Давление',
        data: pressureData,
        borderColor: '#4bc0c0',
        tension: 0.3,
        fill: false,
        yAxisID: 'y1',
      },
    ],
  }
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Время суток',
        font: { size: 12 },
        color: '#6b7280',
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 12,
      },
    },
    y: {
      title: {
        display: true,
        text: 'Температура, °C',
        font: { size: 12 },
        color: '#3b82f6',
      },
      beginAtZero: false,
    },
    y1: {
      type: 'linear',
      position: 'right',
      title: {
        display: true,
        text: 'Влажность (%), Давление (мм рт.ст.)',
        font: { size: 12 },
        color: '#6b7280',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  max-width: 900px;
  height: 400px;
  margin: 0 auto;
}
</style>
