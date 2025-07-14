<template>
  <div class="side-menu" :class="{ open: modelValue }">
    <div class="side-menu-header">
      <button class="close-btn" @click="$emit('update:modelValue', false)" aria-label="Cerrar menú">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="side-menu-content">
      <button class="menu-action" @click="toggleDarkMode">
        {{ isDark ? 'Desactivar modo oscuro' : 'Activar modo oscuro' }}
      </button>

      <div class="font-size-control">
        <span>Tamaño de fuente:</span>
        <div class="font-size-buttons">
          <button @click="decrementFontSize">-</button>
          <input type="number" v-model.number="currentFontSize" @change="handleFontSizeChange" :min="minFontSize" :max="maxFontSize" />
          <button @click="incrementFontSize">+</button>
        </div>
      </div>

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
const currentFontSize = ref(16) // Default font size in pixels
const minFontSize = 12
const maxFontSize = 24
const fontSizeStep = 1

// Initialize theme and font size on component mount
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

  const savedFontSize = localStorage.getItem('fontSize')
  if (savedFontSize) {
    currentFontSize.value = parseInt(savedFontSize)
    document.documentElement.style.setProperty('--base-font-size', `${currentFontSize.value}px`)
  } else {
    document.documentElement.style.setProperty('--base-font-size', `${currentFontSize.value}px`)
  }
})

function handleFontSizeChange() {
  // Ensure font size stays within bounds
  if (currentFontSize.value < minFontSize) {
    currentFontSize.value = minFontSize
  } else if (currentFontSize.value > maxFontSize) {
    currentFontSize.value = maxFontSize
  }
  localStorage.setItem('fontSize', currentFontSize.value.toString())
  document.documentElement.style.setProperty('--base-font-size', `${currentFontSize.value}px`)
}

function incrementFontSize() {
  if (currentFontSize.value < maxFontSize) {
    currentFontSize.value += fontSizeStep
    handleFontSizeChange()
  }
}

function decrementFontSize() {
  if (currentFontSize.value > minFontSize) {
    currentFontSize.value -= fontSizeStep
    handleFontSizeChange()
  }
}

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
  width: 17.5rem;
  height: 100vh;
  background: var(--color-header);
  color: var(--color-text);
  box-shadow: -0.125rem 0 0.75rem rgba(0,0,0,0.08);
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
  height: 4rem;
  padding: 0 1rem;
  border-bottom: 1px solid var(--color-border);
}
.close-btn {
  background: none;
  border: none;
  padding: 0.3125rem;
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
  padding: 1.25rem 0.9375rem;
  display: flex;
  flex-direction: column;
  gap: 0.9375rem;
}

.font-size-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  span {
    font-weight: bold;
    color: var(--color-text);
  }

  .font-size-buttons {
    display: flex;
    gap: 0.5rem;

    button {
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      padding: 0.3125rem 0.625rem;
      cursor: pointer;
      transition: background 0.3s, color 0.3s, border-color 0.3s;
      font-size: 1rem;

      &:hover {
        background: var(--color-border);
      }
    }

    input[type="number"] {
      width: 3.75rem;
      text-align: center;
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      padding: 0.3125rem 0.15625rem;
      -moz-appearance: textfield;
      -webkit-appearance: none;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }
  }
}

.menu-action {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.46875rem 0.625rem;
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
