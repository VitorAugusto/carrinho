"use client"

import { Trash2, ShoppingBag, Pencil } from "lucide-react"
import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useCartStore, CartItem } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z.coerce.number().positive("Quantidade deve ser positiva").min(1, "Quantidade mínima é 1"),
  price: z.coerce.number().positive("Preço deve ser positivo").min(0.01, "Preço mínimo é 0,01")
})

type EditFormValues = z.infer<typeof formSchema>

export function CartList() {
  const { items, removeItem, clearCart, editItem, total } = useCartStore()
  const [itemToEdit, setItemToEdit] = useState<CartItem | null>(null)
  
  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      price: 0
    }
  })
  
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }, [])
  
  function handleOpenEditDialog(item: CartItem) {
    setItemToEdit(item)
    editForm.reset({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })
  }
  
  function onEdit(values: EditFormValues) {
    if (itemToEdit) {
      editItem(itemToEdit.id, values)
      setItemToEdit(null)
      toast.success("Produto atualizado ✏️")
    }
  }
  
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
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(item)}
                          className="text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
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
      
      <Dialog open={!!itemToEdit} onOpenChange={(open) => !open && setItemToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto 📦</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Leite" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade 🔢</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          inputMode="numeric" 
                          pattern="[0-9]*" 
                          min={1} 
                          step={1} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Unitário 💰</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0.01} 
                          step={0.01}
                          inputMode="decimal"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 