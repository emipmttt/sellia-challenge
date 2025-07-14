<template>
  <div class="input-area">
    <input v-model="newMessage" @keypress.enter="handleSendMessage()" :disabled="isLoading"
      placeholder="Escribe un mensaje..." />
    <div v-if="attachedFiles.length > 0" class="file-previews">
      <div v-for="(file, index) in attachedFiles" :key="index" class="file-preview-item">
        <span>{{ file.name }}</span>
        <button @click="removeAttachedFile(index)" class="remove-file-btn">x</button>
      </div>
    </div>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" multiple />
    <button class="attach-btn" @click="triggerFileInput">
      <PaperClipIcon class="h-7 w-7 text-gray-500" />
    </button>
    <button class="send-btn" @click="handleSendMessage()" :disabled="isLoading || (!newMessage.trim() && attachedFiles.length === 0)">
      <PaperAirplaneIcon class="h-7 w-7 text-primary" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/vue/24/outline'
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
const fileInput = ref<HTMLInputElement | null>(null)
const attachedFiles = ref<File[]>([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeAttachedFile = (index: number) => {
  attachedFiles.value.splice(index, 1)
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    attachedFiles.value = Array.from(target.files)
    handleSendMessage()
  }
}

const handleSendMessage = async () => {
  if (newMessage.value.trim() || attachedFiles.value.length > 0) {
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

    if (attachedFiles.value.length > 0) {
      attachedFiles.value.forEach(file => {
        const fileMessage: Message = {
          _id: Date.now().toString() + '_file',
          type: 'Message',
          client: clientId,
          message: {
            _id: Date.now().toString() + '_file_content',
            type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
            multimedia: {
              file: URL.createObjectURL(file),
              filename: file.name,
              mimetype: file.type,
              size: file.size.toString(),
            },
            typeUser: 'User',
            user: 'current_user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
        }
        addMessageToConversation(clientId, fileMessage)
      })
      attachedFiles.value = [] // Clear attached files after sending
    } else {
      addMessageToConversation(clientId, message)
    }
    emit('message-sent')
    newMessage.value = ''
  }
}
</script>

<style scoped lang="scss">
.input-area {
  display: flex;
  padding: 0.625rem;
  border-top: 1px solid #eee;
  background-color: var(--color-bg);
  border-top: 1px solid var(--color-border);

  input {
    flex-grow: 1;
    border: 1px solid #ddd;
    border-radius: 1.25rem;
    padding: 0.5rem 0.9375rem;
    margin-right: 0.625rem;
    outline: none;
    background-color: var(--color-input-bg);
    color: var(--color-input-text);

    &:focus {
      border-color: var(--color-primary);
    }
  }

  .send-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
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

  .attach-btn {
    background-color: transparent;
    border: none;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-right: 0.3125rem;

    &:hover {
      background-color: var(--color-card-hover);
      border-radius: 50%;
    }

    .text-gray-500 {
      color: var(--color-text-muted); /* Use muted text color for icon */
    }
  }

  .file-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3125rem;
    margin-top: 0.3125rem;
    padding: 0 0.625rem;
  }

  .file-preview-item {
    display: flex;
    align-items: center;
    background-color: #e0e0e0;
    padding: 0.3125rem 0.625rem;
    border-radius: 0.9375rem;
    font-size: 0.8em;

    span {
      margin-right: 0.3125rem;
    }

    .remove-file-btn {
      background: none;
      border: none;
      color: #777; /* Default light mode color for remove button */
      cursor: pointer;
      font-weight: bold;
      margin-left: 0.3125rem;
    }

    /* Applying variables for file-preview-item */
    background-color: var(--color-card-hover);
    color: var(--color-text);

    .remove-file-btn {
      color: var(--color-text-muted);
    }
  }
}
</style>
