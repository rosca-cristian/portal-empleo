import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import PrivateRoute from './components/auth/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import CVs from './pages/CVs';
import Applications from './pages/Applications';
import PostJob from './pages/PostJob';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import EditJob from './pages/EditJob';
import JobApplications from './pages/JobApplications';
import CandidateProfile from './pages/CandidateProfile';
import Interviews from './pages/Interviews';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/cvs"
              element={
                <PrivateRoute>
                  <CVs />
                </PrivateRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <PrivateRoute>
                  <Applications />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-jobs"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/new"
              element={
                <PrivateRoute>
                  <PostJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/:id/edit"
              element={
                <PrivateRoute>
                  <EditJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/:jobId/applications"
              element={
                <PrivateRoute>
                  <JobApplications />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <PrivateRoute>
                  <CandidateProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/interviews"
              element={
                <PrivateRoute>
                  <Interviews />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
