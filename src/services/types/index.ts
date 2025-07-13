export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface MessageMultimedia {
  filename?: string
  size?: string
  ext?: string
  mimetype?: string
  thumbnail?: string
  file: string
}

export interface MessageContent {
  _id: string
  type: 'text' | 'image' | 'document' | 'video'
  text?: string
  multimedia?: MessageMultimedia
  typeUser: 'Client' | 'User' | 'UserSystem'
  user: string
  errorCode?: string | null
  createdAt: string
  updatedAt: string
  readAt?: string
}

export interface Message {
  _id: string
  type: 'Message'
  client: string
  message: MessageContent
  createdAt: string
}

export interface Conversation {
  clientId: string
  messages: Message[]
  lastMessage: Message
  unreadCount: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface Client {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
  email?: string
  avatar?: string
  lastMessage?: string
  lastMessageDate?: string
  unreadCount?: number
}
