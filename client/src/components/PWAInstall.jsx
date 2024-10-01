import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowDownTrayIcon, 
  XMarkIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState('unknown')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true)
      return
    }

    // Check if user has dismissed the prompt
    const dismissedTime = localStorage.getItem('pwa-install-dismissed')
    if (dismissedTime && Date.now() - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
      setDismissed(true)
      return
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (/android/.test(userAgent)) {
      setPlatform('android')
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios')
    } else if (/windows/.test(userAgent)) {
      setPlatform('windows')
    } else if (/mac/.test(userAgent)) {
      setPlatform('mac')
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      console.log('PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      deferredPrompt.prompt()

      // Wait for the user's choice
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted PWA install')
      } else {
        console.log('User dismissed PWA install')
      }

      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  const getInstallInstructions = () => {
    switch (platform) {
      case 'ios':
        return {
          title: 'Install JobPortal',
          instructions: [
            'Tap the Share button',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to install'
          ],
          icon: DevicePhoneMobileIcon
        }
      case 'android':
        return {
          title: 'Install JobPortal',
          instructions: [
            'Tap "Install" when prompted',
            'Or tap menu (⋮) and select "Install app"',
            'Tap "Install" to add to home screen'
          ],
          icon: DevicePhoneMobileIcon
        }
      default:
        return {
          title: 'Install JobPortal',
          instructions: [
            'Click the install button in your browser',
            'Or look for the install icon in the address bar',
            'Follow your browser\'s installation prompts'
          ],
          icon: ComputerDesktopIcon
        }
    }
  }

  if (isInstalled || dismissed || !showInstallPrompt) {
    return null
  }

  const { title, instructions, icon: PlatformIcon } = getInstallInstructions()

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="glass rounded-2xl p-6 border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                <PlatformIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get the full app experience
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-2 mb-6">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                {instruction}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 btn-glass py-2"
            >
              Maybe Later
            </button>
            {deferredPrompt && (
              <motion.button
                onClick={handleInstallClick}
                className="flex-1 btn-primary py-2 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Install Now
              </motion.button>
            )}
          </div>

          {/* Benefits */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              ✨ Faster loading • 📱 Works offline • 🚀 Native app feel
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PWAInstall