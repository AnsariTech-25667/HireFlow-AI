import { useRef, useEffect, useCallback } from 'react'

export const useSwipeGestures = (options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmoveEvent = false,
    deltaX = 0.3,
    deltaY = 0.3,
    rotationAngle = 0,
    trackTouch = false,
    trackMouse = false
  } = options

  const elementRef = useRef(null)
  const startCoords = useRef({ x: 0, y: 0, time: Date.now() })
  const endCoords = useRef({ x: 0, y: 0, time: Date.now() })
  const isTracking = useRef(false)

  const calculatePosition = useCallback((e) => {
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
    return { x, y }
  }, [])

  const getDirection = useCallback((deltaX, deltaY) => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left'
    }
    return deltaY > 0 ? 'down' : 'up'
  }, [])

  const getDistance = useCallback((x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }, [])

  const getVelocity = useCallback((distance, time) => {
    return distance / time
  }, [])

  const handleStart = useCallback((e) => {
    if (!isTracking.current) {
      const { x, y } = calculatePosition(e)
      startCoords.current = { x, y, time: Date.now() }
      isTracking.current = true
    }
  }, [calculatePosition])

  const handleMove = useCallback((e) => {
    if (preventDefaultTouchmoveEvent && e.cancelable) {
      e.preventDefault()
    }
  }, [preventDefaultTouchmoveEvent])

  const handleEnd = useCallback((e) => {
    if (isTracking.current) {
      const { x, y } = calculatePosition(e)
      endCoords.current = { x, y, time: Date.now() }
      
      const deltaX = endCoords.current.x - startCoords.current.x
      const deltaY = endCoords.current.y - startCoords.current.y
      const distance = getDistance(
        startCoords.current.x,
        startCoords.current.y,
        endCoords.current.x,
        endCoords.current.y
      )
      const time = endCoords.current.time - startCoords.current.time
      const velocity = getVelocity(distance, time)
      const direction = getDirection(deltaX, deltaY)

      // Check if swipe meets threshold requirements
      if (distance >= threshold && velocity > 0.1) {
        const swipeData = {
          direction,
          deltaX,
          deltaY,
          distance,
          velocity,
          duration: time
        }

        switch (direction) {
          case 'left':
            onSwipeLeft?.(swipeData)
            break
          case 'right':
            onSwipeRight?.(swipeData)
            break
          case 'up':
            onSwipeUp?.(swipeData)
            break
          case 'down':
            onSwipeDown?.(swipeData)
            break
        }
      }

      isTracking.current = false
    }
  }, [calculatePosition, getDistance, getVelocity, getDirection, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const config = { passive: !preventDefaultTouchmoveEvent }

    if (trackTouch) {
      element.addEventListener('touchstart', handleStart, config)
      element.addEventListener('touchmove', handleMove, config)
      element.addEventListener('touchend', handleEnd, config)
    }

    if (trackMouse) {
      element.addEventListener('mousedown', handleStart)
      element.addEventListener('mousemove', handleMove)
      element.addEventListener('mouseup', handleEnd)
    }

    return () => {
      if (trackTouch) {
        element.removeEventListener('touchstart', handleStart)
        element.removeEventListener('touchmove', handleMove)
        element.removeEventListener('touchend', handleEnd)
      }

      if (trackMouse) {
        element.removeEventListener('mousedown', handleStart)
        element.removeEventListener('mousemove', handleMove)
        element.removeEventListener('mouseup', handleEnd)
      }
    }
  }, [handleStart, handleMove, handleEnd, trackTouch, trackMouse, preventDefaultTouchmoveEvent])

  return elementRef
}

export default useSwipeGestures