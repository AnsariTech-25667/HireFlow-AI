/*
 * HireFlow AI React App - Created by Maaz Ansari
 * Senior Full-Stack Engineer specializing in AI-Powered Hiring Solutions
 * Contact: maazansari25667@gmail.com | Pune, India
 */

import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import RealTimeChat from './components/RealTimeChat'
import { AppContext } from './context/AppContext'
import ThemeProvider from './context/ThemeContext'
import WebSocketProvider from './context/WebSocketContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import ChatAssistant from './components/ChatAssistant'
import NotificationSystem from './components/NotificationSystem'
import AchievementSystem from './components/AchievementSystem'
import AdvancedAnalytics from './components/AdvancedAnalytics'
import 'quill/dist/quill.snow.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext)

  return (
    <ThemeProvider>
      <WebSocketProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
        {showRecruiterLogin && <RecruiterLogin />}
        <ToastContainer 
          theme="auto"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="!top-20"
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/apply-job/:id' element={<ApplyJob />} />
          <Route path='/applications' element={<Applications />} />
          <Route path='/dashboard' element={<Dashboard />}>
            {
              companyToken ? <>
                <Route path='add-job' element={<AddJob />} />
                <Route path='analytics' element={<AdvancedAnalytics />} />
                <Route path='manage-jobs' element={<ManageJobs />} />
                <Route path='view-applications' element={<ViewApplications />} />
              </> : null
            }
          </Route>
        </Routes>
        <ChatAssistant />
        <NotificationSystem />
        <AchievementSystem />
        <RealTimeChat jobId="demo-job" applicationId="demo-app" />
        </div>
      </WebSocketProvider>
    </ThemeProvider>
  )
}

export default App