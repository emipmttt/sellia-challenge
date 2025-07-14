<template>
  <BaseLayout>
    <template #header-actions>
      <div class="conv-header-actions">
        <button class="back-btn" @click="$router.back()" aria-label="Back">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span class="online-dot" :class="{ online: client }"></span>
        <span class="client-name">{{ client?.name || 'Loading...' }}</span>
      </div>
    </template>
    <div class="conversation-container">
      <div class="chat-area">
        <div class="messages">
          <div v-for="message in messages" :key="message._id" :class="['message', { 'right': !isMyMessage(message) }]">
            <div :class="['message-content', { 'is-mine': isMyMessage(message) }]">
              {{ getMessageText(message) }}
            </div>
          </div>
        </div>
        <div class="input-area">
          <input
            v-model="newMessage"
            @keypress.enter="sendMessage"
            :disabled="isLoading"
            placeholder="Type a message..."
          />
          <button class="send-btn" @click="sendMessage" :disabled="isLoading || !newMessage.trim()">
            <svg width="28" height="28" fill="none" stroke="var(--color-primary)" stroke-width="2" viewBox="0 0 24 24">
              <path d="M22 2L11 13" stroke-linecap="round" stroke-linejoin="round"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout/BaseLayout.vue'
import './Conversation.scss'

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConversationsService } from '@/services/conversations'
import type { Message, Conversation, Client } from '@/services/types'

const route = useRoute()
const $router = useRouter()
const clientId = route.params.clientId as string
const { getConversationById, sendMessage: sendMessageToAPI, getClientById } = useConversationsService()

const messages = ref<Message[]>([])
const client = ref<Client | null>(null)
const newMessage = ref('')
const isLoading = ref(false)

const sendMessage = async () => {
  if (newMessage.value.trim() && !isLoading.value) {
    isLoading.value = true
    try {
      const message = await sendMessageToAPI(clientId, newMessage.value)
      messages.value.push(message)
      newMessage.value = ''
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      isLoading.value = false
    }
  }
}

const loadConversation = async () => {
  try {
    const [conversation, clientData] = await Promise.all([
      getConversationById(clientId),
      getClientById(clientId)
    ])
    messages.value = conversation.messages
    client.value = clientData
  } catch (error) {
    console.error('Error loading conversation:', error)
  }
}

const isMyMessage = (message: Message): boolean => {
  // Message is 'mine' if its message.user field matches the clientId in the URL
  return message.message.user === clientId
}

const getMessageText = (message: Message): string => {
  return message.message.text || '[Mensaje no soportado]'
}

onMounted(() => {
  loadConversation()
})
</script>

