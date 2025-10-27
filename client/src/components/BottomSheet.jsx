import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useSwipeGestures from '../hooks/useSwipeGestures';

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.3, 0.6, 0.9],
  initialSnap = 1,
  showHandle = true,
  showCloseButton = true,
  closeOnSwipeDown = true,
  backdrop = true,
  className = '',
}) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // Calculate heights based on viewport
  const getSnapHeight = snapIndex => {
    if (typeof window === 'undefined') return 0;
    return window.innerHeight * snapPoints[snapIndex];
  };

  const currentHeight = getSnapHeight(currentSnap);

  // Handle drag end to snap to nearest point
  const handleDragEnd = (event, info) => {
    setIsDragging(false);

    const velocity = info.velocity.y;
    const currentY = info.point.y;
    const viewportHeight = window.innerHeight;

    // Calculate which snap point we're closest to
    let targetSnap = currentSnap;

    if (velocity > 500) {
      // Fast swipe down
      if (currentSnap > 0) {
        targetSnap = currentSnap - 1;
      } else if (closeOnSwipeDown) {
        onClose();
        return;
      }
    } else if (velocity < -500) {
      // Fast swipe up
      if (currentSnap < snapPoints.length - 1) {
        targetSnap = currentSnap + 1;
      }
    } else {
      // Slow drag - snap to nearest
      const currentRatio = (viewportHeight - currentY) / viewportHeight;

      let closestSnap = 0;
      let closestDistance = Math.abs(snapPoints[0] - currentRatio);

      snapPoints.forEach((point, index) => {
        const distance = Math.abs(point - currentRatio);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSnap = index;
        }
      });

      targetSnap = closestSnap;
    }

    if (targetSnap < 0 && closeOnSwipeDown) {
      onClose();
    } else {
      setCurrentSnap(Math.max(0, Math.min(snapPoints.length - 1, targetSnap)));
    }
  };

  // Swipe gesture handling
  const swipeRef = useSwipeGestures({
    onSwipeDown: swipeData => {
      if (closeOnSwipeDown && currentSnap === 0) {
        onClose();
      } else if (currentSnap > 0) {
        setCurrentSnap(currentSnap - 1);
      }
    },
    onSwipeUp: () => {
      if (currentSnap < snapPoints.length - 1) {
        setCurrentSnap(currentSnap + 1);
      }
    },
    threshold: 50,
    trackTouch: true,
  });

  // Handle escape key
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sheetVariants = {
    hidden: {
      y: '100%',
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    visible: {
      y: `${100 - snapPoints[currentSnap] * 100}%`,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          {backdrop && (
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
            />
          )}

          {/* Bottom Sheet */}
          <motion.div
            ref={containerRef}
            className={`absolute inset-x-0 bottom-0 h-full pointer-events-none ${className}`}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              ref={swipeRef}
              className="relative h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-white/20 dark:border-white/10 pointer-events-auto overflow-hidden"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              whileDrag={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                scale: 0.98,
              }}
            >
              {/* Handle */}
              {showHandle && (
                <div className="flex justify-center py-3">
                  <motion.div
                    className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full cursor-grab active:cursor-grabbing"
                    whileHover={{ scale: 1.1, backgroundColor: '#9ca3af' }}
                    whileTap={{ scale: 0.95 }}
                  />
                </div>
              )}

              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  {title && (
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="p-2 rounded-xl glass hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto overscroll-behavior-contain"
                style={{
                  height: showHandle || title ? 'calc(100% - 80px)' : '100%',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <div className="p-6">{children}</div>
              </div>

              {/* Snap Indicators */}
              {snapPoints.length > 1 && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
                  {snapPoints.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentSnap(index)}
                      className={`w-2 h-8 rounded-full transition-colors ${
                        index === currentSnap
                          ? 'bg-primary-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
