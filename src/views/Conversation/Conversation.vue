<template>
  <BaseLayout>
    <template #header-actions>
      <div class="conv-header-actions">
        <button class="back-btn" @click="$router.back()" aria-label="Back">
          <ArrowLeftIcon class="h-6 w-6" style="width: 24px; height: 24px;" />
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
          <div v-if="isTyping" class="message">
            <div class="message-content is-mine">
              Escribiendo...
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
import './Conversation.scss';

import { ref, onMounted, type Ref, watchEffect, nextTick, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useConversationsService } from '@/services/conversations';
import { useConversationsStore } from '@/stores/conversations';
import type { Message, Conversation, Client } from '@/services/types';
import { useNotifications } from '@/composables/useNotifications';

const route = useRoute();
const $router = useRouter();
const clientId = route.params.clientId as string;
const { getClientById } = useConversationsService();
const { showError } = useNotifications();

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
const isTyping = ref(false)

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
    // Error is already handled by the store and propagated via the 'error' ref
    console.error('Error loading conversation:', error);
  }
};

watch(error, (newError) => {
  if (newError) {
    // Error notification is already handled by the conversations store
    // This watch can be used for other reactions to the error state if needed
  }
});

const handleMessageSent = () => {
  const randomMessages = [
    'Necesito ayuda con mi cuenta, por favor.',
    'Tengo un problema con mi último pedido.',
    '¿Podrían indicarme cómo restablecer mi contraseña?',
    'Quisiera saber el estado de mi envío.',
    'No puedo acceder a la aplicación.',
    '¿Cómo puedo cambiar mi dirección de facturación?',
    'Tengo una consulta sobre un producto específico.',
    'Mi pago no se procesó correctamente.',
    'Necesito soporte técnico urgente.',
    '¿Pueden ayudarme a encontrar información sobre un servicio?',
    '¿Cuál es el horario de atención al cliente?',
    'Quiero reportar un error en la aplicación móvil.',
    '¿Cómo puedo actualizar mis datos personales?',
    'Tengo dudas sobre la política de devoluciones.',
    '¿Es posible cancelar mi suscripción actual?',
    'No encuentro la opción para contactar a un agente.',
    'Mi factura no coincide con el servicio contratado.',
    '¿Puedo cambiar la fecha de entrega de mi paquete?',
    'Necesito información sobre las nuevas características.',
    '¿Hay algún tutorial disponible para usar esta función?'
  ];
  const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
  isTyping.value = true;
  setTimeout(() => {
    scrollToBottom()
  }, 100);
  setTimeout(() => {
    const simulatedMessage: Message = {
      _id: Date.now().toString() + '-simulated',
      type: 'Message',
      client: clientId,
      message: {
        _id: Date.now().toString() + '-simulated-msg',
        type: 'text',
        text: randomMessage,
        typeUser: 'Client',
        user: clientId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };
    addMessageToConversation(clientId, simulatedMessage);
    isTyping.value = false;
  }, 2000);
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
  }, 300);
});
</script>
