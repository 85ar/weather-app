<template>
  <div class="flex h-screen">
    <NavBar />
    <main class="flex-1 p-4">
      <RouterView />
    </main>
  </div>
</template>
<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { useWeatherStore } from '@/stores/weather'
import { hideAll } from 'tippy.js'

// скрытие тултипов при скролле
window.addEventListener('wheel', () => hideAll(), { passive: true })
window.addEventListener('scroll', () => hideAll(), { passive: true })

const store = useWeatherStore()
store.loadFavorites()
</script>

<style scoped></style>
