"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Clipboard, Plus, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

import { useShoppingListStore, ShoppingListItem } from "@/lib/shopping-list-store"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

const formSchema = z.object({
  name: z.string().min(1, "Nome do item é obrigatório"),
  quantity: z.coerce.number().positive("Quantidade deve ser positiva").min(1, "Quantidade mínima é 1")
})

type ShoppingListFormValues = z.infer<typeof formSchema>

export function ShoppingList() {
  const { items, addItem, removeItem, toggleItem, clearList, editItem } = useShoppingListStore()
  const [itemToEdit, setItemToEdit] = useState<ShoppingListItem | null>(null)
  
  const form = useForm<ShoppingListFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1
    }
  })
  
  const editForm = useForm<ShoppingListFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1
    }
  })
  
  function onSubmit(values: ShoppingListFormValues) {
    addItem(values)
    form.reset({
      name: "",
      quantity: 1
    })
    toast.success("Item adicionado à lista ✅")
  }
  
  function onEdit(values: ShoppingListFormValues) {
    if (itemToEdit) {
      editItem(itemToEdit.id, values)
      setItemToEdit(null)
      toast.success("Item atualizado ✏️")
    }
  }
  
  function handleOpenEditDialog(item: ShoppingListItem) {
    setItemToEdit(item)
    editForm.reset({
      name: item.name,
      quantity: item.quantity
    })
  }
  
  const completedCount = items.filter(item => item.completed).length
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          <Clipboard className="h-5 w-5 inline mr-2" />
          Lista de Compras
        </CardTitle>
        <Badge variant="secondary">
          {completedCount}/{items.length} {items.length === 1 ? "item" : "itens"} ✓
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-[1fr,auto] gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Item 📝</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Leite" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
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
            </div>
            
            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar à Lista 📝
            </Button>
          </form>
        </Form>
        
        <div className="pt-2">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Sua lista está vazia 📝
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
                    <div className="py-4 px-2 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="pl-1">
                          <Checkbox 
                            checked={item.completed}
                            onCheckedChange={() => toggleItem(item.id)}
                            id={`item-${item.id}`}
                          />
                        </div>
                        <label 
                          htmlFor={`item-${item.id}`} 
                          className={`flex flex-col cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">Quantidade: {item.quantity}</span>
                        </label>
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end border-t p-4">
        <Button
          variant="destructive"
          size="sm"
          onClick={clearList}
          disabled={items.length === 0}
        >
          Limpar Lista 🧹
        </Button>
      </CardFooter>

      <Dialog open={!!itemToEdit} onOpenChange={(open) => !open && setItemToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Item 📝</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Leite" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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