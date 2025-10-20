<template>
  <div class="flex h-screen">
    <NavBar />
    <main class="flex-1 p-4">
      <RouterView />
    </main>
  </div>
</template>
<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<style scoped></style>
