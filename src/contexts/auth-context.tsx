"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

interface AuthContextType {
  user: any | null
  isLoading: boolean
  convexUser: any | null
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const storeUser = useMutation(api.auth.storeUser)
  const convexUser = useQuery(api.auth.getCurrentUser)

  // Sync Clerk user to Convex database
  React.useEffect(() => {
    if (isLoaded && clerkUser) {
      storeUser({
        tokenIdentifier: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || "Unknown",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        image: clerkUser.imageUrl,
        provider: "clerk",
      })
    }
  }, [isLoaded, clerkUser, storeUser])

  const value = {
    user: clerkUser,
    isLoading: !isLoaded,
    convexUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
