<template>
  <div class="flex h-screen">
    <NavBar />
    <main class="flex-1 p-4">
      <RouterView />
    </main>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import NavBar from './components/NavBar.vue'
import { hideAll } from 'tippy.js'
import { useFavoritesStore } from './stores/favoritesStore'

const hide = () => hideAll()
const storeFavorites = useFavoritesStore()

// скрытие тултипов при скролле
onMounted(() => {
  window.addEventListener('wheel', hide, { passive: true })
  window.addEventListener('scroll', hide, { passive: true })

  storeFavorites.loadFavorites()
})

// Очистка при размонтировании
onUnmounted(() => {
  window.removeEventListener('wheel', hide)
  window.removeEventListener('scroll', hide)
})
</script>

<style scoped></style>
