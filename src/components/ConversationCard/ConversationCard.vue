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
// This component is aligned with the updated Client type: { _id, name, updatedAt, createdAt }
import type { Conversation, Message } from '@/services/types'
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale/es'
import type { Client } from '@/services/types'

const props = defineProps<{
  client: Client | undefined,
  conversation: Conversation,
  isActive: boolean,
  previewMessage: Message | null,
}>()

const emit = defineEmits(['click'])
const onClick = () => emit('click', props.conversation.clientId)

const clientName = computed(() => {
  return props.client?.name || 'Cliente desconocido'
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
