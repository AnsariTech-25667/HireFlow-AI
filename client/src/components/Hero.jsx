import { useContext, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const jobTitles = [
    'Full Stack Developer',
    'Data Scientist',
    'Product Manager',
    'DevOps Engineer',
    'UI/UX Designer',
    'Machine Learning Engineer',
  ];

  // Typing animation effect
  useEffect(() => {
    const currentTitle = jobTitles[currentIndex];
    if (typedText.length < currentTitle.length) {
      const timeout = setTimeout(() => {
        setTypedText(currentTitle.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedText('');
        setCurrentIndex(prev => (prev + 1) % jobTitles.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [typedText, currentIndex]);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute opacity-20"
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 4 + i,
        repeat: Infinity,
        delay: i * 0.5,
      }}
      style={{
        left: `${20 + i * 15}%`,
        top: `${30 + (i % 3) * 20}%`,
      }}
    >
      {i % 3 === 0 && <SparklesIcon className="w-8 h-8 text-primary-400" />}
      {i % 3 === 1 && <BoltIcon className="w-6 h-6 text-accent-400" />}
      {i % 3 === 2 && <FireIcon className="w-7 h-7 text-orange-400" />}
    </motion.div>
  ));

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-mesh opacity-30"></div>
      <div className="absolute inset-0 bg-dots opacity-20"></div>

      <div className="container 2xl:px-20 mx-auto py-20 relative z-10">
        {/* Floating Elements */}
        {floatingElements}

        <motion.div
          className="glass-card border-2 border-white/30 dark:border-white/20 mx-2 overflow-hidden relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-600/10"></div>

          {/* Content */}
          <div className="relative z-10 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <SparklesIcon className="w-8 h-8 text-primary-500 animate-pulse" />
                <span className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full text-sm font-semibold text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700">
                  10,000+ Premium Jobs Available
                </span>
                <SparklesIcon className="w-8 h-8 text-accent-500 animate-pulse" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-gradient-hero leading-tight">
                Find Your Dream
                <br />
                <span className="relative">
                  {typedText}
                  <motion.span
                    className="inline-block w-1 h-16 bg-primary-500 ml-2"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </span>
                <br />
                Career
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto px-5 leading-relaxed">
                Join thousands of professionals who've transformed their
                careers.
                <span className="text-gradient font-semibold">
                  {' '}
                  Your next opportunity
                </span>{' '}
                is just one search away.
              </p>
            </motion.div>

            {/* Advanced Search Bar */}
            <motion.div
              className="glass max-w-4xl mx-4 sm:mx-auto rounded-2xl p-2 border-2 border-white/30 dark:border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-2">
                {/* Job Title Input */}
                <div className="flex-1 relative group">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full pl-12 pr-4 py-4 bg-white/70 dark:bg-black/20 rounded-xl border-0 outline-none text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                    ref={titleRef}
                  />
                </div>

                {/* Location Input */}
                <div className="flex-1 relative group">
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    className="w-full pl-12 pr-4 py-4 bg-white/70 dark:bg-black/20 rounded-xl border-0 outline-none text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
                    ref={locationRef}
                  />
                </div>

                {/* Search Button */}
                <motion.button
                  onClick={onSearch}
                  className="btn-primary px-8 py-4 text-lg font-semibold whitespace-nowrap flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Search Jobs
                </motion.button>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center gap-2 mt-4 px-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Popular:
                </span>
                {[
                  'Remote',
                  'Full-time',
                  'React Developer',
                  'Product Manager',
                  'Data Science',
                ].map((term, index) => (
                  <motion.button
                    key={term}
                    className="text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {[
                { label: 'Active Jobs', value: '10,000+' },
                { label: 'Companies', value: '2,500+' },
                { label: 'Success Rate', value: '94%' },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Trusted Companies */}
        <motion.div
          className="glass-card mx-2 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 lg:gap-12">
            <motion.p
              className="font-semibold text-gray-700 dark:text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Trusted by industry leaders
            </motion.p>

            <div className="flex items-center gap-8 lg:gap-12 flex-wrap justify-center">
              {[
                assets.microsoft_logo,
                assets.walmart_logo,
                assets.accenture_logo,
                assets.samsung_logo,
                assets.amazon_logo,
                assets.adobe_logo,
              ].map((logo, index) => (
                <motion.img
                  key={index}
                  className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                  src={logo}
                  alt={`Company ${index + 1}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
