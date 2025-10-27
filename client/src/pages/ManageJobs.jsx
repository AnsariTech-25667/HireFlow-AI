import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import {
  BriefcaseIcon,
  UsersIcon,
  EyeIcon,
  EyeSlashIcon,
  ChartBarIcon,
  TrendingUpIcon,
  CalendarIcon,
  MapPinIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    avgApplicationsPerJob: 0,
  });

  const { backendUrl, companyToken } = useContext(AppContext);

  // Function to fetch company Job Applications data
  const fetchCompanyJobs = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await axios.get(backendUrl + '/api/company/list-jobs', {
        headers: { token: companyToken },
      });

      if (data.success) {
        const jobsData = data.jobsData.reverse();
        setJobs(jobsData);
        setFilteredJobs(jobsData);

        // Calculate analytics
        const totalApplications = jobsData.reduce(
          (sum, job) => sum + job.applicants,
          0
        );
        const activeJobs = jobsData.filter(job => job.visible).length;

        setAnalytics({
          totalJobs: jobsData.length,
          activeJobs,
          totalApplications,
          avgApplicationsPerJob:
            jobsData.length > 0
              ? Math.round(totalApplications / jobsData.length)
              : 0,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsRefreshing(false);
  };

  // Function to change Job Visibility
  const changeJobVisiblity = async id => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-visiblity',
        { id },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    if (!jobs) return;

    let filtered = jobs.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterVisible === 'all' ||
        (filterVisible === 'active' && job.visible) ||
        (filterVisible === 'inactive' && !job.visible);

      return matchesSearch && matchesFilter;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filterVisible]);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  // Animated Counter Component
  const AnimatedCounter = ({ value, duration = 1000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
  };

  return jobs ? (
    jobs.length === 0 ? (
      <motion.div
        className="flex flex-col items-center justify-center h-[70vh] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-2xl p-12 max-w-md">
          <motion.div
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <BriefcaseIcon className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Ready to Start Hiring?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Post your first job and discover amazing candidates waiting to join
            your team.
          </p>
          <motion.button
            onClick={() => navigate('/dashboard/add-job')}
            className="btn-primary px-8 py-3 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Post Your First Job
          </motion.button>
        </div>
      </motion.div>
    ) : (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Job Management Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor performance, manage visibility, and track applications
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={fetchCompanyJobs}
              disabled={isRefreshing}
              className="btn-glass px-4 py-2 flex items-center gap-2"
            >
              <ArrowPathIcon
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>

            <button
              onClick={() => navigate('/dashboard/add-job')}
              className="btn-primary px-6 py-2 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Job
            </button>
          </motion.div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Jobs',
              value: analytics.totalJobs,
              icon: BriefcaseIcon,
              color: 'from-blue-400 to-blue-600',
              bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            },
            {
              title: 'Active Jobs',
              value: analytics.activeJobs,
              icon: EyeIcon,
              color: 'from-green-400 to-green-600',
              bgColor: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              title: 'Total Applications',
              value: analytics.totalApplications,
              icon: UsersIcon,
              color: 'from-purple-400 to-purple-600',
              bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            },
            {
              title: 'Avg Applications',
              value: analytics.avgApplicationsPerJob,
              icon: ChartBarIcon,
              color: 'from-orange-400 to-orange-600',
              bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className={`glass rounded-2xl p-6 ${stat.bgColor} border border-white/20`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                      <AnimatedCounter value={stat.value} />
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-green-600 dark:text-green-400">
                  <TrendingUpIcon className="w-4 h-4 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search and Filter Section */}
        <motion.div
          className="glass rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/20 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'active', 'inactive'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setFilterVisible(filter)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all capitalize ${
                    filterVisible === filter
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'glass hover:bg-white/50 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {filter} (
                  {filter === 'all'
                    ? jobs.length
                    : filter === 'active'
                      ? analytics.activeJobs
                      : jobs.length - analytics.activeJobs}
                  )
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Jobs Table */}
        <motion.div
          className="glass rounded-2xl overflow-hidden border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 dark:bg-black/20 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Job Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    Posted Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Applications
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <AnimatePresence>
                  {filteredJobs.map((job, index) => (
                    <motion.tr
                      key={job._id}
                      className="hover:bg-white/20 dark:hover:bg-black/10 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                            <BriefcaseIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <MapPinIcon className="w-4 h-4" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          {moment(job.date).format('MMM DD, YYYY')}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          <UsersIcon className="w-4 h-4" />
                          <span className="font-semibold">
                            {job.applicants}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            job.visible
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {job.visible ? (
                            <EyeIcon className="w-4 h-4" />
                          ) : (
                            <EyeSlashIcon className="w-4 h-4" />
                          )}
                          {job.visible ? 'Active' : 'Hidden'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <motion.button
                          onClick={() => changeJobVisiblity(job._id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            job.visible
                              ? 'bg-primary-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                            animate={{ x: job.visible ? 24 : 4 }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No jobs found matching your criteria
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ManageJobs;
