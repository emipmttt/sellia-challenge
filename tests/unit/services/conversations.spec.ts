import { useConversationsService, getPreviewMessage, conversationsService } from '../../../src/services/conversations'
import api from '../../../src/services/api'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Client, Conversation, Message } from '../../../src/services/types'

// Mock the api service
vi.mock('@/services/api', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    default: {
      get: vi.fn(),
    },
  };
});

const mockClients: Client[] = [
  {
    _id: 'client1',
    name: 'Client One',
    lastMessage: 'Hello from client one',
    lastMessageDate: '2023-01-01T10:00:00Z',
    unreadCount: 2,
    createdAt: '2023-01-01T09:00:00Z',
    updatedAt: '2023-01-01T09:00:00Z',
  },
  {
    _id: 'client2',
    name: 'Client Two',
    lastMessage: 'Hello from client two',
    lastMessageDate: '2023-01-02T11:00:00Z',
    unreadCount: 0,
    createdAt: '2023-01-02T10:00:00Z',
    updatedAt: '2023-01-02T10:00:00Z',
  },
]

const mockMessagesClient1: Message[] = [
  {
    _id: 'msg1',
    type: 'Message',
    client: 'client1',
    message: {
      _id: 'msg1_content',
      type: 'text',
      text: 'First message',
      typeUser: 'Client',
      user: 'client1',
      createdAt: '2023-01-01T09:50:00Z',
      updatedAt: '2023-01-01T09:50:00Z',
    },
    createdAt: '2023-01-01T09:50:00Z',
  },
  {
    _id: 'msg2',
    type: 'Message',
    client: 'client1',
    message: {
      _id: 'msg2_content',
      type: 'text',
      text: 'Second message',
      typeUser: 'User',
      user: 'user1',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z',
    },
    createdAt: '2023-01-01T10:00:00Z',
  },
]

