import { useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import ThemeToggle from './ThemeToggle'
import { 
  BriefcaseIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  BellIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Navbar = () => {
    const { openSignIn } = useClerk()
    const { user } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const { setShowRecruiterLogin } = useContext(AppContext)
    
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { path: '/', label: 'Find Jobs', icon: BriefcaseIcon },
        { path: '/applications', label: 'Applications', icon: UserIcon },
    ]

    return (
        <motion.nav 
            className={`glass-navbar transition-all duration-300 ${
                scrolled ? 'py-2 shadow-xl' : 'py-4 shadow-lg'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
                {/* Logo */}
                <motion.div
                    onClick={() => navigate('/')}
                    className='cursor-pointer flex items-center gap-2'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="relative">
                        <img 
                            className='h-8 w-auto' 
                            src={assets.logo} 
                            alt="Job Portal by Maaz Ansari" 
                        />
                        <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-lg font-bold text-gradient">JobPortal</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">by Maaz Ansari</div>
                    </div>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {user && (
                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => {
                                const Icon = link.icon
                                const isActive = location.pathname === link.path
                                
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                                                : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>

                {/* User Section or Auth Buttons */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className='flex items-center gap-4'>
                            {/* Notifications */}
                            <motion.button
                                className="relative p-2 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.button>

                            {/* Welcome Message */}
                            <div className='hidden lg:block text-right'>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>Welcome back,</p>
                                <p className='font-semibold text-gray-800 dark:text-gray-200'>
                                    {user.firstName} {user.lastName}
                                </p>
                            </div>

                            {/* User Button with Glass Effect */}
                            <div className="relative">
                                <div className="p-1 rounded-full glass">
                                    <UserButton 
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-10 h-10 rounded-full ring-2 ring-primary-200 dark:ring-primary-700"
                                            }
                                        }}
                                    />
                                </div>
                                <motion.div
                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-3'>
                            {/* Recruiter Login */}
                            <motion.button 
                                onClick={() => setShowRecruiterLogin(true)}
                                className='btn-glass hidden sm:flex items-center gap-2 px-4 py-2'
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <BriefcaseIcon className="w-4 h-4" />
                                For Recruiters
                            </motion.button>

                            {/* Job Seeker Login */}
                            <motion.button 
                                onClick={() => openSignIn()}
                                className='btn-primary flex items-center gap-2 px-6 py-2'
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SparklesIcon className="w-4 h-4" />
                                Get Started
                            </motion.button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isOpen ? (
                            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden absolute top-full left-0 right-0 glass border-t border-white/20 dark:border-white/10"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="container px-4 py-6 mx-auto">
                            {user && (
                                <div className="space-y-4 mb-6">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon
                                        const isActive = location.pathname === link.path
                                        
                                        return (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                                    isActive 
                                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                                                        : 'text-gray-600 dark:text-gray-300'
                                                }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {link.label}
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}

                            {!user && (
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            setShowRecruiterLogin(true)
                                            setIsOpen(false)
                                        }}
                                        className='w-full btn-glass flex items-center justify-center gap-2 py-3'
                                    >
                                        <BriefcaseIcon className="w-4 h-4" />
                                        Recruiter Login
                                    </button>
                                    
                                    <button 
                                        onClick={() => {
                                            openSignIn()
                                            setIsOpen(false)
                                        }}
                                        className='w-full btn-primary flex items-center justify-center gap-2 py-3'
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                        Get Started
                                    </button>
                                </div>
                            )}

                            {/* Theme Toggle Mobile */}
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
                                <ThemeToggle showLabel />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar