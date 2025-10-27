import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BookmarkIcon,
  EyeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const JobCard = ({ job, onBookmark, isBookmarked = false, onApply }) => {
  const {
    _id,
    title,
    description,
    location,
    category,
    level,
    jobType,
    salary,
    skills = [],
    remote,
    urgent,
    date,
    featured,
    applicationsCount = 0,
    viewsCount = 0,
    companyId,
  } = job;

  const formatSalary = amount => {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  const timeAgo = timestamp => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <motion.div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 ${
        featured ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''
      }`}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-2 -right-2">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⭐ Featured
          </motion.div>
        </div>
      )}

      {/* Urgent Badge */}
      {urgent && (
        <div className="absolute top-4 left-4">
          <motion.div
            className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🔥 Urgent
          </motion.div>
        </div>
      )}

      {/* Bookmark Button */}
      <motion.button
        onClick={() => onBookmark(_id)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isBookmarked ? (
          <BookmarkSolidIcon className="w-5 h-5 text-blue-500" />
        ) : (
          <BookmarkIcon className="w-5 h-5 text-gray-400" />
        )}
      </motion.button>

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
          <BuildingOfficeIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {companyId?.name || 'Company Name'}
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm">{location}</span>
          {remote && (
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
              Remote
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>{jobType}</span>
          </div>
          <div className="flex items-center gap-1">
            <CurrencyDollarIcon className="w-4 h-4" />
            <span>₹{formatSalary(salary)}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{timeAgo(date)}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
        {description}
      </p>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-gray-500 text-xs py-1">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats and Apply Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <EyeIcon className="w-4 h-4" />
            <span>{viewsCount} views</span>
          </div>
          <div>{applicationsCount} applications</div>
        </div>

        <motion.button
          onClick={() => onApply(_id)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Apply Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default JobCard;
