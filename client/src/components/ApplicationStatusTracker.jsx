import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWebSocket } from '../context/WebSocketContext';
import {
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const ApplicationStatusTracker = ({ applicationId }) => {
  const [status, setStatus] = useState('submitted');
  const [statusHistory, setStatusHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { sendMessage, lastMessage, isConnected } = useWebSocket();

  const statusConfig = {
    submitted: {
      label: 'Application Submitted',
      color: 'from-blue-500 to-cyan-500',
      icon: DocumentTextIcon,
      description: 'Your application has been received',
    },
    reviewing: {
      label: 'Under Review',
      color: 'from-yellow-500 to-orange-500',
      icon: EyeIcon,
      description: 'Recruiter is reviewing your application',
    },
    interview: {
      label: 'Interview Scheduled',
      color: 'from-purple-500 to-violet-500',
      icon: CalendarIcon,
      description: 'Interview has been scheduled',
    },
    accepted: {
      label: 'Application Accepted',
      color: 'from-green-500 to-emerald-500',
      icon: CheckCircleIcon,
      description: 'Congratulations! Your application was accepted',
    },
    rejected: {
      label: 'Application Declined',
      color: 'from-red-500 to-pink-500',
      icon: XCircleIcon,
      description: 'Unfortunately, your application was not selected',
    },
  };

  const statusFlow = ['submitted', 'reviewing', 'interview', 'accepted'];

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'APPLICATION_STATUS_UPDATE') {
      if (lastMessage.data.applicationId === applicationId) {
        const newStatus = lastMessage.data.status;
        setStatus(newStatus);
        setLastUpdate(Date.now());

        setStatusHistory(prev => [
          ...prev,
          {
            status: newStatus,
            timestamp: Date.now(),
            message:
              lastMessage.data.message || statusConfig[newStatus]?.description,
          },
        ]);
      }
    }
  }, [lastMessage, applicationId]);

  useEffect(() => {
    if (isConnected && applicationId) {
      sendMessage({
        type: 'SUBSCRIBE_APPLICATION_STATUS',
        data: { applicationId },
      });
    }
  }, [isConnected, applicationId, sendMessage]);

  const getStatusIndex = currentStatus => {
    return statusFlow.indexOf(currentStatus);
  };

  const currentStatusConfig = statusConfig[status];
  const StatusIcon = currentStatusConfig?.icon || ClockIcon;

  return (
    <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Application Status
        </h3>
        <div
          className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}
        ></div>
      </div>

      {/* Current Status */}
      <motion.div
        key={status}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentStatusConfig?.color} flex items-center justify-center`}
          >
            <StatusIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {currentStatusConfig?.label}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentStatusConfig?.description}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {new Date(lastUpdate).toLocaleString()}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {statusFlow.map((statusStep, index) => {
            const stepConfig = statusConfig[statusStep];
            const StepIcon = stepConfig?.icon;
            const isActive = getStatusIndex(status) >= index;
            const isCurrent = status === statusStep;

            return (
              <div key={statusStep} className="flex flex-col items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? `bg-gradient-to-r ${stepConfig?.color} border-transparent text-white`
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <StepIcon className="w-4 h-4" />
                </motion.div>
                <p
                  className={`text-xs mt-2 text-center max-w-16 ${
                    isActive
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {stepConfig?.label.split(' ')[0]}
                </p>
              </div>
            );
          })}
        </div>

        <div className="relative">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${(getStatusIndex(status) / (statusFlow.length - 1)) * 100}%`,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Status History */}
      {statusHistory.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            Timeline
          </h4>
          <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {statusHistory.reverse().map((historyItem, index) => {
              const historyConfig = statusConfig[historyItem.status];
              const HistoryIcon = historyConfig?.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-r ${historyConfig?.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <HistoryIcon className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {historyConfig?.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {historyItem.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(historyItem.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons Based on Status */}
      <div className="mt-6 pt-4 border-t border-white/10">
        {status === 'interview' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-2"
          >
            View Interview Details
          </motion.button>
        )}

        {status === 'accepted' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-2"
          >
            Accept Offer
          </motion.button>
        )}

        {status === 'rejected' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-glass py-2"
          >
            Request Feedback
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatusTracker;
