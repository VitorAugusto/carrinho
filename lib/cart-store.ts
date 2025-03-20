"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
}

// Generate UUID that works across all browsers including iOS Safari
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item: Omit<CartItem, "id">) => {
        const newItem: CartItem = {
          ...item,
          id: generateId()
        }
        
        set((state: CartStore) => ({
          items: [...state.items, newItem],
          total: calculateTotal([...state.items, newItem])
        }))
      },
      
      removeItem: (id: string) => {
        set((state: CartStore) => {
          const filteredItems = state.items.filter((item: CartItem) => item.id !== id)
          return {
            items: filteredItems,
            total: calculateTotal(filteredItems)
          }
        })
      },
      
      clearCart: () => {
        set({
          items: [],
          total: 0
        })
      },
      
      total: 0
    }),
    {
      name: "cart-storage", // unique name for localStorage key
      skipHydration: true, // needed for Next.js to avoid hydration mismatch
    }
  )
)

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
} 