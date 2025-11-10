<template>
  <div
    class="relative w-full bg-white rounded-2xl shadow-md hover:shadow-sm transition-shadow p-5 border border-gray-100 cursor-pointer group"
  >
    <button
      @click.stop="removeCard(props.favorite.id)"
      class="absolute top-2 right-3 rounded-full hover:bg-red-50  transition cursor-pointer"
       v-tippy="{
            content: 'Удалить из Избранного',
            placement: 'top'
          }"
    >
      <Trash2  class="w-5 h-5 text-gray-400 hover:text-red-400" />
    </button>

    <div class="flex items-center justify-between mb-4">
      <div class="min-w-0">
        <h2 class="text-lg font-semibold text-gray-900 truncate flex items-center gap-1.5">
          <MapPin class="w-4 h-4 text-blue-500 flex-shrink-0" />
          {{ props.favorite.name }}
        </h2>
        <p class="text-sm text-gray-500 truncate mt-0.5">
          {{ props.favorite.country }}
        </p>
      </div>

      <div class="flex items-center text-right">
        <p class="text-2xl font-bold text-gray-800 leading-none">
          {{ Math.round(props.favorite.temp_c) }}°
        </p>
        <img :src="`https:${props.favorite.condition.icon}`" class="w-10 h-10 ml-1" />
      </div>
    </div>

    <p class="text-sm text-gray-700 font-medium mb-3 flex items-center gap-1">
      <span>{{ props.favorite.condition.text }}</span>
    </p>

    <div class="flex items-center justify-between text-sm text-gray-600">
      <div class="flex items-center gap-1.5">
        <Globe class="w-4 h-4 text-gray-500" />
        <span v-tippy="{ content: `Широта: ${props.favorite.lat.toFixed(6)}°`, placement: 'top' }">
          Ш: {{ props.favorite.lat.toFixed(3) }}°
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <Globe class="w-4 h-4 text-gray-500" />
        <span v-tippy="{ content: `Долгота: ${props.favorite.lon.toFixed(6)}°`, placement: 'top' }">
          Д: {{ props.favorite.lon.toFixed(3) }}°
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useFavorites } from '../composable/useFavorites'
import { type FavoriteCity } from '../stores/weatherStore'
import { MapPin, Trash2 , Globe } from 'lucide-vue-next'

const toast = useToast()

const props = defineProps<{
  favorite: FavoriteCity
}>()

const removeCard = (id: string) => {
  remove(id)
  toast.success('Город удален из Избранного')
}

const { remove } = useFavorites()
</script>
