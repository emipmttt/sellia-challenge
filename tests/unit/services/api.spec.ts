import api from '../../../src/services/api'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('api.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should fetch data successfully', async () => {
      const mockData = { message: 'Success' }
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        }) as Promise<Response>
      )

      const result = await api.get('test-endpoint')
      expect(result).toEqual(mockData)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://sellia-files.s3.us-east-2.amazonaws.com/challenge/test-endpoint',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
    })

    it('should throw an error if response is not ok', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        }) as Promise<Response>
      )

      await expect(api.get('non-existent')).rejects.toThrow('HTTP error! status: 404')
    })

    it('should throw an error if fetch fails', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      await expect(api.get('error-endpoint')).rejects.toThrow('Network error')
    })
  })


})
