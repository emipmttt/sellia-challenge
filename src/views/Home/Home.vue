<template>
  <BaseLayout>
    <template #default>
      <div class="home-container">
        <div v-if="isLoading" class="loading-indicator">
          Cargando conversaciones...
        </div>
        <div v-else class="conversations-list">
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import type { Conversation, Message, Client } from '@/services/types';
import BaseLayout from '@/components/BaseLayout/BaseLayout.vue';
import ConversationCard from '@/components/ConversationCard/ConversationCard.vue';
import { useConversationsStore } from '@/stores/conversations';
import { storeToRefs } from 'pinia';
import { useNotifications } from '@/composables/useNotifications';

const router = useRouter();
const { showError } = useNotifications();

const conversationsStore = useConversationsStore()
const { conversations, isLoading, error } = storeToRefs(conversationsStore)
const { fetchConversations } = conversationsStore

const previewMessages = ref<Record<string, Message | null>>({})

const clientMap = computed<Record<string, Client>>(() => {
  const map: Record<string, Client> = {}
  conversations.value.forEach(conv => {
    if (conv.client) {
      map[conv.clientId] = conv.client
    }
  })
  return map
})

onMounted(async () => {
  try {
    await fetchConversations()

    // Populate previewMessages from the store's conversations
    conversations.value.forEach(conv => {
      if (conv.lastMessage) {
        previewMessages.value[conv.clientId] = conv.lastMessage
      }
    })

  } catch (err) {
    // Error is already handled by the store and propagated via the 'error' ref
    console.error('Error fetching conversations:', err);
  }
});

watch(error, (newError) => {
  if (newError) {
    // Error notification is already handled by the conversations store
    // This watch can be used for other reactions to the error state if needed
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
