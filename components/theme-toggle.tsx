'use client'

import { useTheme } from '@/lib/use-theme'
import { Sun, Moon, Settings } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return <div className="h-10 w-10" />
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode'
      case 'dark':
        return 'Dark Mode'
      default:
        return 'System'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:bg-secondary hover:border-primary/50"
      title={`Switch to next theme (currently ${getLabel()})`}
      aria-label="Toggle theme"
    >
      <span className="transition-transform duration-300 hover:rotate-180">
        {getIcon()}
      </span>
      <span className="hidden sm:inline text-xs">{getLabel()}</span>
    </button>
  )
}
