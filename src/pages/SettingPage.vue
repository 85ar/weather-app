<template>
  <h1 class="text-xl font-semibold p-4 bg-white sticky top-0 z-10">Настройки приложения</h1>

  <div class="p-4 max-w-2xl">
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2"> Город по умолчанию </label>
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <input
            v-model="cityInput"
            type="text"
            placeholder="Введите город..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500"
          />
          <span v-if="isSavingDefault" class="loader absolute right-4 top-2"></span>
        </div>
        <button
          @click="selectCity(cityInput)"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Сохранить
        </button>
      </div>
      <p class="mt-2 text-sm text-gray-500">
        При открытии приложения будет автоматически загружена погода для этого города.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useDefaultsStore } from '../stores/defaultsStore'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

const storeDefaults = useDefaultsStore()
const { defaultCity, isSavingDefault } = storeToRefs(storeDefaults)
const toast = useToast()

const cityInput = ref<string>('')

const selectCity = (city: string) => {
  storeDefaults.fetchCityBySearchDefault(city)
  if (isSavingDefault.value) toast.success('Город по умолчанию сохранен')
}

onMounted(() => {
  storeDefaults.loadDefaults()
  if (Object.keys(defaultCity).length) cityInput.value = defaultCity.value.name
})
</script>

<style scoped>

</style>
