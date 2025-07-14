import { useAuth, authStateRef } from '../../../src/services/auth'
import { beforeEach, describe, expect, it } from 'vitest'

describe('auth.ts', () => {
  let authService: ReturnType<typeof useAuth>

  beforeEach(() => {
    // Reset authState before each test
    authStateRef.value = {
      isAuthenticated: false,
      user: null,
      token: null,
    }
    authService = useAuth()
  })

  it('should return initial authentication state as not authenticated', () => {
    expect(authService.isAuthenticated()).toBe(false)
    expect(authService.getUser()).toBeNull()
  })

  it('should successfully log in with correct credentials', async () => {
    const credentials = {
      email: 'admin@sellia.com',
      password: 'admin123',
    }
    const response = await authService.login(credentials)

    expect(response.token).toBe('mock-token-123456789')
    expect(response.user).toBeDefined()
    expect(response.user?.email).toBe('admin@sellia.com')
    expect(authService.isAuthenticated()).toBe(true)
    expect(authService.getUser()?.name).toBe('Administrador Sellia')
  })

  it('should throw an error with incorrect credentials', async () => {
    const credentials = {
      email: 'wrong@sellia.com',
      password: 'wrongpassword',
    }
    await expect(authService.login(credentials)).rejects.toThrow('Credenciales inválidas')
    expect(authService.isAuthenticated()).toBe(false)
    expect(authService.getUser()).toBeNull()
  })

  it('should log out successfully', async () => {
    // First, log in
    const credentials = {
      email: 'admin@sellia.com',
      password: 'admin123',
    }
    await authService.login(credentials)
    expect(authService.isAuthenticated()).toBe(true)

    // Then, log out
    authService.logout()
    expect(authService.isAuthenticated()).toBe(false)
    expect(authService.getUser()).toBeNull()
  })

  it('should return the correct user after login', async () => {
    const credentials = {
      email: 'admin@sellia.com',
      password: 'admin123',
    }
    await authService.login(credentials)
    const user = authService.getUser()

    expect(user).toEqual({
      id: '1',
      name: 'Administrador Sellia',
      email: 'admin@sellia.com',
      avatar: 'https://ui-avatars.com/api/?name=Administrador+Sellia&background=2563eb&color=fff',
    })
  })
})
