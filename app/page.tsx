"use client"

import { useState } from "react"
import { ShoppingCart, Clipboard } from "lucide-react"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { ProductForm } from "@/components/product-form"
import { CartList } from "@/components/cart-list"
import { ShoppingList } from "@/components/shopping-list"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [activeTab, setActiveTab] = useState<'cart' | 'list'>('cart')
  
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Carrinho 🛒</h1>
            </div>
            <ThemeSwitcher />
          </div>
          <p className="mt-2 text-muted-foreground max-w-lg">
            Calcule o total do seu carrinho de compras ✨
          </p>
        </header>
        
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={activeTab === 'cart' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cart')}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Carrinho
          </Button>
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className="flex items-center gap-2"
          >
            <Clipboard className="h-4 w-4" />
            Lista de Compras
          </Button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {activeTab === 'cart' ? (
            <>
              <div className="flex flex-col gap-6">
                <ProductForm />
              </div>
              <div className="flex flex-col gap-6">
                <CartList />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-6 md:col-span-2">
              <ShoppingList />
            </div>
          )}
        </div>
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Carrinho - Calculadora de Compras Simples 🛍️</p>
        </footer>
      </div>
    </main>
  )
}
