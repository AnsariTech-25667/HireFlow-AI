import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../context/WebSocketContext';
import {
  UsersIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  StarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const CollaborativeHiring = ({ jobId }) => {
  const [reviewers, setReviewers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [teamVotes, setTeamVotes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const { sendMessage, lastMessage, isConnected } = useWebSocket();

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'REVIEWER_JOINED':
          setReviewers(prev => [...prev, lastMessage.data.reviewer]);
          break;
        case 'VOTE_CAST':
          setTeamVotes(prev => ({
            ...prev,
            [lastMessage.data.applicationId]: {
              ...prev[lastMessage.data.applicationId],
              [lastMessage.data.reviewerId]: lastMessage.data.vote,
            },
          }));
          break;
        case 'COMMENT_ADDED':
          setComments(prev => ({
            ...prev,
            [lastMessage.data.applicationId]: [
              ...(prev[lastMessage.data.applicationId] || []),
              lastMessage.data.comment,
            ],
          }));
          break;
        case 'APPLICATION_REVIEW_UPDATE':
          setApplications(prev =>
            prev.map(app =>
              app.id === lastMessage.data.applicationId
                ? { ...app, ...lastMessage.data.updates }
                : app
            )
          );
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (isConnected && jobId) {
      sendMessage({
        type: 'JOIN_HIRING_TEAM',
        data: { jobId },
      });
    }
  }, [isConnected, jobId, sendMessage]);

  const castVote = (applicationId, vote) => {
    sendMessage({
      type: 'CAST_VOTE',
      data: {
        jobId,
        applicationId,
        vote, // 'approve', 'reject', 'maybe'
        reviewerId: 'current_user',
      },
    });
  };

  const addComment = applicationId => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      author: 'current_user',
      timestamp: Date.now(),
      applicationId,
    };

    sendMessage({
      type: 'ADD_COMMENT',
      data: {
        jobId,
        applicationId,
        comment,
      },
    });

    setNewComment('');
  };

  const getVoteStats = applicationId => {
    const votes = teamVotes[applicationId] || {};
    const voteCount = Object.values(votes);

    return {
      approve: voteCount.filter(v => v === 'approve').length,
      reject: voteCount.filter(v => v === 'reject').length,
      maybe: voteCount.filter(v => v === 'maybe').length,
      total: voteCount.length,
    };
  };

  const mockApplications = [
    {
      id: 1,
      candidateName: 'John Doe',
      position: 'Senior React Developer',
      experience: '5 years',
      skills: ['React', 'Node.js', 'TypeScript'],
      resumeScore: 85,
      status: 'reviewing',
    },
    {
      id: 2,
      candidateName: 'Jane Smith',
      position: 'Full Stack Engineer',
      experience: '3 years',
      skills: ['Vue.js', 'Python', 'PostgreSQL'],
      resumeScore: 92,
      status: 'reviewing',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Hiring Team
          </h3>
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}
          ></div>
        </div>

        <div className="flex flex-wrap gap-3">
          {reviewers.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 w-full">
              <p className="text-sm">Waiting for team members to join...</p>
            </div>
          ) : (
            reviewers.map(reviewer => (
              <motion.div
                key={reviewer.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {reviewer.name.charAt(0)}
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {reviewer.name}
                </span>
                {reviewer.isOnline && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Applications Review */}
      <div className="grid gap-6">
        {mockApplications.map(application => {
          const voteStats = getVoteStats(application.id);
          const applicationComments = comments[application.id] || [];

          return (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-xl"
            >
              {/* Candidate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {application.candidateName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {application.candidateName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {application.position} • {application.experience}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {application.resumeScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedApplication(
                      selectedApplication === application.id
                        ? null
                        : application.id
                    )
                  }
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {application.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Voting Section */}
              <div className="mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">
                    Team Decision
                  </h5>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {voteStats.total} votes
                  </div>
                </div>

                <div className="flex gap-3 mb-3">
                  <motion.button
                    onClick={() => castVote(application.id, 'approve')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    Approve ({voteStats.approve})
                  </motion.button>

                  <motion.button
                    onClick={() => castVote(application.id, 'maybe')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ClockIcon className="w-4 h-4" />
                    Maybe ({voteStats.maybe})
                  </motion.button>

                  <motion.button
                    onClick={() => castVote(application.id, 'reject')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Reject ({voteStats.reject})
                  </motion.button>
                </div>

                {/* Vote Progress */}
                {voteStats.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="flex h-2 rounded-full overflow-hidden">
                          {voteStats.approve > 0 && (
                            <div
                              className="bg-green-500"
                              style={{
                                width: `${(voteStats.approve / voteStats.total) * 100}%`,
                              }}
                            />
                          )}
                          {voteStats.maybe > 0 && (
                            <div
                              className="bg-yellow-500"
                              style={{
                                width: `${(voteStats.maybe / voteStats.total) * 100}%`,
                              }}
                            />
                          )}
                          {voteStats.reject > 0 && (
                            <div
                              className="bg-red-500"
                              style={{
                                width: `${(voteStats.reject / voteStats.total) * 100}%`,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-500" />
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">
                    Team Discussion ({applicationComments.length})
                  </h5>
                </div>

                {applicationComments.length > 0 && (
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    {applicationComments.map(comment => (
                      <div
                        key={comment.id}
                        className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <motion.button
                    onClick={() => addComment(application.id)}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white disabled:opacity-50 hover:bg-primary-600 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Comment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CollaborativeHiring;
