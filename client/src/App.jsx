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

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />

          {/* New Pages based on your features */}
          
          {/* Easy Scheduling */}
          <Route path="/bookings" element={<Bookings />} />
          
          {/* Community Projects */}
          <Route path="/projects" element={<Projects />} />
          
          {/* Incentive Credits */}
          <Route path="/credits" element={<Credits />} />
          
          {/* Verified Profiles (in Settings) */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Reputation System (on Profile page) */}
          {/* This route can show the logged-in user's own profile */}
          <Route path="/profile" element={<Profile />} />
          
          {/* This route would show a specific user's profile */}
          <Route path="/profile/:userId" element={<Profile />} />

          {/* Not Found Page */}
          <Route path="*" element={<NotFound />} />

          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
