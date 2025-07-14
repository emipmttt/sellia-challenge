<template>
  <BaseLayout>
    <template #header-actions>
      <div class="conv-header-actions">
        <button class="back-btn" @click="$router.back()" aria-label="Back">
          <ArrowLeftIcon class="h-6 w-6" />
        </button>
        <span class="online-dot" :class="{ online: client }"></span>
        <span class="client-name">{{ client?.name || 'Cargando...' }}</span>
      </div>
    </template>
    <div class="conversation-container">
      <div class="chat-area">
        <div class="messages">
          <div v-for="message in messages" :key="message._id" :class="['message', { 'right': !isMyMessage(message) }]">
            <div :class="['message-content', { 'is-mine': isMyMessage(message) }]">
              <template v-if="typeof getMessageContent(message) === 'string'">
                {{ getMessageContent(message) }}
              </template>
              <template v-else>
                <component
                  :is="(getMessageContent(message) as any).component"
                  v-bind="(getMessageContent(message) as any).props"

                ></component>
              </template>
            </div>
          </div>
        </div>
        <div class="input-area">
          <input
            v-model="newMessage"
            @keypress.enter="handleSendMessage()"
            :disabled="isLoading"
            placeholder="Escribe un mensaje..."
          />
          <button class="send-btn" @click="handleSendMessage()" :disabled="isLoading || !newMessage.trim()">
            <PaperAirplaneIcon class="h-7 w-7 text-primary" />
          </button>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout/BaseLayout.vue'
import ImageMessage from '@/components/Messages/ImageMessage.vue'
import VideoMessage from '@/components/Messages/VideoMessage.vue'
import DocumentMessage from '@/components/Messages/DocumentMessage.vue'
import ButtonMessage from '@/components/Messages/ButtonMessage.vue' // Import the new component
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
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

const handleSendMessage = async (textToSend: string = newMessage.value) => {
  if (textToSend.trim() && !isLoading.value) {
    isLoading.value = true
    try {
      await sendMessageToAPI(clientId, textToSend)
      // For now, manually add the new message to the list
      // In a real app, this would come from a websocket or a refetch
      messages.value.push({
        _id: Date.now().toString(),
        type: 'Message',
        client: clientId,
        message: {
          _id: Date.now().toString(),
          type: 'text',
          text: textToSend,
          typeUser: 'User',
          user: clientId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      })
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

const getMessageContent = (message: Message) => {
  if (message.message.type === 'text') {
    const textContent = message.message.text || '';
    // Check for the button message pattern
    if (textContent.includes('|[')) {
      return { component: ButtonMessage, props: { messageText: textContent } };
    } else {
      return textContent;
    }
  } else if (message.message.type === 'image') {
    return { component: ImageMessage, props: { src: message.message.multimedia?.file } };
  } else if (message.message.type === 'video') {
    return { component: VideoMessage, props: { src: message.message.multimedia?.file } };
  } else if (message.message.type === 'document') {
    const fileName = message.message.multimedia?.filename || (message.message.multimedia?.file ? message.message.multimedia.file.split('/').pop() : 'Document');
    return { component: DocumentMessage, props: { href: message.message.multimedia?.file, filename: fileName } };
  }
  console.log('Unsupported message type:', JSON.stringify(message));
  return '[Mensaje no soportado]';
}

onMounted(() => {
  loadConversation()
})
</script>

