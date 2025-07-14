<template>
  <div class="base-layout">
    <header class="layout-header">
      <div class="logo-container">
        <Logo :isHeader="true" />
      </div>
      <slot name="header-actions"></slot>
      <button class="hamburger-btn" aria-label="Abrir menú" @click="menuOpen = true">
        <!-- Heroicons outline menu SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          width="28" height="28">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </header>
    <SideMenu v-model="menuOpen" @signout="handleSignOut" />
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '@/components/Logo/Logo.vue'
import SideMenu from '@/components/SideMenu/SideMenu.vue'

const menuOpen = ref(false)
const router = useRouter()

function handleSignOut() {
  router.push('/login')
}
</script>

<style scoped lang="scss">
@import './BaseLayout.scss';
</style>
