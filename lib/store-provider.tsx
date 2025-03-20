"use client"

import { useRef, useEffect } from "react"
import { useCartStore } from "./cart-store"
import { useShoppingListStore } from "./shopping-list-store"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const cartHydrated = useRef(false)
  const shoppingListHydrated = useRef(false)
  
  // Hydrate cart store on mount
  useEffect(() => {
    if (!cartHydrated.current) {
      useCartStore.persist.rehydrate()
      cartHydrated.current = true
    }
  }, [])
  
  // Hydrate shopping list store on mount
  useEffect(() => {
    if (!shoppingListHydrated.current) {
      useShoppingListStore.persist.rehydrate()
      shoppingListHydrated.current = true
    }
  }, [])
  
  return <>{children}</>
} 