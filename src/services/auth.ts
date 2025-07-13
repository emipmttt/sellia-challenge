import { ref } from 'vue'
import type { LoginCredentials, AuthResponse, User } from './types'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

const authState = ref<AuthState>({
  isAuthenticated: false,
  user: null,
  token: null,
})

const mockUser: User = {
  id: '1',
  name: 'Administrador Sellia',
  email: 'admin@sellia.com',
  avatar: 'https://ui-avatars.com/api/?name=Administrador+Sellia&background=2563eb&color=fff',
}

const mockAuthResponse: AuthResponse = {
  token: 'mock-token-123456789',
  user: mockUser,
}

export const useAuth = () => {
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (
      credentials.email === 'admin@sellia.com' &&
      credentials.password === 'admin123'
    ) {
      authState.value = {
        isAuthenticated: true,
        user: mockUser,
        token: mockAuthResponse.token,
      }
      return mockAuthResponse
    }
    throw new Error('Credenciales inválidas')
  }

  const logout = () => {
    authState.value = {
      isAuthenticated: false,
      user: null,
      token: null,
    }
  }

  const isAuthenticated = () => authState.value.isAuthenticated

  const getUser = () => authState.value.user

  return {
    login,
    logout,
    isAuthenticated,
    getUser,
  }
}

export const auth = useAuth()

export const authStateRef = authState
