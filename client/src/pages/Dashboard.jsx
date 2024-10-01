import { useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { 
  PlusIcon, 
  BriefcaseIcon, 
  UsersIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  DocumentTextIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
    const navigate = useNavigate()
    const { companyData, setCompanyData, setCompanyToken } = useContext(AppContext)
    
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    // Function to logout for company
    const logout = () => {
        setCompanyToken(null)
        localStorage.removeItem('companyToken')
        setCompanyData(null)
        navigate('/')
    }

    useEffect(() => {
        if (companyData) {
            navigate('/dashboard/manage-jobs')
        }
    }, [companyData])

    const navigationItems = [
        {
            path: '/dashboard/add-job',
            label: 'Add Job',
            icon: PlusIcon,
            description: 'Post new positions'
        },
        {
            path: '/dashboard/analytics',
            label: 'Analytics',
            icon: ChartBarIcon,
            description: 'Performance insights'
        },
        {
            path: '/dashboard/manage-jobs',
            label: 'Manage Jobs',
            icon: BriefcaseIcon,
            description: 'View and edit jobs'
        },
        {
            path: '/dashboard/view-applications',
            label: 'Applications',
            icon: UsersIcon,
            description: 'Review candidates'
        }
    ]

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900'>

            {/* Modern Navbar for Recruiter Panel */}
            <motion.nav 
                className='glass-navbar border-b border-white/20 dark:border-white/10'
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className='px-6 py-4 flex justify-between items-center'>
                    {/* Logo and Brand */}
                    <motion.div
                        onClick={() => navigate('/')}
                        className='flex items-center gap-3 cursor-pointer'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative">
                            <img className='h-8 w-auto' src={assets.logo} alt="Recruiter Dashboard" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-lg font-bold text-gradient">Recruiter Portal</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">by Maaz Ansari</div>
                        </div>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search jobs, candidates..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                            />
                        </div>
                    </div>

                    {/* User Section */}
                    {companyData && (
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

                            {/* Company Profile */}
                            <div className='relative'>
                                <motion.button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className='flex items-center gap-3 p-2 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/20 transition-colors'
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <img 
                                        className='w-8 h-8 rounded-full ring-2 ring-primary-200 dark:ring-primary-700' 
                                        src={companyData.image} 
                                        alt={companyData.name} 
                                    />
                                    <div className='hidden lg:block text-left'>
                                        <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                                            {companyData.name}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            Recruiter Dashboard
                                        </p>
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                </motion.button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/20 dark:border-white/10 overflow-hidden z-50"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="p-4 border-b border-white/10">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                    {companyData.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Company Account
                                                </p>
                                            </div>
                                            <div className="p-2">
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </motion.nav>

            <div className='flex'>
                {/* Modern Sidebar */}
                <motion.aside 
                    className={`glass border-r border-white/20 dark:border-white/10 min-h-screen transition-all duration-300 ${
                        sidebarCollapsed ? 'w-20' : 'w-64'
                    }`}
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Sidebar Toggle */}
                    <div className="p-4 border-b border-white/10">
                        <motion.button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Squares2X2Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </motion.button>
                    </div>

                    {/* Navigation */}
                    <nav className='p-4'>
                        <div className="space-y-2">
                            {navigationItems.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            group flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                                            ${isActive 
                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700' 
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-black/20 hover:text-primary-600 dark:hover:text-primary-400'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {!sidebarCollapsed && (
                                            <div className="flex-1">
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-xs opacity-60">{item.description}</div>
                                            </div>
                                        )}
                                        {!sidebarCollapsed && (
                                            <SparklesIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </NavLink>
                                )
                            })}
                        </div>

                        {/* Quick Stats */}
                        {!sidebarCollapsed && (
                            <motion.div 
                                className="mt-8 p-4 glass rounded-xl border border-white/20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Quick Overview
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">5 Active Jobs</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">23 Applications</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">8 Interviews</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </nav>
                </motion.aside>

                {/* Main Content */}
                <motion.main 
                    className='flex-1 p-6 pt-24 overflow-hidden'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Outlet />
                </motion.main>
            </div>
        </div>
    )
}

export default Dashboard