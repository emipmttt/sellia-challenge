<template>
  <BaseLayout>
    <template #default>
      <div class="home-container">
        <div class="conversations-list">
          <ConversationCard v-for="conversation in conversations" :key="conversation.clientId"
            :conversation="conversation" :client="clientMap[conversation.clientId]"
            :is-active="isActive(conversation)"
            :preview-message="previewMessages[conversation.clientId]"
            @click="navigateToConversation(conversation.clientId)" />
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationsService, getPreviewMessage, useClientsService } from '@/services/conversations'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale/es'
import type { Conversation, Message, Client } from '@/services/types'
import BaseLayout from '@/components/BaseLayout/BaseLayout.vue'
import ConversationCard from '@/components/ConversationCard/ConversationCard.vue'

const router = useRouter()
// This file is aligned with the updated Client type: { _id, name, updatedAt, createdAt }
const { getConversations } = useConversationsService()
const { getClients } = useClientsService()
const conversations = ref<Conversation[]>([])
const clients = ref<Client[]>([])
const previewMessages = ref<Record<string, Message | null>>({})

const clientMap = computed<Record<string, Client>>(() => {
  const map: Record<string, Client> = {}
  for (const client of clients.value) {
    map[client._id] = client
  }
  return map
})

onMounted(async () => {
  try {
    conversations.value = await getConversations()
    clients.value = await getClients()
    
    // Debug logging
    console.log('Conversations:', conversations.value)
    console.log('Clients:', clients.value)
    console.log('ClientMap:', clientMap.value)
    
    // Check for mismatches
    conversations.value.forEach(conv => {
      const client = clientMap.value[conv.clientId]
      console.log(`Conversation ${conv.clientId} -> Client:`, client)
      if (!client) {
        console.error(`No client found for conversation ${conv.clientId}`)
      }
    })
    
    // Fetch preview messages for each conversation
    await Promise.all(
      conversations.value.map(async (conv) => {
        const preview = await getPreviewMessage(conv.clientId)
        previewMessages.value[conv.clientId] = preview
      })
    )
  } catch (error) {
    console.error('Error fetching conversations or clients:', error)
  }
})

const isActive = (conversation: Conversation) => {
  // Example: active if unreadCount > 0
  return conversation.unreadCount > 0
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
}


// Theme variables are now handled globally in theme.scss
</style>
