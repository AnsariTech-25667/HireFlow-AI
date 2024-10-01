import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebSocket } from '../context/WebSocketContext'
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const RealTimeChat = ({ jobId, applicationId, recipientType = 'recruiter' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  
  const { sendMessage, lastMessage, isConnected } = useWebSocket()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'CHAT_MESSAGE':
          if (lastMessage.data.jobId === jobId || lastMessage.data.applicationId === applicationId) {
            setMessages(prev => [...prev, lastMessage.data])
          }
          break
        case 'USER_TYPING':
          if (lastMessage.data.jobId === jobId) {
            setIsTyping(true)
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000)
          }
          break
        case 'ONLINE_USERS':
          setOnlineUsers(lastMessage.data.users || [])
          break
        default:
          break
      }
    }
  }, [lastMessage, jobId, applicationId])

  // Load chat history
  useEffect(() => {
    if (isOpen && isConnected) {
      sendMessage({
        type: 'JOIN_CHAT',
        data: {
          jobId,
          applicationId,
          recipientType
        }
      })
    }
  }, [isOpen, isConnected, jobId, applicationId, recipientType, sendMessage])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'current_user',
      senderType: recipientType === 'recruiter' ? 'candidate' : 'recruiter',
      timestamp: Date.now(),
      jobId,
      applicationId
    }

    sendMessage({
      type: 'CHAT_MESSAGE',
      data: message
    })

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    if (isConnected) {
      sendMessage({
        type: 'USER_TYPING',
        data: {
          jobId,
          applicationId,
          userId: 'current_user'
        }
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-24 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-xl flex items-center justify-center text-white z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5" />
        
        {/* Connection indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-400' : 'bg-red-400'
        } animate-pulse`}></div>
        
        {/* Unread messages indicator */}
        {messages.filter(m => m.sender !== 'current_user' && !m.read).length > 0 && (
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
            {messages.filter(m => m.sender !== 'current_user' && !m.read).length}
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-40 right-6 w-80 h-96 z-30"
          >
            <div className="glass rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5" />
                    <div>
                      <h3 className="font-semibold text-sm">Live Chat</h3>
                      <p className="text-xs opacity-90">
                        {recipientType === 'recruiter' ? 'with Recruiter' : 'with Candidate'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`}></div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-lg hover:bg-white/20"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Online Users */}
              {onlineUsers.length > 0 && (
                <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {onlineUsers.length} online
                    </p>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${message.sender === 'current_user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender !== 'current_user' && (
                        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          {message.senderType === 'recruiter' ? (
                            <BuildingOfficeIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          ) : (
                            <UserIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          )}
                        </div>
                      )}
                      <div className={`max-w-[70%] p-2 rounded-xl text-sm ${
                        message.sender === 'current_user'
                          ? 'bg-green-500 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                      }`}>
                        <p>{message.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {message.sender === 'current_user' && (
                            <div className="flex items-center gap-1">
                              {message.delivered && <CheckCircleIcon className="w-3 h-3 opacity-70" />}
                              {message.read && <EyeIcon className="w-3 h-3 opacity-70" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-2 justify-start"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <BuildingOfficeIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl rounded-bl-md">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                    disabled={!isConnected}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm disabled:opacity-50"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    className="p-2 rounded-xl bg-green-500 text-white disabled:opacity-50 hover:bg-green-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default RealTimeChat