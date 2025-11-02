import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import type { AppStoreState, UserData } from "@/types"

type AppStore = AppStoreState & {
  setUserData: (data: UserData) => void
  setAstrologyResults: (data: unknown) => void
  setNumerologyResults: (data: unknown) => void
  setPersonalityResults: (data: unknown) => void
  clearAll: () => void
}

const initialState: AppStoreState = {
  userData: null,
  astrologyResults: null,
  numerologyResults: null,
  personalityResults: null,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUserData: (data) => set({ userData: data }),
      setAstrologyResults: (data) => set({ astrologyResults: data }),
      setNumerologyResults: (data) => set({ numerologyResults: data }),
      setPersonalityResults: (data) => set({ personalityResults: data }),
      clearAll: () => set(initialState),
    }),
    {
      name: "zynra-storage",
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userData: state.userData,
        astrologyResults: state.astrologyResults,
        numerologyResults: state.numerologyResults,
        personalityResults: state.personalityResults,
      }),
      skipHydration: true,
    }
  )
)
