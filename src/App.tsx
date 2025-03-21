
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster as SonnerToaster } from './components/ui/sonner';
import Index from './pages/Index';
import Accident from './pages/Accident';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Appointments from './pages/Appointments';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/accident" element={<Accident />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SonnerToaster />
    </Router>
  );
}

export default App;
