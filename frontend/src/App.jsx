import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './hooks/useAuth';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import StudentManagementPage from './pages/admin/StudentManagementPage';
import StudentDetailPage from './pages/admin/StudentDetailPage';
import SkillManagementPage from './pages/admin/SkillManagementPage';
import JobRoleManagementPage from './pages/admin/JobRoleManagementPage';
import LearningResourcesPage from './pages/admin/LearningResourcesPage';
import AssessmentsPage from './pages/admin/AssessmentsPage';
import ReportsPage from './pages/admin/ReportsPage';

// Student pages
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import ProfilePage from './pages/student/ProfilePage';
import MySkillsPage from './pages/student/MySkillsPage';
import JobRolesPage from './pages/student/JobRolesPage';
import AnalysisPage from './pages/student/AnalysisPage';
import AnalysisResultsPage from './pages/student/AnalysisResultsPage';
import RoadmapPage from './pages/student/RoadmapPage';
import AssessmentHistoryPage from './pages/student/AssessmentHistoryPage';

// Shared pages
import SettingsPage from './pages/SettingsPage';

// Protected route wrapper
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/student/dashboard" replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/students" element={<StudentManagementPage />} />
        <Route path="/admin/students/:studentId" element={<StudentDetailPage />} />
        <Route path="/admin/skills" element={<SkillManagementPage />} />
        <Route path="/admin/job-roles" element={<JobRoleManagementPage />} />
        <Route path="/admin/resources" element={<LearningResourcesPage />} />
        <Route path="/admin/assessments" element={<AssessmentsPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Route>

      {/* Student routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
        <Route path="/student/skills" element={<MySkillsPage />} />
        <Route path="/student/job-roles" element={<JobRolesPage />} />
        <Route path="/student/analysis" element={<AnalysisPage />} />
        <Route path="/student/results/:assessmentId" element={<AnalysisResultsPage />} />
        <Route path="/student/roadmap" element={<RoadmapPage />} />
        <Route path="/student/history" element={<AssessmentHistoryPage />} />
        <Route path="/student/settings" element={<SettingsPage />} />
      </Route>

      {/* Shared settings redirect */}
      <Route
        path="/settings"
        element={
          <Navigate to={user?.role === 'ADMIN' ? '/admin/settings' : '/student/settings'} replace />
        }
      />

      {/* Default redirects */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
