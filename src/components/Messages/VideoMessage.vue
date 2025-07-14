<template>
  <div class="video-message">
    <video
      v-if="!hasError"
      controls
      :src="src"
      @error="onVideoError"
    >
      Your browser does not support the video tag.
    </video>
    <div v-else class="placeholder-icon">
      <PlayCircleIcon class="h-6 w-6" />
      <p>Video no pudo cargar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { PlayCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const hasError = ref(false)


const onVideoError = () => {
  console.error('Failed to load video:', props.src)
  hasError.value = true
}
</script>

<style scoped lang="scss">
.video-message {
  max-width: 100%;
  video,
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
    background-color: var(--color-background-soft); /* Ensure a light background */
    border-radius: 8px;
    color: var(--color-text); /* Use a darker text color for contrast */

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
