export class NetworkError extends Error {
  userMessage: string;
  statusCode?: number;

  constructor(message: string, userMessage: string, statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
    this.userMessage = userMessage;
    this.statusCode = statusCode;
  }
}

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
        const errorMessage = `HTTP error! status: ${response.status}`;
        const userFriendlyMessage = `Error de servidor: ${response.status}. Inténtalo de nuevo más tarde.`;
        throw new NetworkError(errorMessage, userFriendlyMessage, response.status);
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof TypeError) {
        // This typically indicates a network error (e.g., no internet, CORS issue)
        throw new NetworkError(
          `Network request failed: ${error.message}`,
          'No se pudo conectar al servidor. Por favor, revisa tu conexión a internet.'
        );
      } else if (error instanceof NetworkError) {
        // Re-throw our custom error directly
        throw error;
      } else {
        // Catch any other unexpected errors
        throw new NetworkError(
          `An unexpected error occurred: ${error.message}`,
          'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.'
        );
      }
    }
  },


}

export default api
