
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from './pages/Index';
import About from './pages/About';
import Accident from './pages/Accident';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Appointments from './pages/Appointments';
import Carrossiers from './pages/Carrossiers';
import NotFound from './pages/NotFound';
import ToastHandler from '@/components/ToastHandler';
import MobileAppWrapper from './components/MobileAppWrapper';

function App() {
  return (
    <TooltipProvider>
      <MobileAppWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/accident" element={<Accident />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/carrossiers" element={<Carrossiers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MobileAppWrapper>
    </TooltipProvider>
  );
}

export default App;
