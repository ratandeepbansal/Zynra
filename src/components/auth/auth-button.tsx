"use client"

import * as React from "react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function AuthButton() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="default" size="sm">
          Sign in
        </Button>
      </SignInButton>
    )
  }

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "h-10 w-10",
        },
      }}
    />
  )
}
