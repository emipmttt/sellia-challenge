import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginForm from '../../../src/components/LoginForm.vue'

// Mock vue-router's useRouter
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock useAuth service
const mockLogin = vi.fn()
vi.mock('@/services/auth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

describe('LoginForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(LoginForm, {
      global: {
        stubs: ['Logo', 'InputField', 'Button'], // Stub child components
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(true)
  })


})
