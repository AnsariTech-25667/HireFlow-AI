import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CheckIcon,
  DocumentTextIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  XMarkIcon,
  PhotoIcon,
  PlayIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const AddJob = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [autoSaveStatus, setAutoSaveStatus] = useState('saved') // saved, saving, error
    
    const editorRef = useRef(null)
    const quillRef = useRef(null)
    const fileInputRef = useRef(null)
    const autoSaveTimeoutRef = useRef(null)

    const { backendUrl, companyToken } = useContext(AppContext)

    // React Hook Form setup
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isValid },
        watch,
        setValue,
        trigger,
        getValues
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            title: '',
            location: 'Bangalore',
            category: 'Programming',
            level: 'Beginner level',
            salary: '',
            minSalary: '',
            maxSalary: '',
            currency: 'USD',
            jobType: 'Full Time',
            experience: '0-1 years',
            skills: [],
            benefits: [],
            companySize: '1-10',
            workMode: 'Remote'
        }
    })

    // Watch all form values for auto-save
    const watchedValues = watch()

    // Multi-step form configuration
    const steps = [
        {
            id: 'basic',
            title: 'Basic Information',
            subtitle: 'Let\'s start with the fundamentals',
            icon: DocumentTextIcon,
            fields: ['title', 'category', 'jobType', 'workMode']
        },
        {
            id: 'details',
            title: 'Job Details',
            subtitle: 'Describe the role requirements',
            icon: BuildingOfficeIcon,
            fields: ['level', 'experience', 'skills']
        },
        {
            id: 'compensation',
            title: 'Compensation & Benefits',
            subtitle: 'Define salary and perks',
            icon: CurrencyDollarIcon,
            fields: ['minSalary', 'maxSalary', 'currency', 'benefits']
        },
        {
            id: 'location',
            title: 'Location & Company',
            subtitle: 'Where and who you are',
            icon: MapPinIcon,
            fields: ['location', 'companySize']
        },
        {
            id: 'media',
            title: 'Media & Assets',
            subtitle: 'Add visual content',
            icon: PhotoIcon,
            fields: ['files']
        }
    ]

    // Auto-save functionality
    const autoSave = useCallback(async () => {
        setAutoSaveStatus('saving')
        
        try {
            const formData = getValues()
            // Simulate API call for auto-save
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            localStorage.setItem('job-draft', JSON.stringify({
                ...formData,
                description: quillRef.current?.root.innerHTML || '',
                lastSaved: Date.now()
            }))
            
            setAutoSaveStatus('saved')
        } catch (error) {
            setAutoSaveStatus('error')
        }
    }, [getValues])

    // Trigger auto-save on form changes
    useEffect(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current)
        }
        
        autoSaveTimeoutRef.current = setTimeout(() => {
            autoSave()
        }, 2000)

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current)
            }
        }
    }, [watchedValues, autoSave])

    // Load draft on mount
    useEffect(() => {
        const draft = localStorage.getItem('job-draft')
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft)
                Object.keys(parsedDraft).forEach(key => {
                    if (key !== 'description' && key !== 'lastSaved') {
                        setValue(key, parsedDraft[key])
                    }
                })
                
                if (parsedDraft.description && quillRef.current) {
                    quillRef.current.root.innerHTML = parsedDraft.description
                }
            } catch (error) {
                console.error('Error loading draft:', error)
            }
        }
    }, [setValue])

    // Initialize Quill editor
    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Describe the job role, responsibilities, and requirements...',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['link', 'blockquote', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['clean']
                    ]
                }
            })

            quillRef.current.on('text-change', () => {
                const content = quillRef.current.root.innerHTML
                setValue('description', content)
            })
        }
    }, [setValue])

    // Drag and drop handlers
    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }, [])

    const handleFiles = (files) => {
        const fileArray = Array.from(files).map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            progress: 0
        }))
        
        setUploadedFiles(prev => [...prev, ...fileArray])
        
        // Simulate upload progress
        fileArray.forEach(fileObj => {
            simulateUpload(fileObj.id)
        })
    }

    const simulateUpload = (fileId) => {
        const interval = setInterval(() => {
            setUploadedFiles(prev => prev.map(file => {
                if (file.id === fileId) {
                    const newProgress = Math.min(file.progress + 10, 100)
                    if (newProgress === 100) {
                        clearInterval(interval)
                    }
                    return { ...file, progress: newProgress }
                }
                return file
            }))
        }, 200)
    }

    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    }

    // Step navigation
    const nextStep = async () => {
        const currentFields = steps[currentStep].fields
        const isStepValid = await trigger(currentFields)
        
        if (isStepValid && currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const goToStep = (stepIndex) => {
        setCurrentStep(stepIndex)
    }

    // Form submission
    const onSubmitHandler = async (data) => {
        setIsLoading(true)
        
        try {
            const description = quillRef.current?.root.innerHTML || ''
            
            const jobData = {
                ...data,
                description,
                salary: data.maxSalary || data.salary,
                files: uploadedFiles.map(f => f.file)
            }

            const { data: response } = await axios.post(
                backendUrl + '/api/company/post-job',
                jobData,
                { headers: { token: companyToken } }
            )

            if (response.success) {
                toast.success('Job posted successfully! 🎉')
                
                // Clear form and draft
                localStorage.removeItem('job-draft')
                setCurrentStep(0)
                setUploadedFiles([])
                if (quillRef.current) {
                    quillRef.current.root.innerHTML = ""
                }
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header with Progress */}
            <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Create New Job
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {steps[currentStep].subtitle}
                        </p>
                    </div>

                    {/* Auto-save Status */}
                    <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                            autoSaveStatus === 'saved' ? 'bg-green-400' :
                            autoSaveStatus === 'saving' ? 'bg-yellow-400 animate-pulse' :
                            'bg-red-400'
                        }`} />
                        <span className="text-gray-500 dark:text-gray-400">
                            {autoSaveStatus === 'saved' ? 'Draft saved' :
                             autoSaveStatus === 'saving' ? 'Saving...' :
                             'Save failed'}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = index === currentStep
                            const isCompleted = index < currentStep
                            
                            return (
                                <motion.button
                                    key={step.id}
                                    onClick={() => goToStep(index)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                                        isActive 
                                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                                            : isCompleted
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        isActive 
                                            ? 'bg-primary-500 text-white' 
                                            : isCompleted
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckIcon className="w-5 h-5" />
                                        ) : (
                                            <Icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-medium">{step.title}</div>
                                        <div className="text-xs opacity-60 hidden sm:block">Step {index + 1}</div>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>
                    
                    {/* Progress Line */}
                    <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-10">
                        <motion.div 
                            className="h-full bg-primary-500 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="glass rounded-2xl p-8 border border-white/20"
                    >
                        {/* Step 1: Basic Information */}
                        {currentStep === 0 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Job Title *
                                        </label>
                                        <input
                                            {...register('title', { 
                                                required: 'Job title is required',
                                                minLength: { value: 5, message: 'Title must be at least 5 characters' }
                                            })}
                                            className={`w-full px-4 py-3 rounded-xl glass border transition-all ${
                                                errors.title ? 'border-red-300 focus:border-red-500' : 'border-white/20 focus:border-primary-300'
                                            } focus:ring-2 focus:ring-primary-200`}
                                            placeholder="e.g. Senior Full Stack Developer"
                                        />
                                        {errors.title && (
                                            <motion.p 
                                                className="text-red-500 text-sm mt-1"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {errors.title.message}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <select 
                                            {...register('category')}
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                        >
                                            {JobCategories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Job Type
                                        </label>
                                        <select 
                                            {...register('jobType')}
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                        >
                                            <option value="Full Time">Full Time</option>
                                            <option value="Part Time">Part Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Work Mode
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Remote', 'On-site', 'Hybrid'].map((mode) => (
                                                <label key={mode} className="relative">
                                                    <input
                                                        {...register('workMode')}
                                                        type="radio"
                                                        value={mode}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="glass rounded-xl p-4 text-center cursor-pointer border border-white/20 peer-checked:border-primary-300 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/30 transition-all hover:bg-white/50">
                                                        <div className="font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary-700 dark:peer-checked:text-primary-300">
                                                            {mode}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Job Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Experience Level
                                        </label>
                                        <select 
                                            {...register('level')}
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                        >
                                            <option value="Beginner level">Beginner level</option>
                                            <option value="Intermediate level">Intermediate level</option>
                                            <option value="Senior level">Senior level</option>
                                            <option value="Lead level">Lead level</option>
                                            <option value="Executive level">Executive level</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Years of Experience
                                        </label>
                                        <select 
                                            {...register('experience')}
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                        >
                                            <option value="0-1 years">0-1 years</option>
                                            <option value="1-3 years">1-3 years</option>
                                            <option value="3-5 years">3-5 years</option>
                                            <option value="5-8 years">5-8 years</option>
                                            <option value="8+ years">8+ years</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Job Description *
                                    </label>
                                    <div className="glass rounded-xl border border-white/20 overflow-hidden">
                                        <div ref={editorRef} className="min-h-[200px]" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Compensation */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Min Salary
                                        </label>
                                        <input
                                            {...register('minSalary', { 
                                                required: 'Minimum salary is required',
                                                min: { value: 0, message: 'Salary must be positive' }
                                            })}
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                            placeholder="50000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Max Salary
                                        </label>
                                        <input
                                            {...register('maxSalary', { 
                                                required: 'Maximum salary is required',
                                                min: { value: 0, message: 'Salary must be positive' }
                                            })}
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                            placeholder="80000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Currency
                                        </label>
                                        <select 
                                            {...register('currency')}
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="INR">INR (₹)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Benefits & Perks
                                    </label>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        {[
                                            'Health Insurance', 'Dental Coverage', 'Vision Coverage',
                                            'Paid Time Off', 'Remote Work', 'Flexible Hours',
                                            'Professional Development', 'Stock Options', 'Bonus Program',
                                            'Retirement Plan', 'Gym Membership', 'Free Meals'
                                        ].map((benefit) => (
                                            <label key={benefit} className="flex items-center space-x-2">
                                                <input
                                                    {...register('benefits')}
                                                    type="checkbox"
                                                    value={benefit}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {benefit}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Location & Company */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Location
                                        </label>
                                        <select 
                                            {...register('location')}
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                        >
                                            {JobLocations.map((location, index) => (
                                                <option key={index} value={location}>{location}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Company Size
                                        </label>
                                        <select 
                                            {...register('companySize')}
                                            className="w-full px-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
                                        >
                                            <option value="1-10">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201-500">201-500 employees</option>
                                            <option value="501-1000">501-1000 employees</option>
                                            <option value="1000+">1000+ employees</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Media & Assets */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Upload Company Assets
                                    </label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Add images, videos, or documents that showcase your company culture
                                    </p>

                                    <div
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                            dragActive 
                                                ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*,video/*,.pdf,.doc,.docx"
                                            onChange={(e) => handleFiles(e.target.files)}
                                            className="sr-only"
                                        />
                                        
                                        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <div className="space-y-2">
                                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                                Drop files here or click to upload
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Support for images, videos, PDFs up to 10MB each
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="btn-primary px-6 py-2 mx-auto"
                                            >
                                                Choose Files
                                            </button>
                                        </div>
                                    </div>

                                    {/* Uploaded Files */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                            {uploadedFiles.map((fileObj) => (
                                                <motion.div
                                                    key={fileObj.id}
                                                    className="glass rounded-xl p-4 border border-white/20"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            {fileObj.preview ? (
                                                                <img 
                                                                    src={fileObj.preview} 
                                                                    alt="Preview" 
                                                                    className="w-10 h-10 rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                                    <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                                    {fileObj.file.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(fileObj.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Progress Bar */}
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <motion.div
                                                            className="bg-primary-500 h-2 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${fileObj.progress}%` }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 text-center">
                                                        {fileObj.progress}% uploaded
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6">
                    <motion.button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                            currentStep === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'btn-glass hover:bg-white/50'
                        }`}
                        whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
                        whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Previous
                    </motion.button>

                    <div className="flex items-center gap-4">
                        {currentStep < steps.length - 1 ? (
                            <motion.button
                                type="button"
                                onClick={nextStep}
                                className="btn-primary px-8 py-3 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Next Step
                                <ChevronRightIcon className="w-4 h-4" />
                            </motion.button>
                        ) : (
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-4 h-4" />
                                        Publish Job
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddJob