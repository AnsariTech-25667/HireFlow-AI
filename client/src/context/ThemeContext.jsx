import { createContext, useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system')
  const [isDark, setIsDark] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Check system preference
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system'
    setTheme(savedTheme)
    
    const applyTheme = (themeToApply) => {
      let isDarkMode = false
      
      if (themeToApply === 'system') {
        isDarkMode = getSystemTheme() === 'dark'
      } else {
        isDarkMode = themeToApply === 'dark'
      }
      
      setIsDark(isDarkMode)
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme(savedTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const changeTheme = async (newTheme) => {
    if (newTheme === theme) return
    
    setIsTransitioning(true)
    
    // Add transition effect
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    
    // Wait for transition to start
    await new Promise(resolve => setTimeout(resolve, 50))
    
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    let isDarkMode = false
    if (newTheme === 'system') {
      isDarkMode = getSystemTheme() === 'dark'
    } else {
      isDarkMode = newTheme === 'dark'
    }
    
    setIsDark(isDarkMode)
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Remove transition after animation
    setTimeout(() => {
      document.documentElement.style.transition = ''
      setIsTransitioning(false)
    }, 300)
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      changeTheme('dark')
    } else if (theme === 'dark') {
      changeTheme('system')
    } else {
      changeTheme('light')
    }
  }

  const value = {
    theme,
    isDark,
    isTransitioning,
    changeTheme,
    toggleTheme,
    getSystemTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="glass rounded-2xl p-6 flex items-center gap-3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Switching theme...
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider