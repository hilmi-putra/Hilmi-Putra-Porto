import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import ProjectsPage from '../pages/ProjectsPage';
import ContactPage from '../pages/ContactPage';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';

// Route Guard
import ProtectedRoutes from './ProtectedRoutes';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoutes>
            <AdminDashboard />
          </ProtectedRoutes>
        } 
      />
      {/* Fallback to Home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};
export default AppRoutes;
