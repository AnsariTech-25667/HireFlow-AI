import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Custom hook for intersection observer (lazy loading)
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
};

// Custom hook for debounced value
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for throttled callback
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  );
};

// Custom hook for local storage with performance optimization
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    value => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

// Custom hook for optimized search/filter
export const useOptimizedFilter = (items, filterFn, dependencies = []) => {
  return useMemo(() => {
    return items.filter(filterFn);
  }, [items, ...dependencies]);
};

// Custom hook for virtual scrolling
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      startIndex: Math.max(0, startIndex),
      endIndex,
      visibleItems: items.slice(startIndex, endIndex),
      offsetY: startIndex * itemHeight,
      totalHeight: items.length * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback(e => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    ...visibleItems,
    handleScroll,
  };
};

// Custom hook for image lazy loading
export const useLazyImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { ref, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (!hasIntersected) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsError(true);
    };
    img.src = src;
  }, [src, hasIntersected]);

  return { ref, imageSrc, isLoaded, isError };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    componentMounts: 0,
    reRenders: 0,
  });

  const startTime = useRef(0);
  const mountCount = useRef(0);
  const renderCount = useRef(0);

  useEffect(() => {
    mountCount.current += 1;
    startTime.current = performance.now();

    return () => {
      const endTime = performance.now();
      setMetrics(prev => ({
        renderTime: endTime - startTime.current,
        componentMounts: mountCount.current,
        reRenders: renderCount.current,
      }));
    };
  }, []);

  useEffect(() => {
    renderCount.current += 1;
  });

  return metrics;
};

export default {
  useIntersectionObserver,
  useDebounce,
  useThrottle,
  useLocalStorage,
  useOptimizedFilter,
  useVirtualScroll,
  useLazyImage,
  usePerformanceMonitor,
};
