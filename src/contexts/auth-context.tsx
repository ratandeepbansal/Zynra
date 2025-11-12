"use client"

import * as React from "react"
import pb, { auth, type User } from "@/lib/pocketbase"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Initialize auth state
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a valid token
        if (auth.isAuthenticated()) {
          const currentUser = auth.getCurrentUser()
          setUser(currentUser)

          // Try to refresh the auth
          await auth.refresh()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        auth.logout()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model as User | null)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async () => {
    try {
      setIsLoading(true)
      await auth.loginWithGoogle()
      const currentUser = auth.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    auth.logout()
    setUser(null)
  }

  const refreshAuth = async () => {
    try {
      await auth.refresh()
      const currentUser = auth.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Refresh error:', error)
      logout()
    }
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
