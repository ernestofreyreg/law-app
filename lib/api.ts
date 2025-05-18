// Base API URL from environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://law-api-3rtn.onrender.com/api"

// Helper function to get the auth token
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Helper function to handle API responses
export const handleApiResponse = async (response: Response) => {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "An error occurred")
  }

  return data
}

// Auth API calls
export const authApi = {
  signup: async (userData: { email: string; password: string; firmName: string }) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    return handleApiResponse(response)
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    return handleApiResponse(response)
  },

  getMe: async () => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },
}

// Customers API calls
export const customersApi = {
  getAll: async () => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },

  getById: async (id: string) => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/customers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },

  create: async (customerData: any) => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    })

    return handleApiResponse(response)
  },

  update: async (id: string, customerData: any) => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    })

    return handleApiResponse(response)
  },

  delete: async (id: string) => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },

  // Helper method to get matters for a customer
  getMatters: async (customerId: string) => {
    return mattersApi.getByCustomerId(customerId)
  },
}

// Matters API calls
export const mattersApi = {
  getByCustomerId: async (customerId: string) => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await fetch(`${API_URL}/customers/${customerId}/matters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleApiResponse(response)
    } catch (error) {
      console.error("Error fetching matters:", error)
      return [] // Return empty array on error to prevent UI crashes
    }
  },

  getById: async (customerId: string, matterId: string) => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/customers/${customerId}/matters/${matterId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },

  create: async (customerId: string, matterData: any) => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/customers/${customerId}/matters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(matterData),
    })

    return handleApiResponse(response)
  },

  update: async (customerId: string, matterId: string, matterData: any) => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/customers/${customerId}/matters/${matterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(matterData),
    })

    return handleApiResponse(response)
  },
}

// Stats API calls
export const statsApi = {
  getStats: async () => {
    const token = getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },
}
