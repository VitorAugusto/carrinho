"use client"

import { create } from "zustand"

export interface ShoppingListItem {
  id: string
  name: string
  quantity: number
  completed: boolean
}

interface ShoppingListStore {
  items: ShoppingListItem[]
  addItem: (item: Omit<ShoppingListItem, "id" | "completed">) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  clearList: () => void
}

// Generate UUID that works across all browsers including iOS Safari
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const useShoppingListStore = create<ShoppingListStore>((set) => ({
  items: [],
  
  addItem: (item: Omit<ShoppingListItem, "id" | "completed">) => {
    const newItem: ShoppingListItem = {
      ...item,
      id: generateId(),
      completed: false
    }
    
    set((state: ShoppingListStore) => ({
      items: [...state.items, newItem]
    }))
  },
  
  removeItem: (id: string) => {
    set((state: ShoppingListStore) => ({
      items: state.items.filter((item: ShoppingListItem) => item.id !== id)
    }))
  },
  
  toggleItem: (id: string) => {
    set((state: ShoppingListStore) => ({
      items: state.items.map((item: ShoppingListItem) => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }))
  },
  
  clearList: () => {
    set({
      items: []
    })
  }
})) 