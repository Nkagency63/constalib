
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from './pages/Index';
import About from './pages/About';
import Accident from './pages/Accident';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Appointments from './pages/Appointments';
import Carrossiers from './pages/Carrossiers';
import Privacy from './pages/Privacy';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import ToastHandler from '@/components/ToastHandler';
import MobileAppWrapper from './components/MobileAppWrapper';
import CookieConsentBanner from '@/components/CookieConsentBanner';

function App() {
  return (
    <AuthProvider>
      <MobileAppWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/accident" element={
              <ProtectedRoute>
                <Accident />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/carrossiers" element={<Carrossiers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <CookieConsentBanner />
          <ToastHandler />
        </BrowserRouter>
      </MobileAppWrapper>
    </AuthProvider>
  );
}

export default App;
