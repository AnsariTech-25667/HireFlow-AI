import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
  CheckBadgeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const AchievementSystem = () => {
  const [achievements, setAchievements] = useState([]);
  const [showNotification, setShowNotification] = useState(null);
  const [userStats, setUserStats] = useState({
    profileCompletion: 85,
    applicationsSubmitted: 12,
    interviewsScheduled: 3,
    skillsAssessed: 8,
    connectionsAdded: 15,
    jobsViewed: 45,
  });

  const achievementTemplates = [
    {
      id: 'first-application',
      title: 'First Step',
      description: 'Submit your first job application',
      icon: BriefcaseIcon,
      color: 'from-blue-500 to-cyan-500',
      requirement: { type: 'applications', value: 1 },
      xp: 100,
    },
    {
      id: 'application-streak',
      title: 'Go-Getter',
      description: 'Submit 10 job applications',
      icon: FireIcon,
      color: 'from-orange-500 to-red-500',
      requirement: { type: 'applications', value: 10 },
      xp: 500,
    },
    {
      id: 'profile-master',
      title: 'Profile Master',
      description: 'Complete 100% of your profile',
      icon: StarIcon,
      color: 'from-yellow-500 to-orange-500',
      requirement: { type: 'profileCompletion', value: 100 },
      xp: 300,
    },
    {
      id: 'interview-ready',
      title: 'Interview Ready',
      description: 'Schedule your first interview',
      icon: AcademicCapIcon,
      color: 'from-green-500 to-emerald-500',
      requirement: { type: 'interviews', value: 1 },
      xp: 200,
    },
    {
      id: 'skill-showcase',
      title: 'Skill Showcase',
      description: 'Complete 5 skill assessments',
      icon: CheckBadgeIcon,
      color: 'from-purple-500 to-violet-500',
      requirement: { type: 'skills', value: 5 },
      xp: 250,
    },
    {
      id: 'networker',
      title: 'Networker',
      description: 'Connect with 10 professionals',
      icon: UserGroupIcon,
      color: 'from-pink-500 to-rose-500',
      requirement: { type: 'connections', value: 10 },
      xp: 150,
    },
    {
      id: 'explorer',
      title: 'Job Explorer',
      description: 'View 50 job postings',
      icon: SparklesIcon,
      color: 'from-indigo-500 to-blue-500',
      requirement: { type: 'jobsViewed', value: 50 },
      xp: 100,
    },
  ];

  // Check for new achievements
  useEffect(() => {
    achievementTemplates.forEach(template => {
      if (achievements.find(a => a.id === template.id)) return; // Already unlocked

      const statValue = userStats[template.requirement.type] || 0;
      if (statValue >= template.requirement.value) {
        const newAchievement = {
          ...template,
          unlockedAt: Date.now(),
          isNew: true,
        };

        setAchievements(prev => [...prev, newAchievement]);
        setShowNotification(newAchievement);

        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(null);
          setAchievements(prev =>
            prev.map(a =>
              a.id === newAchievement.id ? { ...a, isNew: false } : a
            )
          );
        }, 5000);
      }
    });
  }, [userStats]);

  // Simulate stat updates (in real app, this would come from API/user actions)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance to update stats
        setUserStats(prev => ({
          ...prev,
          applicationsSubmitted:
            prev.applicationsSubmitted + (Math.random() > 0.8 ? 1 : 0),
          profileCompletion: Math.min(
            100,
            prev.profileCompletion + (Math.random() > 0.9 ? 5 : 0)
          ),
          interviewsScheduled:
            prev.interviewsScheduled + (Math.random() > 0.95 ? 1 : 0),
          skillsAssessed: prev.skillsAssessed + (Math.random() > 0.85 ? 1 : 0),
          connectionsAdded:
            prev.connectionsAdded + (Math.random() > 0.8 ? 1 : 0),
          jobsViewed: prev.jobsViewed + (Math.random() > 0.7 ? 1 : 0),
        }));
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const totalXP = achievements.reduce(
    (sum, achievement) => sum + achievement.xp,
    0
  );
  const level = Math.floor(totalXP / 500) + 1;
  const xpToNextLevel = level * 500 - totalXP;

  return (
    <>
      {/* Achievement Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass rounded-2xl p-6 border border-white/20 shadow-2xl backdrop-blur-xl max-w-sm">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="mb-4"
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${showNotification.color} flex items-center justify-center`}
                  >
                    <TrophyIcon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Achievement Unlocked!
                  </h3>
                  <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1">
                    {showNotification.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {showNotification.description}
                  </p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                    <SparklesIcon className="w-4 h-4" />+{showNotification.xp}{' '}
                    XP
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Progress Widget */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="glass rounded-2xl p-4 border border-white/20 shadow-xl backdrop-blur-xl w-80"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <TrophyIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Level {level}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {totalXP} XP • {xpToNextLevel} to next level
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {achievements.length}/{achievementTemplates.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Achievements
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <motion.div
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((totalXP % 500) / 500) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Recent Achievements */}
          <div className="space-y-2">
            {achievements
              .slice(-3)
              .reverse()
              .map(achievement => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      achievement.isNew
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg bg-gradient-to-r ${achievement.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        +{achievement.xp} XP
                      </p>
                    </div>
                    {achievement.isNew && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    )}
                  </motion.div>
                );
              })}
          </div>

          {/* Quick Stats */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {userStats.applicationsSubmitted}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Applications
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {userStats.interviewsScheduled}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Interviews
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {userStats.profileCompletion}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Profile
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AchievementSystem;
