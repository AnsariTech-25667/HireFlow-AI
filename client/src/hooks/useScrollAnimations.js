import { useRef, useEffect, useState } from 'react';
import { useAnimation } from 'framer-motion';

export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px 0px -50px 0px',
  } = options;

  const ref = useRef();
  const controls = useAnimation();
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          controls.start('visible');

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
          controls.start('hidden');
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [controls, threshold, triggerOnce, rootMargin]);

  return { ref, controls, isInView };
};

export const useParallax = (speed = 0.5) => {
  const ref = useRef();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const parallax = (rect.top + scrolled) * speed;
        setOffset(parallax);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
};

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(scroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
};

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
};

// Animation variants for common patterns
export const scrollAnimationVariants = {
  // Fade in from bottom
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  },

  // Fade in from left
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  },

  // Fade in from right
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  },

  // Scale in
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  },

  // Rotate in
  rotateIn: {
    hidden: { opacity: 0, rotate: -180 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  },

  // Slide up with blur
  slideUpBlur: {
    hidden: {
      opacity: 0,
      y: 60,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  },

  // Elastic bounce
  elasticBounce: {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
        duration: 0.6,
      },
    },
  },
};
