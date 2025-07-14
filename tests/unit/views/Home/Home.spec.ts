import { shallowMount, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '@/views/Home/Home.vue'
import { createTestingPinia } from '@pinia/testing'
import { useConversationsStore } from '@/stores/conversations'
import type { Conversation, Message, Client } from '@/services/types'

// Mock vue-router's useRouter
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Home.vue', () => {
  let conversationsStore: ReturnType<typeof useConversationsStore>

  const mockClients: Client[] = [
    {
      _id: 'client1',
      name: 'Client One',
      lastMessage: 'Hello from client one',
      lastMessageDate: '2023-01-01T10:00:00Z',
      unreadCount: 2,
    },
    {
      _id: 'client2',
      name: 'Client Two',
      lastMessage: 'Hello from client two',
      lastMessageDate: '2023-01-02T11:00:00Z',
      unreadCount: 0,
    },
  ]

  const mockConversations: Conversation[] = [
    {
      clientId: 'client1',
      messages: [],
      lastMessage: {
        _id: 'last_msg_1',
        type: 'Message',
        client: 'client1',
        message: {
          _id: 'last_msg_1_content',
          type: 'text',
          text: 'Hello from client one',
          typeUser: 'Client',
          user: 'client1',
          createdAt: '2023-01-01T10:00:00Z',
          updatedAt: '2023-01-01T10:00:00Z',
        },
        createdAt: '2023-01-01T10:00:00Z',
      },
      unreadCount: 2,
      client: mockClients[0],
    },
    {
      clientId: 'client2',
      messages: [],
      lastMessage: {
        _id: 'last_msg_2',
        type: 'Message',
        client: 'client2',
        message: {
          _id: 'last_msg_2_content',
          type: 'text',
          text: 'Hello from client two',
          typeUser: 'Client',
          user: 'client2',
          createdAt: '2023-01-02T11:00:00Z',
          updatedAt: '2023-01-02T11:00:00Z',
        },
        createdAt: '2023-01-02T11:00:00Z',
      },
      unreadCount: 0,
      client: mockClients[1],
    },
  ]

  beforeEach(() => {
    mockPush.mockClear()
  })


  it('should handle error during conversation fetch', async () => {
    const wrapper = shallowMount(Home, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              conversations: {
                conversations: [],
                isLoading: false,
                error: new Error('Failed to fetch'),
              },
            },
          }),
        ],
        stubs: ['BaseLayout', 'ConversationCard'],
      },
    })

    conversationsStore = useConversationsStore()
    conversationsStore.fetchConversations.mockRejectedValueOnce(new Error('API Error'))

    await wrapper.vm.$nextTick()

    // Expect no conversation cards to be rendered on error
    const conversationCards = wrapper.findAllComponents({ name: 'ConversationCard' })
    expect(conversationCards.length).toBe(0)
    // You might also check for an error message display if your component handles it visually
  })
})
