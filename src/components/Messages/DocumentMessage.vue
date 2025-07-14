<template>
  <div class="document-message">
    <a :href="href" target="_blank" rel="noopener noreferrer">
      <DocumentTextIcon class="h-6 w-6" style="width: 24px; height: 24px;" />
      <span>{{ filename || 'Documento' }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  href: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    default: 'Documento'
  }
})
</script>

<style scoped lang="scss">
.document-message {
  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-text);
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: var(--color-background-soft);
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-background-mute);
    }

    svg {
      width: 24px;
      height: 24px;
      color: var(--color-primary);
    }

    span {
      word-break: break-all;
    }
  }
}
</style>
