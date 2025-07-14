<template>
  <div class="side-menu" :class="{ open: modelValue }">
    <div class="side-menu-header">
      <button class="close-btn" @click="$emit('update:modelValue', false)" aria-label="Cerrar menú">
        <!-- Heroicons X Mark -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="side-menu-content">
      <button class="menu-action" @click="toggleDarkMode">
        {{ isDark ? 'Desactivar modo oscuro' : 'Activar modo oscuro' }}
      </button>
      <button class="menu-action signout" @click="signOut">
        Cerrar sesión
      </button>
    </div>
  </div>
  <div v-if="modelValue" class="side-menu-backdrop" @click="$emit('update:modelValue', false)"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'signout'])

const isDark = ref(false)

// Initialize theme on component mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark')
    isDark.value = true
  } else {
    document.documentElement.classList.remove('dark')
    isDark.value = false
  }
})

function toggleDarkMode() {
  const html = document.documentElement
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
    isDark.value = false
  } else {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
    isDark.value = true
  }
}

function signOut() {
  emit('signout')
}
</script>

<style lang="scss">
.side-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: var(--color-header);
  color: var(--color-text);
  box-shadow: -2px 0 12px rgba(0,0,0,0.08);
  z-index: 1001;
  transform: translateX(100%);
  transition: transform 0.25s cubic-bezier(.4,0,.2,1), background-color 0.3s, color 0.3s;
  display: flex;
  flex-direction: column;
  &.open {
    transform: translateX(0);
  }
}
.side-menu-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 64px;
  padding: 0 1rem;
  border-bottom: 1px solid var(--color-border);
}
.close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--color-text);
  display: flex;
  align-items: center;
  transition: background 0.2s, color 0.3s;
  &:hover,
  &:focus {
    background: var(--color-border);
  }
}
.side-menu-content {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.menu-action {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
  &:hover,
  &:focus {
    background: var(--color-border);
  }
}
.menu-action.signout {
  color: #e53935;
  border-color: #e53935;
  &:hover,
  &:focus {
    background: #e5393533;
  }
}
.side-menu-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  z-index: 1000;
}
</style>
