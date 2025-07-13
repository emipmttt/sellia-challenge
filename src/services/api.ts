const API_BASE_URL = 'https://sellia-files.s3.us-east-2.amazonaws.com/challenge'

const api = {
  get: async (endpoint: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },

  put: async (endpoint: string, data: any) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      throw error
    }
  },
}

export default api
