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
        <div class="messages" ref="messagesContainer">
          <div v-for="message in messages" :key="message._id" :class="['message', { 'right': !isMyMessage(message) }]">
            <div :class="['message-content', { 'is-mine': isMyMessage(message) }]">
              <template v-if="typeof getMessageContent(message) === 'string'">
                {{ getMessageContent(message) }}
              </template>
              <template v-else>
                <component :is="(getMessageContent(message) as any).component"
                  v-bind="(getMessageContent(message) as any).props"></component>
              </template>
            </div>
          </div>
        </div>
        <MessageInput :isLoading="isLoading" @message-sent="handleMessageSent" />
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout/BaseLayout.vue'
import ImageMessage from '@/components/Messages/ImageMessage.vue'
import VideoMessage from '@/components/Messages/VideoMessage.vue'
import DocumentMessage from '@/components/Messages/DocumentMessage.vue'
import ButtonMessage from '@/components/Messages/ButtonMessage.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import MessageInput from '@/components/MessageInput/MessageInput.vue'
import './Conversation.scss'

import { ref, onMounted, type Ref, watchEffect, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useConversationsService } from '@/services/conversations'
import { useConversationsStore } from '@/stores/conversations'
import type { Message, Conversation, Client } from '@/services/types'

const route = useRoute()
const $router = useRouter()
const clientId = route.params.clientId as string
const { getClientById } = useConversationsService()

const conversationsStore = useConversationsStore()
const { conversations, isLoading, error } = storeToRefs(conversationsStore)
const { fetchConversations, fetchConversationMessages, addMessageToConversation } = conversationsStore


const messages = ref<Message[]>([]);
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    scrollTo({ top: messagesContainer.value.scrollHeight + 500 })
  }
};
const client = ref<Client | null>(null)

const loadConversation = async () => {
  try {
    await fetchConversations()
    await fetchConversationMessages(clientId)
    const conversation = conversations.value.find((conv: any) => conv.clientId === clientId)
    if (conversation) {
      messages.value = conversation.messages
    }
    const clientData = await getClientById(clientId)
    client.value = clientData
  } catch (error) {
    console.error('Error loading conversation:', error)
  }
}

const handleMessageSent = () => {
  setTimeout(() => {
    scrollToBottom()
  }, 100);
}

const isMyMessage = (message: Message): boolean => {
  return message.message.user === clientId
}

const getMessageContent = (message: Message) => {
  if (message.message.type === 'text') {
    const textContent = message.message.text || '';
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
  setTimeout(() => {
    scrollToBottom();
  }, 100);
});
</script>
