import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  ChartBarIcon,
  TrendingUpIcon,
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  SparklesIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const AdvancedAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    applications: [],
    jobViews: [],
    conversionRates: {},
    marketInsights: {},
    predictions: {},
    abTests: []
  })
  const [selectedMetric, setSelectedMetric] = useState('applications')
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data fetching
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAnalyticsData({
        applications: generateApplicationData(),
        jobViews: generateJobViewData(),
        conversionRates: generateConversionData(),
        marketInsights: generateMarketInsights(),
        predictions: generatePredictions(),
        abTests: generateABTestData()
      })
      
      setIsLoading(false)
    }

    fetchAnalytics()
  }, [timeRange])

  const generateApplicationData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        applications: Math.floor(Math.random() * 20) + 5,
        successful: Math.floor(Math.random() * 8) + 2,
        pending: Math.floor(Math.random() * 10) + 3
      }
    })
    return last30Days
  }

  const generateJobViewData = () => {
    const categories = ['Tech', 'Marketing', 'Sales', 'Design', 'Finance', 'Operations']
    return categories.map(category => ({
      category,
      views: Math.floor(Math.random() * 1000) + 200,
      applications: Math.floor(Math.random() * 100) + 20,
      conversionRate: (Math.random() * 15 + 5).toFixed(1)
    }))
  }

  const generateConversionData = () => ({
    profileViews: 1250,
    applications: 89,
    interviews: 23,
    offers: 7,
    conversionRate: 7.1,
    industryAverage: 4.8
  })

  const generateMarketInsights = () => ({
    avgSalary: 95000,
    salaryTrend: 8.5,
    demandScore: 78,
    competitionLevel: 'High',
    topSkills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript'],
    growthForecast: 12.3
  })

  const generatePredictions = () => ({
    nextMonthApplications: 142,
    successProbability: 68,
    optimalApplicationTiming: '10:00 AM - 2:00 PM',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
    recommendedSkills: ['Machine Learning', 'Docker', 'GraphQL']
  })

  const generateABTestData = () => [
    {
      id: 1,
      name: 'Application Button Color',
      variants: ['Blue', 'Green'],
      conversions: [15.2, 18.7],
      confidence: 94,
      status: 'completed',
      winner: 'Green'
    },
    {
      id: 2,
      name: 'Job Title Display',
      variants: ['Standard', 'Enhanced'],
      conversions: [12.1, 13.9],
      confidence: 76,
      status: 'running',
      winner: null
    }
  ]

  const applicationChartData = {
    labels: analyticsData.applications.map(d => 
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Applications',
        data: analyticsData.applications.map(d => d.applications),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Successful',
        data: analyticsData.applications.map(d => d.successful),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const jobViewChartData = {
    labels: analyticsData.jobViews.map(d => d.category),
    datasets: [
      {
        label: 'Job Views',
        data: analyticsData.jobViews.map(d => d.views),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(20, 184, 166, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const conversionFunnelData = {
    labels: ['Profile Views', 'Applications', 'Interviews', 'Offers'],
    datasets: [
      {
        data: [
          analyticsData.conversionRates.profileViews,
          analyticsData.conversionRates.applications,
          analyticsData.conversionRates.interviews,
          analyticsData.conversionRates.offers
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6" />
            Advanced Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered insights and predictive analytics
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.conversionRates.applications}
              </p>
              <p className="text-sm text-green-600">+23% vs last month</p>
            </div>
            <BriefcaseIcon className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.conversionRates.conversionRate}%
              </p>
              <p className="text-sm text-green-600">+2.3% vs industry avg</p>
            </div>
            <TrendingUpIcon className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Salary</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${analyticsData.marketInsights.avgSalary?.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">+{analyticsData.marketInsights.salaryTrend}% YoY</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.conversionRates.profileViews?.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">+15% this week</p>
            </div>
            <EyeIcon className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Application Trends
          </h3>
          <div className="h-64">
            <Line data={applicationChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Job Categories Performance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Job Category Performance
          </h3>
          <div className="h-64">
            <Bar data={jobViewChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Conversion Funnel & Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Conversion Funnel
          </h3>
          <div className="h-64">
            <Doughnut data={conversionFunnelData} options={pieOptions} />
          </div>
        </motion.div>

        {/* AI Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5" />
            AI Predictions
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Next Month Applications</p>
              <p className="text-xl font-bold text-blue-600">
                {analyticsData.predictions.nextMonthApplications}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Probability</p>
              <p className="text-xl font-bold text-green-600">
                {analyticsData.predictions.successProbability}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Application Time</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {analyticsData.predictions.optimalApplicationTiming}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recommended Skills</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {analyticsData.predictions.recommendedSkills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Market Insights
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Demand Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.marketInsights.demandScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {analyticsData.marketInsights.demandScore}/100
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Growth Forecast</p>
              <p className="text-xl font-bold text-green-600">
                +{analyticsData.marketInsights.growthForecast}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Top Skills in Demand</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {analyticsData.marketInsights.topSkills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* A/B Testing Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          A/B Testing Results
        </h3>
        <div className="grid gap-4">
          {analyticsData.abTests.map((test) => (
            <div key={test.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {test.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    test.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {test.status}
                  </span>
                  {test.winner && (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {test.variants.map((variant, index) => (
                  <div key={variant} className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{variant}</p>
                    <p className={`text-lg font-bold ${
                      test.winner === variant ? 'text-green-600' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {test.conversions[index]}%
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Confidence: {test.confidence}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AdvancedAnalytics
