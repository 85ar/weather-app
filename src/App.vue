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
import { hideAll } from 'tippy.js'
import { useFavoritesStore } from './stores/favoritesStore'

// скрытие тултипов при скролле
window.addEventListener('wheel', () => hideAll(), { passive: true })
window.addEventListener('scroll', () => hideAll(), { passive: true })

const storeFavorites = useFavoritesStore()
storeFavorites.loadFavorites()
</script>

<style scoped></style>
