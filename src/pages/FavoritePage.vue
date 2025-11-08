<template>
  <h1 class="text-xl font-semibold m-4">Избранные города</h1>

  <div v-if="favorites.length === 0" class="m-4 text-gray-500">Нет сохранённых городов</div>

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    <CardFavorite v-for="favorite in favorites" :key="favorite.id" :favorite="favorite" />
  </div>
</template>

<script setup lang="ts">
import CardFavorite from '../components/CardFavorite.vue'
import { useFavorites } from '../composable/useFavorites';

const { favorites } = useFavorites();
</script>

<style scoped></style>
