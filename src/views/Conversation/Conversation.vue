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

import { ref, onMounted, type Ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useConversationsService } from '@/services/conversations' // Keep this for getClientById for now
import { useConversationsStore } from '@/stores/conversations'
import type { Message, Conversation, Client } from '@/services/types'

const route = useRoute()
const $router = useRouter()
const clientId = route.params.clientId as string
const { getClientById } = useConversationsService() // Only keep getClientById

const conversationsStore = useConversationsStore()
const { conversations, isLoading, error } = storeToRefs(conversationsStore)
const { fetchConversations, fetchConversationMessages, addMessageToConversation } = conversationsStore


const messages = ref<Message[]>([]);
const client = ref<Client | null>(null)
const newMessage = ref('')
// isLoading from store will be used for overall conversation loading

const handleSendMessage = async (textToSend: string = newMessage.value) => {
  if (textToSend.trim()) {
    const message = {
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
    }
    addMessageToConversation(clientId, message)
    newMessage.value = ''
  }
}

const loadConversation = async () => {
  try {
    await fetchConversations() // Fetch conversations using the store
    await fetchConversationMessages(clientId) // Fetch detailed messages for the current conversation
    const conversation = conversations.value.find((conv: any) => conv.clientId === clientId)
    if (conversation) {
      messages.value = conversation.messages
    }
    // Still fetch client data directly for now, as it's not in the conversation store
    const clientData = await getClientById(clientId)
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

watchEffect(() => {
  const conversation = conversations.value.find((conv: any) => conv.clientId === clientId);
  if (conversation) {
    messages.value = conversation.messages;
  }
});

onMounted(() => {
  loadConversation();
});
</script>
