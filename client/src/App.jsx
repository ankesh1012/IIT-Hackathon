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
// --- NEW IMPORTS ---
import PrivateChat from './pages/PrivateChat'; // New Chat Page
import ServiceMarketplace from './pages/ServiceMarketplace'; // Assuming you have this
import UserProfilePage from './pages/UserProfilePage'; // Existing, but for routing
// -------------------

function App() {
  return (
    <AuthContextProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            {/* Existing Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/services" element={<ServiceMarketplace />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            
            {/* --- NEW CHAT ROUTE --- */}
            <Route path="/chat/:otherUserId" element={<PrivateChat />} />

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