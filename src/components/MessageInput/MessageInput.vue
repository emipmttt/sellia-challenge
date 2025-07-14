<template>
  <div class="input-area">
    <input v-model="newMessage" @keypress.enter="handleSendMessage()" :disabled="isLoading"
      placeholder="Escribe un mensaje..." />
    <button class="send-btn" @click="handleSendMessage()" :disabled="isLoading || !newMessage.trim()">
      <PaperAirplaneIcon class="h-7 w-7 text-primary" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { useConversationsStore } from '@/stores/conversations'
import { useRoute } from 'vue-router'
import type { Message } from '@/services/types'

const route = useRoute()
const clientId = route.params.clientId as string
const conversationsStore = useConversationsStore()
const { addMessageToConversation } = conversationsStore

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['message-sent'])

const newMessage = ref('')

const handleSendMessage = async () => {
  if (newMessage.value.trim()) {
    const message: Message = {
      _id: Date.now().toString(),
      type: 'Message',
      client: clientId,
      message: {
        _id: Date.now().toString(),
        type: 'text',
        text: newMessage.value,
        typeUser: 'User',
        user: 'current_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    }
    addMessageToConversation(clientId, message)
    emit('message-sent')
    newMessage.value = ''
  }
}
</script>

<style scoped lang="scss">
.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
  background-color: #fff;

  input {
    flex-grow: 1;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 8px 15px;
    margin-right: 10px;
    outline: none;

    &:focus {
      border-color: var(--primary-color);
    }
  }

  .send-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      filter: brightness(0.9);
    }
  }
}
</style>
