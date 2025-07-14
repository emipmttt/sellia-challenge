import api from './api'
import type { Conversation, Message, Client } from './types'

// Cache for clients data to avoid redundant API calls
let clientsCache: Client[] | null = null
let clientsCacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const getClientsData = async (): Promise<Client[]> => {
  const now = Date.now()
  if (clientsCache && (now - clientsCacheTime) < CACHE_DURATION) {
    return clientsCache
  }
  
  try {
    const response = await api.get('clients.json')
    const clients = response.data || response
    clientsCache = Array.isArray(clients) ? clients : []
    clientsCacheTime = now
    return clientsCache
  } catch (error) {
    console.error('Error fetching clients:', error)
    throw error
  }
}

export const useConversationsService = () => {
  const getConversations = async (): Promise<Conversation[]> => {
    try {
      const clients = await getClientsData()

      return clients.map((client: Client): Conversation => ({
        clientId: client._id,
        messages: [],
        lastMessage: {
          _id: 'last',
          type: 'Message',
          client: client._id,
          message: {
            _id: 'last',
            type: 'text',
            text: client.lastMessage || '',
            typeUser: 'Client',
            user: client._id,
            createdAt: client.lastMessageDate || new Date().toISOString(),
            updatedAt: client.lastMessageDate || new Date().toISOString(),
          },
          createdAt: client.lastMessageDate || new Date().toISOString(),
        },
        unreadCount: client.unreadCount || 0,
      }))
    } catch (error) {
      console.error('Error fetching conversations:', error)
      throw error
    }
  }

  const getClients = async (): Promise<Client[]> => {
    return getClientsData()
  }

  const getClientById = async (clientId: string): Promise<Client> => {
    try {
      const clients = await getClientsData()
      const client = clients.find((client: Client) => client._id === clientId)
      if (!client) {
        throw new Error(`Client with ID ${clientId} not found`)
      }
      return client
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  const getConversationById = async (clientId: string): Promise<Conversation> => {
    console.log(`Attempting to fetch full conversation for clientId: ${clientId}`); // Debug log
    try {
      const [messages, client] = await Promise.all([
        api.get(`${clientId}.json`),
        getClientById(clientId)
      ])

      const messageList = Array.isArray(messages) ? messages : (messages.data || [])

      return {
        clientId,
        messages: messageList.map((msg: any): Message => ({
          _id: msg._id,
          type: msg.type,
          client: clientId,
          message: {
            _id: msg.message._id,
            type: msg.message.type,
            text: msg.message.text,
            multimedia: msg.message.multimedia,
            typeUser: msg.message.typeUser,
            user: msg.message.user,
            errorCode: msg.message.errorCode,
            createdAt: msg.message.createdAt,
            updatedAt: msg.message.updatedAt,
            readAt: msg.message.readAt,
          },
          createdAt: msg.createdAt,
        })),
        lastMessage: messageList[messageList.length - 1],
        unreadCount: client?.unreadCount || 0,
      }
    } catch (error) {
      throw error
    }
  }

  const sendMessage = async (
    clientId: string,
    message: string
  ): Promise<Message> => {
    try {
      const newMessage: Message = {
        _id: Date.now().toString(),
        type: 'Message',
        client: clientId,
        message: {
          _id: Date.now().toString(),
          type: 'text',
          text: message,
          typeUser: 'User',
          user: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      }

      await api.put(`/${clientId}.json`, {
        unreadCount: 0,
      })

      return newMessage
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  return {
    getConversations,
    getConversationById,
    sendMessage,
    getClients,
    getClientById,
  }
}

export const getPreviewMessage = async (clientId: string): Promise<Message | null> => {
  try {
    const conversation = await conversationsService.getConversationById(clientId)
    const messages = conversation.messages
    if (!messages || messages.length === 0) return null
    // Find the latest message by createdAt
    const latest = [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    return latest
  } catch (error) {
    return null
  }
}

// Export individual functions for backward compatibility
export const useClientsService = () => {
  const service = useConversationsService()
  return {
    getClients: service.getClients,
    getClientById: service.getClientById,
  }
}




export const conversationsService = useConversationsService()
