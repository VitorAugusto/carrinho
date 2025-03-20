import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { StoreProvider } from "@/lib/store-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Carrinho - Cart Calculator",
  description: "A simple app to calculate your shopping cart total",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          storageKey="theme"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            {children}
          </StoreProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
