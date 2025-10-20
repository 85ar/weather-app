<template>
  <nav class="w-68 bg-gray-100 text-gray-500 flex flex-col">
    <div class="px-4 py-6">
      <router-link to="/" class="flex items-center gap-2 text-blue-600">
        <CloudSunRain class="w-8 h-8" />
        <span class="text-lg font-semibold">Метео навигатор</span>
      </router-link>
    </div>

    <div class="flex-1 p-4">
      <ul class="space-y-4">
        <li>
          <router-link
            to="/"
            :class="{ 'text-blue-600': route.path === '/' }"
            class="flex items-center gap-2 p-2 rounded hover:bg-blue-100 transition"
          >
            <House />
            <span>Дашборд</span></router-link
          >
        </li>
        <li>
          <router-link
            to="/map"
            :class="{ 'text-blue-600': route.path === '/map' }"
            class="flex items-center gap-2 p-2 rounded hover:bg-blue-100 transition"
          >
            <Map />
            <span>Карта</span></router-link
          >
        </li>
        <li>
          <router-link
            to="/location"
            :class="{ 'text-blue-600': route.path === '/location' }"
            class="flex items-center gap-2 p-2 rounded hover:bg-blue-100 transition"
          >
            <MapPinCheck />
            <span>Моя локация</span></router-link
          >
        </li>
      </ul>
    </div>

    <div class="p-4">
      <span>Система</span>
      <ul class="space-y-4 mt-4">
        <li>
          <router-link
            to="/setting"
            :class="{ 'text-blue-600': route.path === '/setting' }"
            class="flex items-center gap-2 p-2 rounded hover:bg-blue-100 transition"
          >
            <Settings />
            <span>Настройки</span></router-link
          >
        </li>
        <li
          class="flex items-center gap-2 p-2 rounded hover:bg-blue-100 transition text-orange-400"
        >
          <LogOut />
          <button
            @click="logout()"
            class="flex items-center rounded hover:bg-blue-100 transition cursor-pointer"
          >
            Выход
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { House, Map, Settings, LogOut, CloudSunRain, MapPinCheck } from 'lucide-vue-next'

const route = useRoute()
const logout = () => {
  console.log('logout')
}
</script>

<style scoped></style>
