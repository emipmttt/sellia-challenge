import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useConversationsService } from '@/services/conversations';
import type { Conversation } from '@/services/types';

export const useConversationsStore = defineStore('conversations', () => {
  const conversations = ref<Conversation[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  const conversationsService = useConversationsService();

  async function fetchConversations() {
    if (conversations.value.length > 0) {
      console.log('Conversations already fetched.');
      return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      const initialConversations = await conversationsService.getConversations();
      // Attach client data to initial conversations
      conversations.value = await Promise.all(initialConversations.map(async (conv) => {
        const client = await conversationsService.getClientById(conv.clientId);
        return { ...conv, client };
      }));

      // Now, fetch detailed messages for each conversation to populate the lastMessage for previews
      await Promise.all(conversations.value.map(async (conv) => {
        await fetchConversationMessages(conv.clientId);
      }));
    } catch (err: any) {
      error.value = err as Error;
      console.error('Error fetching conversations:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchConversationMessages(clientId: string) {
    const conversationIndex = conversations.value.findIndex((conv: any) => conv.clientId === clientId);
    if (conversationIndex === -1) {
      console.warn(`Conversation with clientId ${clientId} not found in store.`);
      return;
    }

    const currentConversation = conversations.value[conversationIndex];
    if (currentConversation.messages && currentConversation.messages.length > 0) {
      console.log(`Messages for conversation ${clientId} already fetched.`);
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const fullConversation = await conversationsService.getConversationById(clientId);
      const lastMsg = fullConversation.messages.length > 0 ? fullConversation.messages[fullConversation.messages.length - 1] : currentConversation.lastMessage;
      conversations.value[conversationIndex] = { ...currentConversation, messages: fullConversation.messages, lastMessage: lastMsg };
    } catch (err) {
      error.value = err as Error;
      console.error(`Error fetching messages for conversation ${clientId}:`, err);
    } finally {
      isLoading.value = false;
    }
  }

  function addMessageToConversation(conversationId: string, message: any) {
    const conversation = conversations.value.find((conv: any) => conv.clientId === conversationId);
    if (conversation) {
      conversation.messages.push(message);
    }
  }

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    fetchConversationMessages,
    addMessageToConversation,
  };
});
