"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Package } from "lucide-react"
import { toast } from "sonner"

import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z.coerce.number().positive("Quantidade deve ser positiva").min(1, "Quantidade mínima é 1"),
  price: z.coerce.number().positive("Preço deve ser positivo").min(0.01, "Preço mínimo é 0,01")
})

type ProductFormValues = z.infer<typeof formSchema>

export function ProductForm() {
  const { addItem } = useCartStore()
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      price: 0
    }
  })
  
  function onSubmit(values: ProductFormValues) {
    addItem(values)
    form.reset({
      name: "",
      quantity: 1,
      price: 0
    })
    toast.success("Produto adicionado ao carrinho ✅")
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          <Package className="h-5 w-5 inline mr-2" />
          Adicionar produto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              
              <FormField
                control={form.control}
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
                        onClick={(e) => {
                          // On mobile, clear the field when clicked if value is 0
                          if (field.value === 0) {
                            const target = e.target as HTMLInputElement;
                            target.value = "";
                          }
                        }}
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
              Adicionar ao Carrinho 🛒
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 