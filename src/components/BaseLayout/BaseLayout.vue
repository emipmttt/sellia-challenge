<template>
  <div class="base-layout">
    <header class="layout-header">
      <div class="logo-container">
        <Logo />
      </div>
      <slot name="header-actions"></slot>
    </header>
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/components/Logo/Logo.vue'
</script>

<style scoped lang="scss">
@import './BaseLayout.scss';
</style>
