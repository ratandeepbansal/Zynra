/**
 * PocketBase client configuration
 * Handles authentication and database operations
 */

import PocketBase from 'pocketbase'

// Initialize PocketBase client
// In production, this should be your PocketBase server URL
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')

// Enable auto cancellation for client-side requests
if (typeof window !== 'undefined') {
  pb.autoCancellation(false)
}

export default pb

// Type definitions for our collections
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  created: string
  updated: string
}

export interface Chart {
  id: string
  user: string // User ID
  fullName: string
  dateOfBirth: string
  birthTime: {
    hour: number
    minute: number
    period: 'AM' | 'PM'
  }
  location: {
    city: string
    country: string
    lat: number
    lng: number
    timezone: string
  }
  birthChart: object // Full birth chart data
  numerologyProfile: object // Full numerology profile
  created: string
  updated: string
}

// Helper functions
export const auth = {
  /**
   * Login with Google OAuth
   */
  async loginWithGoogle() {
    try {
      const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })
      return authData
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  },

  /**
   * Logout current user
   */
  logout() {
    pb.authStore.clear()
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return pb.authStore.model as User | null
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return pb.authStore.isValid
  },

  /**
   * Refresh authentication
   */
  async refresh() {
    try {
      await pb.collection('users').authRefresh()
      return true
    } catch (error) {
      console.error('Auth refresh error:', error)
      return false
    }
  },
}

export const charts = {
  /**
   * Save a birth chart for the current user
   */
  async save(chartData: Omit<Chart, 'id' | 'user' | 'created' | 'updated'>) {
    const user = auth.getCurrentUser()
    if (!user) {
      throw new Error('User must be logged in to save charts')
    }

    try {
      const record = await pb.collection('charts').create({
        user: user.id,
        ...chartData,
      })
      return record as Chart
    } catch (error) {
      console.error('Error saving chart:', error)
      throw error
    }
  },

  /**
   * Get all charts for the current user
   */
  async getAll() {
    const user = auth.getCurrentUser()
    if (!user) {
      return []
    }

    try {
      const records = await pb.collection('charts').getFullList<Chart>({
        filter: `user = "${user.id}"`,
        sort: '-created',
      })
      return records
    } catch (error) {
      console.error('Error fetching charts:', error)
      return []
    }
  },

  /**
   * Get a specific chart by ID
   */
  async getById(id: string) {
    try {
      const record = await pb.collection('charts').getOne<Chart>(id)
      return record
    } catch (error) {
      console.error('Error fetching chart:', error)
      throw error
    }
  },

  /**
   * Delete a chart
   */
  async delete(id: string) {
    try {
      await pb.collection('charts').delete(id)
      return true
    } catch (error) {
      console.error('Error deleting chart:', error)
      throw error
    }
  },
}
