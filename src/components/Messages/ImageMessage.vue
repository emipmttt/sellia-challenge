<template>
  <div class="image-message">
    <img
      v-if="!hasError"
      :src="src"
      alt="Image message"
      @error="onImageError"
    />
    <div v-else class="placeholder-icon">
      <ExclamationCircleIcon class="h-6 w-6" />
      <p>Imagen no pudo cargar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const hasError = ref(false)


const onImageError = () => {
  console.error('Failed to load image:', props.src)
  hasError.value = true
}
</script>

<style scoped lang="scss">
.image-message {
  max-width: 100%;
  img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }

  .placeholder-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px; /* Adjust as needed */
    background-color: var(--color-background-soft);
    border-radius: 8px;
    color: var(--color-text-light);

    svg {
      color: var(--color-primary);
      margin-bottom: 8px;
      min-width: 24px; /* Ensure consistent size */
      min-height: 24px; /* Ensure consistent size */
    }

    p {
      font-size: 0.9em;
    }
  }
}
</style>
