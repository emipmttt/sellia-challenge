<template>
  <button class="button-primary" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
import './Button.scss'

const props = defineProps({
  type: {
    type: String as import('vue').PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
