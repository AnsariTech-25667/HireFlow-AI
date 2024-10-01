import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

const ThemeToggle = ({ showLabel = false, className = '' }) => {
  const { theme, isDark, changeTheme, isTransitioning } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      icon: SunIcon,
      description: 'Light mode'
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: MoonIcon,
      description: 'Dark mode'
    },
    {
      value: 'system',
      label: 'System',
      icon: ComputerDesktopIcon,
      description: 'Follow system'
    }
  ]

  const currentTheme = themeOptions.find(option => option.value === theme)
  const CurrentIcon = currentTheme?.icon || SunIcon

  if (showLabel) {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isTransitioning}
        >
          <CurrentIcon className={`w-4 h-4 ${
            theme === 'light' ? 'text-yellow-500' :
            theme === 'dark' ? 'text-blue-400' :
            'text-gray-500'
          }`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentTheme?.label}
          </span>
          <ChevronDownIcon className="w-3 h-3 text-gray-400" />
        </motion.button>

        <AnimatePresence>
          {showDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                className="absolute top-full right-0 mt-2 w-48 glass rounded-xl border border-white/20 dark:border-white/10 overflow-hidden z-20"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {themeOptions.map((option) => {
                  const Icon = option.icon
                  const isActive = theme === option.value
                  
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => {
                        changeTheme(option.value)
                        setShowDropdown(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isActive 
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                          : 'hover:bg-white/50 dark:hover:bg-black/20 text-gray-700 dark:text-gray-300'
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      <Icon className={`w-4 h-4 ${
                        option.value === 'light' ? 'text-yellow-500' :
                        option.value === 'dark' ? 'text-blue-400' :
                        isActive ? 'text-primary-500' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs opacity-60">{option.description}</div>
                      </div>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                          layoutId="activeTheme"
                        />
                      )}
                    </motion.button>
                  )
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Simple toggle button
  return (
    <motion.button
      onClick={() => changeTheme(isDark ? 'light' : 'dark')}
      className={`p-2 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/20 transition-colors ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={isTransitioning}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}

export default ThemeToggle