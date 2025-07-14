import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest'
import Conversation from '../../../../src/views/Conversation/Conversation.vue'
import { createTestingPinia } from '@pinia/testing'
import { useConversationsStore } from '../../../../src/stores/conversations'
import { useConversationsService } from '../../../../src/services/conversations'
import type { Conversation as ConversationType, Message, Client } from '../../../../src/services/types'

// Mock vue-router's useRouter and useRoute
const mockPush = vi.fn()
const mockRouteParams = vi.fn(() => ({ clientId: 'testClient1' }))
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
  }),
  useRoute: () => ({
    params: mockRouteParams(),
  }),
}))

// Mock useConversationsService
const mockGetClientById = vi.fn()
vi.mock('@/services/conversations', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useConversationsService: () => ({
      getClientById: mockGetClientById,
    }),
  }
})

describe('Conversation.vue', () => {
  let conversationsStore: ReturnType<typeof useConversationsStore>
  let mockFetchConversations: MockInstance
  let mockFetchConversationMessages: MockInstance
  let mockAddMessageToConversation: MockInstance

  const mockClient: Client = {
    _id: 'testClient1',
    name: 'Test Client',
    updatedAt: '2023-01-01T12:00:00Z',
    createdAt: '2023-01-01T10:00:00Z',
  }

  const mockMessages: Message[] = [
    {
      _id: 'msg1',
      type: 'Message',
      client: 'testClient1',
      message: {
        _id: 'msg1_content',
        type: 'text',
        text: 'Hello from client',
        typeUser: 'Client',
        user: 'testClient1',
        createdAt: '2023-01-01T10:00:00Z',
        updatedAt: '2023-01-01T10:00:00Z',
      },
      createdAt: '2023-01-01T10:00:00Z',
    },
    {
      _id: 'msg2',
      type: 'Message',
      client: 'testClient1',
      message: {
        _id: 'msg2_content',
        type: 'text',
        text: 'Hello from user',
        typeUser: 'User',
        user: 'user1',
        createdAt: '2023-01-01T10:01:00Z',
        updatedAt: '2023-01-01T10:01:00Z',
      },
      createdAt: '2023-01-01T10:01:00Z',
    },
  ]

  const mockConversation: ConversationType = {
    clientId: 'testClient1',
    messages: mockMessages,
    lastMessage: mockMessages[1],
    unreadCount: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    mockRouteParams.mockReturnValue({ clientId: 'testClient1' })
    mockGetClientById.mockResolvedValue(mockClient)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const setup = () => {
    const wrapper = shallowMount(Conversation, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              conversations: {
                conversations: [mockConversation],
                isLoading: false,
                error: null,
              },
            },
          }),
        ],
        stubs: [
          'BaseLayout',
          'MessageInput',
          'ArrowLeftIcon',
          'ImageMessage',
          'VideoMessage',
          'DocumentMessage',
          'ButtonMessage',
        ],
      },
    })

    conversationsStore = useConversationsStore()
    mockFetchConversations = vi.fn(conversationsStore.fetchConversations) as MockInstance
    mockFetchConversationMessages = vi.fn(conversationsStore.fetchConversationMessages) as MockInstance
    mockAddMessageToConversation = vi.fn(conversationsStore.addMessageToConversation) as MockInstance

    return { wrapper, conversationsStore }
  }

  it('should render the component', () => {
    const { wrapper } = setup()
    expect(wrapper.exists()).toBe(true)
  })

})
