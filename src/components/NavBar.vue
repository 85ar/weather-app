<template>
  <nav
    class="bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed md:relative h-screen z-40"
    :class="isCompact ? 'w-16' : 'w-64'"
  >
    <div class="px-4 py-6 flex items-center gap-2" :class="isCompact ? 'justify-center' : ''">
      <CloudSunRain class="w-8 h-8 text-blue-500 flex-shrink-0" />
      <span v-if="!isCompact" class="text-lg font-semibold text-gray-800 whitespace-nowrap">
        Метео навигатор
      </span>
    </div>

    <div class="flex-1 px-3">
      <ul class="space-y-2">
        <li v-for="item in menu" :key="item.to">
          <router-link
            :to="item.to"
            :aria-label="item.label"
            class="flex items-center gap-3 p-3 rounded-xl transition group relative"
            :class="[
              route.path === item.to
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-blue-50',
              isCompact && 'justify-center',
            ]"
            v-tippy="
              isCompact
                ? {
                    content: item.label,
                    placement: 'right',
                  }
                : {}
            "
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
            class="flex items-center gap-3 p-3 rounded-xl transition"
            :class="[
              route.path === '/setting'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-blue-50',
              isCompact && 'justify-center',
            ]"
            v-tippy="
              isCompact
                ? {
                    content: 'Настройки',
                    placement: 'right',
                  }
                : {}
            "
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
            v-tippy="
              isCompact
                ? {
                    content: 'Выход',
                    placement: 'right',
                  }
                : {}
            "
          >
            <LogOut class="w-5 h-5" />
            <span v-if="!isCompact" aria-label="Выход">Выход</span>
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
  { label: 'Избранное', to: '/favorite', icon: BookHeart },
  { label: 'Моя локация', to: '/location', icon: MapPinCheck },
]

const logout = () => {
  console.log('logout')
}

const updateCompact = () => {
  isCompact.value = window.innerWidth < 1024
}

// Авто-compact на малых экранах
onMounted(() => {
  updateCompact()
  window.addEventListener('resize', updateCompact)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCompact)
})
</script>

<style scoped>
/* Фиксированная высота для мобильных */
nav {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
}
</style>
