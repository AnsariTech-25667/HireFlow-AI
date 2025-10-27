import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  SparklesIcon,
  UserIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content:
        "Hi! I'm your AI career assistant. I can help you find jobs, analyze your resume, prepare for interviews, and provide salary guidance. How can I help you today?",
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const features = [
    {
      id: 'job-search',
      icon: BriefcaseIcon,
      title: 'Job Search',
      description: 'Find jobs with natural language',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'resume-analysis',
      icon: DocumentTextIcon,
      title: 'Resume Analysis',
      description: 'Get feedback on your resume',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'interview-prep',
      icon: AcademicCapIcon,
      title: 'Interview Prep',
      description: 'Practice with AI questions',
      color: 'from-purple-500 to-violet-500',
    },
    {
      id: 'salary-tips',
      icon: CurrencyDollarIcon,
      title: 'Salary Tips',
      description: 'Negotiation strategies',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const aiResponses = {
    'job-search': [
      'I can help you find the perfect job! What type of role are you looking for?',
      "Let me search for jobs matching your criteria. What's your preferred industry?",
      'Based on current market trends, here are some hot job categories...',
    ],
    'resume-analysis': [
      "Upload your resume and I'll analyze it for improvements!",
      'I can check your resume for ATS optimization, keyword density, and formatting.',
      'Let me review your resume structure and suggest enhancements...',
    ],
    'interview-prep': [
      "Let's practice! What type of interview are you preparing for?",
      'I can generate behavioral, technical, or situational questions for you.',
      'Here are the top 5 questions asked in your field...',
    ],
    'salary-tips': [
      "Salary negotiation is crucial! What's your experience level?",
      'Here are proven strategies to negotiate your best salary...',
      "Based on market data, here's what you should know about compensation...",
    ],
    general: [
      "I'm here to help with your career journey! What would you like to explore?",
      'Let me assist you with job searching, resume review, interview prep, or salary advice.',
      'How can I help you advance your career today?',
    ],
  };

  const generateAIResponse = (message, feature = null) => {
    const responses = feature ? aiResponses[feature] : aiResponses.general;
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    // Simulate more intelligent responses based on keywords
    if (
      message.toLowerCase().includes('job') ||
      message.toLowerCase().includes('position')
    ) {
      return "I can help you find jobs! What type of position interests you? (e.g., 'React developer', 'Marketing manager', 'Data scientist')";
    }

    if (
      message.toLowerCase().includes('resume') ||
      message.toLowerCase().includes('cv')
    ) {
      return "Great! For resume analysis, I'd look at: ✅ ATS optimization ✅ Keyword matching ✅ Format consistency ✅ Achievement quantification. What specific area concerns you most?";
    }

    if (message.toLowerCase().includes('interview')) {
      return 'Interview prep is key to success! I can help with: 🎯 Common questions 🎯 STAR method responses 🎯 Technical challenges 🎯 Company research. What type of interview?';
    }

    if (
      message.toLowerCase().includes('salary') ||
      message.toLowerCase().includes('negotiate')
    ) {
      return "Salary negotiation tips: 💰 Research market rates 💰 Highlight unique value 💰 Consider total compensation 💰 Practice your pitch. What's your target role?";
    }

    return randomResponse;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(
      () => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: generateAIResponse(currentMessage, activeFeature),
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000
    );
  };

  const handleFeatureClick = feature => {
    setActiveFeature(feature.id);
    const featureMessage = {
      id: Date.now(),
      type: 'ai',
      content: generateAIResponse('', feature.id),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, featureMessage]);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 300 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
          className="relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 shadow-xl flex items-center justify-center text-white relative overflow-hidden">
            <motion.div
              animate={
                isExpanded
                  ? { scale: 1.2, rotate: 10 }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.2 }}
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </motion.div>

            {/* Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-20"></div>

            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              AI
            </div>
          </div>

          {/* Hover Tooltip */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
              >
                AI Career Assistant
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-40"
          >
            <div className="glass rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <SparklesIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Career Assistant</h3>
                      <p className="text-xs opacity-90">Always here to help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-3 border-b border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  {features.map(feature => {
                    const Icon = feature.icon;
                    return (
                      <motion.button
                        key={feature.id}
                        onClick={() => handleFeatureClick(feature)}
                        className={`p-2 rounded-lg text-left transition-all hover:scale-105 ${
                          activeFeature === feature.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                          >
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                              {feature.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                        <ComputerDesktopIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-primary-500 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-2 justify-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                        <ComputerDesktopIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your career..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="p-2 rounded-xl bg-primary-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Powered by AI • Try "Find React jobs" or "Review my resume"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
