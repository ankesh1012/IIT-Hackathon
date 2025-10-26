// client/src/App.jsx

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Discover from './pages/Discover';
import HowItWorksPage from './pages/HowItWorksPage';
import NotFound from './pages/NotFound';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Credits from './pages/Credits';
import Settings from './pages/Settings';
import AccountPage from './pages/AccountPage';
import { AuthContextProvider } from '@/context/AuthContext';
import ServiceMarketplace from './pages/ServiceMarketplace';

// --- 1. IMPORT THE NEW PAGES ---
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <AuthContextProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Add pt-16 so all pages get correct spacing below the fixed navbar */}
        <main className="flex-grow pt-16">
          <Routes>
            {/* Existing Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />

            {/* New Pages based on your features */}
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/account" element={<AccountPage />} />

            {/* --- 2. ADD THE NEW ROUTES --- */}
           
            <Route 
              path="/users/:id" 
              element={<UserProfilePage />} 
            />
            <Route 
              path="/services" 
              element={<ServiceMarketplace />} 
            />

            {/* Not Found Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContextProvider>
  );
}

export default App;