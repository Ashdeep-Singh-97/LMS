import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import AdminPage from './Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

const AppContent: React.FC = () => {

  return (
    <div>

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Protected routes — allow access only if user and role match */}
        <Route
          path="/teacher/:courseId/:lessonId"
          element={
            <ProtectedRoute role='teacher'>
              <TeacherPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute role='student'>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role='admin'>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        {/* Catch-all for invalid routes */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
