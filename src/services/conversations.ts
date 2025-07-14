import api from './api'
import type { Conversation, Message, Client } from './types'

export const useConversationsService = () => {
  const getConversations = async (): Promise<Conversation[]> => {
    try {
      const clients = await api.get('clients.json')

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

  const getConversationById = async (clientId: string): Promise<Conversation> => {
    try {
      const messages = await api.get(`${clientId}.json`)
      const client = (await api.get('clients.json')).find((c: Client) => c._id === clientId)

      return {
        clientId,
        messages: messages.map((msg: any): Message => ({
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
        lastMessage: messages[messages.length - 1],
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




export const conversationsService = useConversationsService()
