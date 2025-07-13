import api from './api'
import type { Client } from './types'

export const useClientsService = () => {
  const getClients = async (): Promise<Client[]> => {
    try {
      const response = await api.get('/clients.json')
      return response.data
    } catch (error) {
      throw error
    }
  }

  const getClientById = async (clientId: string): Promise<Client> => {
    try {
      const response = await api.get(`/clients.json`)
      return response.data.find((client: Client) => client._id === clientId)
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  return {
    getClients,
    getClientById,
  }
}

export const clientsService = useClientsService()