describe('conversations.ts', () => {
  let service: ReturnType<typeof useConversationsService>

  beforeEach(async () => {
    vi.useFakeTimers()
    vi.resetModules() // Reset modules to clear internal state like caches

    // Re-import the service to get a fresh instance after module reset
    const conversationsModule = await import('../../../src/services/conversations')
    service = conversationsModule.useConversationsService()
    vi.clearAllMocks() // Clear mocks after re-importing the service
    vi.advanceTimersByTime(300001); // Advance time by more than CACHE_DURATION (5 minutes + 1ms)
  })

  // Test getClientsData (internal logic, but crucial)
  describe('getClientsData (internal)', () => {
    it('should fetch clients data from API', async () => {
      (api.get as vi.Mock).mockResolvedValueOnce({ data: mockClients })
      const clients = await service.getClients()
      expect(clients).toEqual(mockClients)
      expect(api.get).toHaveBeenCalledWith('clients.json')
    })

    it('should use cached clients data if available and not expired', async () => {
      (api.get as vi.Mock).mockResolvedValueOnce({ data: mockClients })
      // First call to populate cache
      await service.getClients()
      expect(api.get).toHaveBeenCalledTimes(1)

      // Second call should use cache
      const clients = await service.getClients()
      expect(clients).toEqual(mockClients)
      expect(api.get).toHaveBeenCalledTimes(1) // Still 1, indicating cache hit
    })

    it('should handle API errors when fetching clients', async () => {
      (api.get as vi.Mock).mockRejectedValueOnce(new Error('API Error'))
      await expect(service.getClients()).rejects.toThrow('API Error')
    })
  })

  describe('getConversations', () => {
    it('should return conversations mapped from clients data', async () => {
      (api.get as vi.Mock).mockResolvedValueOnce({ data: mockClients })

      const conversations = await service.getConversations()
      expect(conversations.length).toBe(mockClients.length)
      expect(conversations[0].clientId).toBe('client1')
      expect(conversations[0].unreadCount).toBe(2)
      expect(conversations[0].lastMessage?.message.text).toBe('Hello from client one')
      expect(conversations[1].clientId).toBe('client2')
      expect(conversations[1].unreadCount).toBe(0)
      expect(conversations[1].lastMessage?.message.text).toBe('Hello from client two')
    })

    it('should handle errors when fetching conversations', async () => {
      (api.get as vi.Mock).mockRejectedValueOnce(new Error('Conversation API Error'))
      await expect(service.getConversations()).rejects.toThrow('Conversation API Error')
    })
  })

  describe('getClientById', () => {
    beforeEach(() => {
      (api.get as vi.Mock).mockResolvedValue({ data: mockClients }) // Ensure clients are always available for these tests
    })

    it('should return a client by its ID', async () => {
      const client = await service.getClientById('client1')
      expect(client).toEqual(mockClients[0])
    })

    it('should throw an error if client is not found', async () => {
      await expect(service.getClientById('nonexistent')).rejects.toThrow('Client with ID nonexistent not found')
    })
  })

  describe('getConversationById', () => {
    beforeEach(() => {
      // Mock getClientsData to return mockClients
      (api.get as vi.Mock).mockImplementation((url: string) => {
        if (url === 'clients.json') {
          return Promise.resolve({ data: mockClients })
        } else if (url === 'client1.json') {
          return Promise.resolve(mockMessagesClient1)
        }
        return Promise.reject(new Error('Unexpected API call'))
      })
    })

    it('should return a conversation with messages and client data', async () => {
      const conversation = await service.getConversationById('client1')
      expect(conversation.clientId).toBe('client1')
      expect(conversation.messages.length).toBe(2)
      expect(conversation.messages[0].message.text).toBe('First message')
      expect(conversation.lastMessage).toEqual(mockMessagesClient1[mockMessagesClient1.length - 1])
      expect(conversation.unreadCount).toBe(mockClients[0].unreadCount)
    })

    it('should handle errors when fetching messages for a conversation', async () => {
      (api.get as vi.Mock).mockImplementation((url: string) => {
        if (url === 'clients.json') {
          return Promise.resolve({ data: mockClients })
        } else if (url === 'client1.json') {
          return Promise.reject(new Error('Messages API Error'))
        }
        return Promise.reject(new Error('Unexpected API call'))
      })
      await expect(service.getConversationById('client1')).rejects.toThrow('Messages API Error')
    })

    it('should handle errors if client is not found for conversation', async () => {
      (api.get as vi.Mock).mockResolvedValueOnce({ data: [] }) // No clients found
      await expect(service.getConversationById('nonexistent')).rejects.toThrow('Client with ID nonexistent not found')
    })
  })

  describe('getPreviewMessage', () => {
    beforeEach(() => {
      // Mock getClientsData and message fetching for getConversationById
      (api.get as vi.Mock).mockImplementation((url: string) => {
        if (url === 'clients.json') {
          return Promise.resolve({ data: mockClients })
        } else if (url === 'client1.json') {
          // Return messages with different creation times to test latest
          return Promise.resolve([
            {
              _id: 'old_msg',
              type: 'Message',
              client: 'client1',
              message: { _id: 'old_content', type: 'text', text: 'Old message', typeUser: 'Client', user: 'client1', createdAt: '2023-01-01T08:00:00Z' },
              createdAt: '2023-01-01T08:00:00Z',
            },
            {
              _id: 'latest_msg',
              type: 'Message',
              client: 'client1',
              message: { _id: 'latest_content', type: 'text', text: 'Latest message', typeUser: 'User', user: 'user1', createdAt: '2023-01-01T12:00:00Z' },
              createdAt: '2023-01-01T12:00:00Z',
            },
          ])
        }
        return Promise.reject(new Error('Unexpected API call'))
      })
    })

    it('should return the latest message for a given client', async () => {
      const latestMessage = await getPreviewMessage('client1')
      expect(latestMessage).toBeDefined()
      expect(latestMessage?.message.text).toBe('Latest message')
      expect(latestMessage?.createdAt).toBe('2023-01-01T12:00:00Z')
    })

    it('should return null if no messages are found for a client', async () => {
      (api.get as vi.Mock).mockImplementation((url: string) => {
        if (url === 'clients.json') {
          return Promise.resolve({ data: mockClients })
        } else if (url === 'client1.json') {
          return Promise.resolve([]) // No messages
        }
        return Promise.reject(new Error('Unexpected API call'))
      })
      const previewMessage = await getPreviewMessage('client1')
      expect(previewMessage).toBeNull()
    })

    it('should return null if getConversationById fails', async () => {
      (api.get as vi.Mock).mockRejectedValueOnce(new Error('Failed to get conversation'))
      const previewMessage = await getPreviewMessage('client1')
      expect(previewMessage).toBeNull()
    })
  })

  // Clean up system time mocks
  afterEach(() => {
    vi.useRealTimers()
  })
})
