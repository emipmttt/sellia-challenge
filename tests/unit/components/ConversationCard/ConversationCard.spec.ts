import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ConversationCard from '../../../../src/components/ConversationCard/ConversationCard.vue'
import type { Conversation, Message, Client } from '../../../../src/services/types'

// Mock date-fns to control time for testing formatDistanceToNow
vi.mock('date-fns', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    formatDistanceToNow: vi.fn((date) => {
      // Simple mock for testing purposes
      if (date.toISOString() === '2023-01-01T10:00:00.000Z') return '1 día'
      if (date.toISOString() === '2023-01-02T11:00:00.000Z') return '2 días'
      return 'algunos días'
    }),
  }
})

describe('ConversationCard.vue', () => {
  const mockClient: Client = {
    _id: 'client1',
    name: 'Test Client',
    updatedAt: '2023-01-01T12:00:00Z',
    createdAt: '2023-01-01T10:00:00Z',
  }

  const mockConversation: Conversation = {
    clientId: 'client1',
    messages: [],
    lastMessage: {
      _id: 'msg1',
      type: 'Message',
      client: 'client1',
      message: {
        _id: 'msg1_content',
        type: 'text',
        text: 'This is a test message',
        typeUser: 'Client',
        user: 'client1',
        createdAt: '2023-01-01T10:00:00Z',
        updatedAt: '2023-01-01T10:00:00Z',
      },
      createdAt: '2023-01-01T10:00:00Z',
    },
    unreadCount: 1,
  }

  const mockPreviewMessage: Message = {
    _id: 'preview_msg',
    type: 'Message',
    client: 'client1',
    message: {
      _id: 'preview_msg_content',
      type: 'text',
      text: 'Preview text here',
      typeUser: 'Client',
      user: 'client1',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z',
    },
    createdAt: '2023-01-01T10:00:00Z',
  }

  it('renders client name and message preview correctly', () => {
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: mockPreviewMessage,
      },
    })

    expect(wrapper.find('.client-name').text()).toBe('Test Client')
    expect(wrapper.find('.conversation-preview').text()).toBe('Preview text here')
  })

  it('displays "Cliente desconocido" if client is undefined', () => {
    const wrapper = mount(ConversationCard, {
      props: {
        client: undefined,
        conversation: mockConversation,
        isActive: false,
        previewMessage: mockPreviewMessage,
      },
    })
    expect(wrapper.find('.client-name').text()).toBe('Cliente desconocido')
  })

  it('displays "Sin mensajes" if previewMessage is null', () => {
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: null,
      },
    })
    expect(wrapper.find('.conversation-preview').text()).toBe('Sin mensajes')
  })

  it('applies active class to status-dot when isActive is true', () => {
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: true,
        previewMessage: mockPreviewMessage,
      },
    })
    expect(wrapper.find('.status-dot').classes()).toContain('active')
  })

  it('does not apply active class to status-dot when isActive is false', () => {
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: mockPreviewMessage,
      },
    })
    expect(wrapper.find('.status-dot').classes()).not.toContain('active')
  })

  it('emits click event with clientId when card is clicked', async () => {
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: mockPreviewMessage,
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
    expect(wrapper.emitted().click[0]).toEqual([mockConversation.clientId])
  })

  it('displays correct message type for image', () => {
    const imageMessage: Message = {
      ...mockPreviewMessage,
      message: { ...mockPreviewMessage.message, type: 'image', text: undefined },
    }
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: imageMessage,
      },
    })
    expect(wrapper.find('.conversation-preview').text()).toBe('Imagen')
  })

  it('displays correct message type for video', () => {
    const videoMessage: Message = {
      ...mockPreviewMessage,
      message: { ...mockPreviewMessage.message, type: 'video', text: undefined },
    }
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: videoMessage,
      },
    })
    expect(wrapper.find('.conversation-preview').text()).toBe('Video')
  })

  it('displays correct message type for document', () => {
    const documentMessage: Message = {
      ...mockPreviewMessage,
      message: { ...mockPreviewMessage.message, type: 'document', text: undefined },
    }
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: documentMessage,
      },
    })
    expect(wrapper.find('.conversation-preview').text()).toBe('Documento')
  })

  it('displays "[Mensaje no soportado]" for unsupported message type', () => {
    const unsupportedMessage: Message = {
      ...mockPreviewMessage,
      message: { ...mockPreviewMessage.message, type: 'unsupported_type' as any, text: undefined },
    }
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: unsupportedMessage,
      },
    })
    expect(wrapper.find('.conversation-preview').text()).toBe('[Mensaje no soportado]')
  })

  it('displays correct date label based on previewMessage createdAt', () => {
    const messageWithDate: Message = {
      ...mockPreviewMessage,
      createdAt: '2023-01-01T10:00:00.000Z',
    }
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: messageWithDate,
      },
    })
    expect(wrapper.find('.conversation-date').text()).toBe('último mensaje hace 1 día')
  })

  it('displays empty string for date label if no previewMessage', () => {
    const wrapper = mount(ConversationCard, {
      props: {
        client: mockClient,
        conversation: mockConversation,
        isActive: false,
        previewMessage: null,
      },
    })
    expect(wrapper.find('.conversation-date').text()).toBe('')
  })
})
