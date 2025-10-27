import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, memo, useMemo, useCallback } from 'react';
import LazyImage from './LazyImage';
import { useIntersectionObserver } from '../hooks/usePerformance';
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  EyeIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const JobCard = memo(({ job, index = 0, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Intersection observer for lazy loading
  const { ref, hasIntersected } = useIntersectionObserver();

  // Memoized calculations
  const formattedSalary = useMemo(() => {
    const salary = job.salary || 0;
    if (salary >= 100000) {
      return `$${(salary / 1000).toFixed(0)}k`;
    }
    return `$${salary.toLocaleString()}`;
  }, [job.salary]);

  // Get time ago (mock data)
  const getTimeAgo = useCallback(() => {
    const days = Math.floor(Math.random() * 7) + 1;
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }, []);

  // Get urgency level based on applications
  const getUrgencyLevel = useCallback(() => {
    const applicants = Math.floor(Math.random() * 50) + 5;
    if (applicants > 30)
      return { level: 'high', text: 'High demand', color: 'text-red-500' };
    if (applicants > 15)
      return { level: 'medium', text: 'Popular', color: 'text-orange-500' };
    return { level: 'low', text: 'New posting', color: 'text-green-500' };
  }, []);

  const urgency = useMemo(() => getUrgencyLevel(), [getUrgencyLevel]);

  return (
    <motion.div
      className="job-card group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

      {/* Card Content */}
      <div className="relative z-10 h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <img
                className="w-12 h-12 rounded-xl shadow-lg object-cover ring-2 ring-white/20"
                src={job.companyId.image}
                alt={job.companyId.name}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </motion.div>

            <div>
              <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                {job.companyId.name}
              </h5>
              <div
                className={`flex items-center gap-1 text-xs ${urgency.color} font-medium`}
              >
                <SparklesIcon className="w-3 h-3" />
                {urgency.text}
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <motion.button
            onClick={e => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-5 h-5 text-primary-500" />
            ) : (
              <BookmarkIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-400" />
            )}
          </motion.button>
        </div>

        {/* Job Title */}
        <motion.h4
          className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-gradient transition-all duration-300 leading-tight"
          animate={{ x: isHovered ? 5 : 0 }}
        >
          {job.title}
        </motion.h4>

        {/* Job Details */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Location */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium border border-primary-200 dark:border-primary-700">
            <MapPinIcon className="w-3 h-3" />
            {job.location}
          </div>

          {/* Level */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-xs font-medium border border-accent-200 dark:border-accent-700">
            <BuildingOfficeIcon className="w-3 h-3" />
            {job.level}
          </div>

          {/* Salary */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium border border-green-200 dark:border-green-700">
            <CurrencyDollarIcon className="w-3 h-3" />
            {formatSalary(job.salary)}/year
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 rounded-full text-xs">
            <ClockIcon className="w-3 h-3" />
            {getTimeAgo()}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p
            className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3"
            dangerouslySetInnerHTML={{
              __html:
                job.description.replace(/<[^>]*>/g, '').slice(0, 120) + '...',
            }}
          />
        </div>

        {/* Skills/Requirements Preview */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5">
            {['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS']
              .slice(0, 3)
              .map((skill, skillIndex) => (
                <motion.span
                  key={skill}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + skillIndex * 0.1 }}
                >
                  {skill}
                </motion.span>
              ))}
            <span className="px-2 py-1 text-xs text-gray-400">+5 more</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <motion.button
            onClick={() => {
              navigate(`/apply-job/${job._id}`);
              scrollTo(0, 0);
            }}
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SparklesIcon className="w-4 h-4" />
            Quick Apply
          </motion.button>

          <motion.button
            onClick={() => {
              navigate(`/apply-job/${job._id}`);
              scrollTo(0, 0);
            }}
            className="btn-glass flex items-center justify-center gap-2 text-sm py-3 px-6 border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <EyeIcon className="w-4 h-4" />
            Details
          </motion.button>
        </div>

        {/* Progress Bar (Application Timeline) */}
        <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Applications</span>
            <span>{Math.floor(Math.random() * 45) + 5}/100</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <motion.div
              className="bg-gradient-to-r from-primary-400 to-accent-400 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.floor(Math.random() * 70) + 10}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-xl opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
