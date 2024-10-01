import { useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'
import Modal from './Modal'
import { 
  FunnelIcon, 
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline'

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)

    // State management
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])
    const [sortBy, setSortBy] = useState('newest')
    const [viewMode, setViewMode] = useState('grid') // grid, list
    const [isLoading, setIsLoading] = useState(false)
    const [displayedJobs, setDisplayedJobs] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)

    // Refs for infinite scroll
    const observerRef = useRef()
    const loadingRef = useRef()

    // Constants
    const JOBS_PER_PAGE = 12
    const ITEMS_HEIGHT = viewMode === 'grid' ? 320 : 180

    // Memoized filtered and sorted jobs
    const filteredAndSortedJobs = useMemo(() => {
        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)
        const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)
        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

        let filtered = jobs.filter(job => 
            matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )

        // Sort jobs
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
                break
            case 'oldest':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
                break
            case 'salary-high':
                filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0))
                break
            case 'salary-low':
                filtered.sort((a, b) => (a.salary || 0) - (b.salary || 0))
                break
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title))
                break
            default:
                break
        }

        return filtered
    }, [jobs, selectedCategories, selectedLocations, searchFilter, sortBy])

    // Load more jobs (infinite scroll)
    const loadMoreJobs = useCallback(() => {
        if (isLoading) return

        setIsLoading(true)
        
        // Simulate API delay
        setTimeout(() => {
            const startIndex = (page - 1) * JOBS_PER_PAGE
            const endIndex = startIndex + JOBS_PER_PAGE
            const newJobs = filteredAndSortedJobs.slice(startIndex, endIndex)
            
            if (newJobs.length === 0) {
                setHasMore(false)
            } else {
                setDisplayedJobs(prev => [...prev, ...newJobs])
                setPage(prev => prev + 1)
                setHasMore(endIndex < filteredAndSortedJobs.length)
            }
            
            setIsLoading(false)
        }, 500)
    }, [filteredAndSortedJobs, page, isLoading])

    // Intersection Observer for infinite scroll
    const lastJobElementRef = useCallback((node) => {
        if (isLoading) return
        if (observerRef.current) observerRef.current.disconnect()
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreJobs()
            }
        }, { threshold: 0.1 })
        
        if (node) observerRef.current.observe(node)
    }, [isLoading, hasMore, loadMoreJobs])

    // Reset jobs when filters change
    useEffect(() => {
        setDisplayedJobs([])
        setPage(1)
        setHasMore(true)
        
        // Load initial jobs
        const initialJobs = filteredAndSortedJobs.slice(0, JOBS_PER_PAGE)
        setDisplayedJobs(initialJobs)
        setPage(2)
        setHasMore(JOBS_PER_PAGE < filteredAndSortedJobs.length)
    }, [filteredAndSortedJobs])

    // Filter handlers
    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        )
    }

    const handleLocationChange = (location) => {
        setSelectedLocations(prev => 
            prev.includes(location) 
                ? prev.filter(l => l !== location) 
                : [...prev, location]
        )
    }

    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedLocations([])
        setSearchFilter({ title: "", location: "" })
    }

    const activeFiltersCount = selectedCategories.length + selectedLocations.length + 
        (searchFilter.title ? 1 : 0) + (searchFilter.location ? 1 : 0)

    return (
        <div className='container 2xl:px-20 mx-auto py-8 space-y-8'>
            {/* Header Section */}
            <motion.div 
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <FireIcon className="w-8 h-8 text-orange-500" />
                        Latest Opportunities
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {filteredAndSortedJobs.length} jobs found 
                        {activeFiltersCount > 0 && ` • ${activeFiltersCount} filters applied`}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 p-1 glass rounded-xl border border-white/20">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${
                                viewMode === 'grid' 
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <Squares2X2Icon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${
                                viewMode === 'list' 
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <ListBulletIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none glass px-4 py-2 pr-8 rounded-xl border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="salary-high">Salary: High to Low</option>
                            <option value="salary-low">Salary: Low to High</option>
                            <option value="title">Title A-Z</option>
                        </select>
                        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Filter Button */}
                    <motion.button
                        onClick={() => setShowFilterModal(true)}
                        className={`btn-glass px-4 py-2 flex items-center gap-2 ${
                            activeFiltersCount > 0 ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20' : ''
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FunnelIcon className="w-4 h-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </motion.button>
                </div>
            </motion.div>

            {/* Active Filters */}
            <AnimatePresence>
                {activeFiltersCount > 0 && (
                    <motion.div 
                        className="flex flex-wrap items-center gap-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Active filters:
                        </span>
                        
                        {searchFilter.title && (
                            <motion.span 
                                className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                {searchFilter.title}
                                <button onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}>
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </motion.span>
                        )}
                        
                        {searchFilter.location && (
                            <motion.span 
                                className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                {searchFilter.location}
                                <button onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}>
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </motion.span>
                        )}
                        
                        {selectedCategories.map(category => (
                            <motion.span 
                                key={category}
                                className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                {category}
                                <button onClick={() => handleCategoryChange(category)}>
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </motion.span>
                        ))}
                        
                        {selectedLocations.map(location => (
                            <motion.span 
                                key={location}
                                className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                {location}
                                <button onClick={() => handleLocationChange(location)}>
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </motion.span>
                        ))}
                        
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline"
                        >
                            Clear all
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Job Listings with Infinite Scroll */}
            <div className={`
                ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }
            `}>
                <AnimatePresence>
                    {displayedJobs.map((job, index) => (
                        <motion.div
                            key={`${job._id}-${index}`}
                            ref={index === displayedJobs.length - 1 ? lastJobElementRef : null}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index % JOBS_PER_PAGE * 0.05 }}
                            className={viewMode === 'list' ? 'w-full' : ''}
                        >
                            <JobCard job={job} viewMode={viewMode} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Loading State */}
            {isLoading && (
                <motion.div 
                    className="flex items-center justify-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="glass rounded-2xl p-8 flex items-center gap-4">
                        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                        <p className="text-gray-600 dark:text-gray-400">Loading more amazing opportunities...</p>
                    </div>
                </motion.div>
            )}

            {/* End of Results */}
            {!hasMore && displayedJobs.length > 0 && (
                <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="glass rounded-2xl p-8 inline-block">
                        <SparklesIcon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            You've seen all {filteredAndSortedJobs.length} jobs!
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            Try adjusting your filters to discover more opportunities
                        </p>
                    </div>
                </motion.div>
            )}

            {/* No Results */}
            {displayedJobs.length === 0 && !isLoading && (
                <motion.div 
                    className="text-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                        <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            No jobs found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="btn-primary px-6 py-2"
                        >
                            Clear all filters
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Advanced Filter Modal */}
            <Modal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                title="Advanced Filters"
                size="lg"
            >
                <div className="space-y-8">
                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Categories
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {JobCategories.map((category) => (
                                <label key={category} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {category}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Locations */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Locations
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {JobLocations.map((location) => (
                                <label key={location} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedLocations.includes(location)}
                                        onChange={() => handleLocationChange(location)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {location}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Apply/Clear Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={clearAllFilters}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                            Clear all filters
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="btn-glass px-6 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="btn-primary px-6 py-2"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default JobListing