<template>
  <div class="button-message">
    <p class="main-text">{{ parsedMessage.mainText }}</p>
    <div class="buttons-container">
      <button
        v-for="(button, index) in parsedMessage.buttons"
        :key="index"

        class="message-button"
      >
        {{ button }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  messageText: {
    type: String,
    required: true
  }
})

const parseMessage = (text: string) => {
  const parts = text.split('|[');
  const mainText = parts[0].trim();
  const buttons: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    const buttonText = parts[i].split(']')[0].trim();
    if (buttonText) {
      buttons.push(buttonText);
    }
  }
  return { mainText, buttons };
};

const parsedMessage = computed(() => parseMessage(props.messageText));
</script>

<style scoped lang="scss">
.button-message {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .main-text {
    margin-bottom: 5px;
    white-space: pre-wrap; /* Preserves whitespace and line breaks */
  }

  .buttons-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .message-button {
    background-color: var(--color-background-soft); /* Lighter background for buttons */
    color: var(--color-primary); /* Primary color for text */
    border: 1px solid var(--color-border); /* Add a subtle border */
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-background-mute); /* Slightly darker on hover */
    }

    &:active {
      background-color: var(--color-background-soft); /* Revert on active */
    }
  }
}
</style>
