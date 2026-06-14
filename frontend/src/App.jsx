import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import BookingPage from './pages/public/BookingPage';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import AppointmentDetail from './pages/dashboard/AppointmentDetail';

import TechnicianDashboard from './pages/dashboard/TechnicianDashboard';
import TechnicianSchedule from './pages/dashboard/TechnicianSchedule';
import InterventionReportForm from './pages/dashboard/InterventionReportForm';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminAppointments from './pages/dashboard/AdminAppointments';
import ProfilePage from './pages/dashboard/ProfilePage';

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { user } = useAuthStore();
  
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  
  if (user?.role === 'technician') {
    return <TechnicianDashboard />;
  }
  
  return <ClientDashboard />;
};

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Se încarcă...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['client', 'technician', 'admin']}>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['client', 'technician', 'admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/technician/schedule" 
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianSchedule />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/technician/report/:id" 
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <InterventionReportForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/appointments/:id" 
              element={
                <ProtectedRoute allowedRoles={['client', 'technician', 'admin']}>
                  <AppointmentDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/appointments" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAppointments />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
