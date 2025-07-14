<template>
  <div :class="{ 'logo-sellia': !isHeader, 'sellia-logo-header': isHeader }">
    <img
      class="sellia-logo"
      :src="logoSrc"
      alt="Logo de Sellia"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import './Logo.scss'

const props = defineProps<{ isHeader: boolean }>()

const isDark = ref(document.documentElement.classList.contains('dark'))

const updateTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

let observer: MutationObserver | null = null
onMounted(() => {
  updateTheme()
  observer = new MutationObserver(updateTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
onUnmounted(() => {
  observer?.disconnect()
})

const logoSrc = computed(() =>
  isDark.value ? '/logo-white.png' : '/logo.png'
)
</script>
