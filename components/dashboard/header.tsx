"use client"

import { useEffect, useState } from "react"
import { User, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ea4335]">
            <span className="text-lg font-bold text-white">G</span>
          </div>
          <div className="h-6 w-px bg-border" />
        </div>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">تقارير المستقلين</h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          suppressHydrationWarning
        >
          {!mounted ? (
            <Moon className="h-5 w-5" />
          ) : theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  )
}
