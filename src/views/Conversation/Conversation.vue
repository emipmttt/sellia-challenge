<template>
  <div class="conversation-container">
    <h1>Conversation</h1>
    <div class="chat-area">
      <div class="messages">
        <div v-for="message in messages" :key="message.id" class="message">
          <div :class="['message-content', { 'is-mine': message.isMine }]">
            {{ message.text }}
          </div>
        </div>
      </div>
      <div class="input-area">
        <input v-model="newMessage" @keypress.enter="sendMessage" placeholder="Type a message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './Conversation.scss'

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const clientId = route.params.clientId as string
const messages = ref<Array<{ id: number; text: string; isMine: boolean }>>([])
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      text: newMessage.value,
      isMine: true
    })
    newMessage.value = ''
  }
}

onMounted(() => {
  console.log('Loading conversation for client:', clientId)
})
</script>
