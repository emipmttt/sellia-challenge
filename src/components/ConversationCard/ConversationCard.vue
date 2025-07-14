<template>
  <div class="conversation-card" @click="onClick">
    <div class="status-dot" :class="{ active: isActive }"></div>
    <div class="conversation-main">
      <div class="conversation-row">
        <span class="client-name">{{ clientName }}</span>
        <span class="conversation-date">{{ latestMessageDateLabel }}</span>
      </div>
      <div class="conversation-preview">
        {{ latestMessagePreview }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation, Message } from '@/services/types'
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale/es'

const props = defineProps<{
  conversation: Conversation,
  isActive: boolean,
  previewMessage: Message | null,
}>()

const emit = defineEmits(['click'])
const onClick = () => emit('click', props.conversation.clientId)

const clientName = computed(() => {
  // Use clientName if available, else fallback
  // @ts-ignore
  if (props.conversation.clientName) return props.conversation.clientName
  return `Cliente ${props.conversation.clientId.slice(-4)}`
})

const latestMessageDateLabel = computed(() => {
  if (!props.previewMessage) return ''
  return `último mensaje hace ${formatDistanceToNow(new Date(props.previewMessage.createdAt), { locale: es, addSuffix: false })}`
})

const latestMessagePreview = computed(() => {
  if (!props.previewMessage) return 'Sin mensajes'
  if (typeof props.previewMessage.message?.text === 'string') return props.previewMessage.message.text
  return '[Mensaje no soportado]'
})
</script>

<style lang="scss">
@import './ConversationCard.scss';
</style>
