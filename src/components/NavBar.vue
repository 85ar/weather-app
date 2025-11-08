<template>
  <nav
    class="bg-white border-r border-gray-200 flex flex-col transition-all duration-300"
    :class="isCompact ? 'w-20' : 'w-64'"
  >
    <div class="px-4 py-6 flex items-center gap-2">
      <CloudSunRain class="w-8 h-8 text-blue-500" />
      <span v-if="!isCompact" class="text-lg font-semibold text-gray-800 whitespace-nowrap">
        Метео навигатор
      </span>
    </div>

    <div class="flex-1 px-3">
      <ul class="space-y-2">
        <li v-for="item in menu" :key="item.to">
          <router-link
            :to="item.to"
            class="flex items-center gap-3 p-3 rounded-xl transition hover:bg-blue-50"
            :class="[
              route.path === item.to ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-600',
              isCompact && 'justify-center',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!isCompact" class="whitespace-nowrap">
              {{ item.label }}
            </span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="px-3 pb-5">
      <p v-if="!isCompact" class="text-xs uppercase text-gray-400 px-2 mb-3">Система</p>
      <ul class="space-y-2">
        <li>
          <router-link
            to="/setting"
            class="flex items-center gap-3 p-3 rounded-xl transition hover:bg-blue-50"
            :class="[
              route.path === '/setting'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-600',
              isCompact && 'justify-center',
            ]"
          >
            <Settings class="w-5 h-5" />
            <span v-if="!isCompact">Настройки</span>
          </router-link>
        </li>

        <li>
          <button
            @click="logout"
            class="flex items-center gap-3 p-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition"
            :class="[isCompact && 'justify-center']"
          >
            <LogOut class="w-5 h-5" />
            <span v-if="!isCompact">Выход</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { CloudSunRain, House, Map, MapPinCheck, BookHeart, Settings, LogOut } from 'lucide-vue-next'

const route = useRoute()
const isCompact = ref(false)

const menu = [
  { label: 'Дашборд', to: '/', icon: House },
  { label: 'Карта', to: '/map', icon: Map },
  { label: 'Моя локация', to: '/location', icon: MapPinCheck },
  { label: 'Избранное', to: '/favorite', icon: BookHeart },
]

const logout = () => {
  console.log('logout')
}

// Авто-compact на малых экранах
onMounted(() => {
  const updateCompact = () => {
    isCompact.value = window.innerWidth < 768
  }

  updateCompact()
  window.addEventListener('resize', updateCompact)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateCompact)
  })
})
</script>

<style scoped>
nav {
  min-height: 100vh;
}
</style>
