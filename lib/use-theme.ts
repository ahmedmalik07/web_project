'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const systemTheme = prefersDark ? 'dark' : 'light'
      setTheme('system')
      applyTheme(systemTheme)
    }
    setMounted(true)
  }, [])

  const applyTheme = (themeValue: Theme) => {
    const isDark = themeValue === 'dark' || 
      (themeValue === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    const htmlElement = document.documentElement
    if (isDark) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      let newTheme: Theme
      
      if (prevTheme === 'light') {
        newTheme = 'dark'
      } else if (prevTheme === 'dark') {
        newTheme = 'system'
      } else {
        // system -> light
        newTheme = 'light'
      }
      
      localStorage.setItem('theme', newTheme)
      applyTheme(newTheme)
      return newTheme
    })
  }

  return {
    theme,
    toggleTheme,
    mounted,
  }
}
