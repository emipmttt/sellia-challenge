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
import Logo from '@/components/Logo/Logo.vue'
import SideMenu from '@/components/SideMenu/SideMenu.vue'

const menuOpen = ref(false)

function handleSignOut() {
  // Emit signout event for parent layout/view to handle
  // You can add additional logic here if needed
  // Example: emit('signout') if using defineEmits
  window.location.href = '/login' // or use router if available
}
</script>

<style scoped lang="scss">
@import './BaseLayout.scss';
</style>
