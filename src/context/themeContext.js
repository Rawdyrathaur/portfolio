import { createContext } from 'react'

export const ThemeContext = createContext(null)

export function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}
