import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState("fadeIn")

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut")
    }
  }, [location, displayLocation])

  const variants = {
    fadeIn: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    fadeOut: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const slideVariants = {
    initial: { x: 300, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -300, opacity: 0 }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (transitionStage === "fadeOut") {
            setDisplayLocation(location)
            setTransitionStage("fadeIn")
          }
        }}
      >
        <motion.div
          key={displayLocation.pathname}
          variants={variants}
          animate={transitionStage}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Loading overlay during transition */}
      <AnimatePresence>
        {transitionStage === "fadeOut" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Loading...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced page wrapper with scroll restoration
export const PageWrapper = ({ children, className = "" }) => {
  const location = useLocation()

  useEffect(() => {
    // Restore scroll position to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <motion.div
      className={`min-h-screen ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation wrapper
export const StaggerWrapper = ({ children, className = "", delay = 0.1 }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
export const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition