"use client"

import { Trash2, ShoppingBag } from "lucide-react"
import { useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CartList() {
  const { items, removeItem, clearCart, total } = useCartStore()
  
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }, [])
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          <ShoppingBag className="h-5 w-5 inline mr-2" />
          Meu carrinho
        </CardTitle>
        <Badge variant="secondary">
          {items.length} {items.length === 1 ? "item" : "itens"} 🛒
        </Badge>
      </CardHeader>
      
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Seu carrinho está vazio 🛍️
          </div>
        ) : (
          <div className="divide-y">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">
                        {formatCurrency(item.quantity * item.price)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <div className="font-semibold text-lg">Total</div>
        <div className="flex items-center gap-4">
          <motion.div 
            key={total}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="font-bold text-lg"
          >
            {formatCurrency(total)}
          </motion.div>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Limpar Carrinho 🧹
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 