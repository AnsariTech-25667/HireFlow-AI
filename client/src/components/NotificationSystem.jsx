import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BellIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Simulate real-time notifications
  useEffect(() => {
    const generateNotification = () => {
      const types = ['success', 'warning', 'info', 'message']
      const messages = {
        success: [
          'Your application has been viewed by the recruiter!',
          'New job match found based on your profile',
          'Resume analysis completed - 95% ATS score!'
        ],
        warning: [
          'Application deadline approaching in 2 days',
          'Your profile is missing key skills for this role',
          'Interview scheduled - prepare your answers'
        ],
        info: [
          'Market salary data updated for your field',
          '15 new jobs posted in your area today',
          'Career tips: How to ace technical interviews'
        ],
        message: [
          'Recruiter from TechCorp sent you a message',
          'AI Assistant: Ready to help with interview prep',
          'New connection request from hiring manager'
        ]
      }

      const type = types[Math.floor(Math.random() * types.length)]
      const message = messages[type][Math.floor(Math.random() * messages[type].length)]

      const notification = {
        id: Date.now(),
        type,
        message,
        timestamp: Date.now(),
        read: false
      }

      setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep only 10 notifications
    }

    // Generate initial notifications
    generateNotification()
    
    // Generate new notifications every 15-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to generate
        generateNotification()
      }
    }, 15000 + Math.random() * 15000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircleIcon
      case 'warning': return ExclamationTriangleIcon
      case 'info': return InformationCircleIcon
      case 'message': return ChatBubbleLeftRightIcon
      default: return BellIcon
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'from-green-500 to-emerald-500'
      case 'warning': return 'from-yellow-500 to-orange-500'
      case 'info': return 'from-blue-500 to-cyan-500'
      case 'message': return 'from-purple-500 to-violet-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full glass border border-white/20 shadow-lg backdrop-blur-xl hover:scale-105 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute top-16 right-0 w-96 max-h-96 overflow-y-auto glass rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl"
        >
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type)
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-l-4 ${
                        notification.read 
                          ? 'border-gray-200 dark:border-gray-700 opacity-70' 
                          : `border-transparent bg-gradient-to-r ${getColor(notification.type)} bg-opacity-10`
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100 font-medium'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <XMarkIcon className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10 text-center">
              <button
                onClick={() => setNotifications([])}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default NotificationSystem