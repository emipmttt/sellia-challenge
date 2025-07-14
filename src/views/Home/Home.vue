<template>
  <BaseLayout>
    <template #default>
      <div class="home-container">
        <div class="conversations-list">
          <ConversationCard
            v-for="conversation in conversations"
            :key="conversation.clientId"
            :conversation="conversation"
            :is-active="isActive(conversation)"
            :preview-message="previewMessages[conversation.clientId]"
            @click="navigateToConversation(conversation.clientId)"
          />
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationsService, getPreviewMessage } from '@/services/conversations'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale/es'
import type { Conversation, Message, MessageContent } from '@/services/types'
import BaseLayout from '@/components/BaseLayout/BaseLayout.vue'
import ConversationCard from '@/components/ConversationCard/ConversationCard.vue'

const router = useRouter()
const { getConversations } = useConversationsService()
const conversations = ref<Conversation[]>([])
const previewMessages = ref<Record<string, Message | null>>({})

onMounted(async () => {
  try {
    conversations.value = await getConversations()
    // Fetch preview messages for each conversation
    await Promise.all(
      conversations.value.map(async (conv) => {
        const preview = await getPreviewMessage(conv.clientId)
        previewMessages.value[conv.clientId] = preview
      })
    )
  } catch (error) {
    console.error('Error fetching conversations:', error)
  }
})

const getUltimoMensaje = (conversation: Conversation) => {
  if (!conversation.messages || conversation.messages.length === 0) return null
  // Sort messages by createdAt descending
  return [...conversation.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
}

const getUltimoMensajeDate = (conversation: Conversation) => {
  const ultimo = getUltimoMensaje(conversation)
  if (!ultimo) return ''
  return `último mensaje hace ${formatDistanceToNow(new Date(ultimo.createdAt), { locale: es, addSuffix: false })}`
}

const getUltimoMensajePreview = (conversation: Conversation) => {
  const ultimo = getUltimoMensaje(conversation)
  if (!ultimo) return 'Sin mensajes'
  if (typeof ultimo.message === 'string') return ultimo.message
  return '[Mensaje no soportado]'
}

const isActive = (conversation: Conversation) => {
  // Example: active if unreadCount > 0
  return conversation.unreadCount > 0
}

const getClientName = (conversation: Conversation) => {
  // You may want to fetch client name from a clients service if available
  // For now, fallback to user field
  return conversation.lastMessage.message.user || 'Cliente'
}

const getPreview = (msg: MessageContent) => {
  switch (msg.type) {
    case 'text':
      return msg.text || ''
    case 'image':
      return 'Preview de imagen enviada.'
    case 'document':
      return 'Preview de documento enviado.'
    case 'video':
      return 'Preview de video enviado.'
    default:
      return ''
  }
}

const navigateToConversation = (clientId: string) => {
  router.push(`/conversation/${clientId}`)
}
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: var(--color-bg, #fff);
  padding: 0;

  .conversations-list {
    display: flex;
    flex-direction: column;
    }
  }

@media (max-width: 640px) {
  .home {
    .conversations-list {
      max-width: 100vw;
      .conversation-card {
        padding: 0.8rem 0.6rem 0.8rem 0.4rem;
        .status-dot {
          margin-right: 0.7rem;
        }
      }
    }
  }
}

:root {
  --color-card: #fff;
  --color-card-hover: #f3f4f6;
  --color-bg: #fff;
  --color-header: #fff;
  --color-border: #e2e8f0;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-status-active: #1ed600;
  --color-status-inactive: #d1d5db;
}

[data-theme="dark"] {
  --color-card: #1f2937;
  --color-card-hover: #2d3748;
  --color-bg: #0f172a;
  --color-header: #2e3342;
  --color-border: #374151;
  --color-text: #f8fafc;
  --color-text-muted: #d1d5db;
  --color-status-active: #1ed600;
  --color-status-inactive: #4b5563;
}
</style>

