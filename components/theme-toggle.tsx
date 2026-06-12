'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-9 rounded-lg border border-border" />
  }

  const cycle = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const icons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  }

  const labels = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  }

  const current = (theme as 'light' | 'dark' | 'system') ?? 'system'

  return (
    <button
      onClick={cycle}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-secondary hover:border-primary/50"
      title={`Theme: ${labels[current]} — click to cycle`}
      aria-label="Toggle theme"
    >
      <span className="transition-transform duration-300 hover:rotate-12">
        {icons[current]}
      </span>
      <span className="hidden sm:inline text-xs">{labels[current]}</span>
    </button>
  )
}
