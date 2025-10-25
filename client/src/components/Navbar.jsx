// client/src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { Users, Menu, UserCircle, Sun, Moon, Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button.jsx";
import { useAuthContext } from "../hooks/useAuthContext.jsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleDarkMode = () => setDark(!dark);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleMobileLinkClick = () => setIsMenuOpen(false);

  // Common link styles
  const navLinkClasses =
    "text-foreground/80 hover:text-primary transition-smooth font-medium flex items-center gap-1";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center transition-bounce group-hover:shadow-glow group-hover:scale-110">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SkillShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/discover" className={navLinkClasses}>
              Discover
            </Link>
            <Link to="/projects" className={navLinkClasses}>
              Projects
            </Link>
            
            
            
            <Link to="/how-it-works" className={navLinkClasses}>
              How It Works
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`${navLinkClasses} p-2 rounded hover:bg-muted transition-smooth`}
              aria-label="Toggle Dark Mode"
              title="Toggle Dark Mode"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <>
                <Link to="/account" className={navLinkClasses}>
                  <UserCircle size={20} />
                  My Account
                </Link>
                <Button onClick={handleLogout} variant="ghost">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" className={navLinkClasses}>
                  Sign In
                </Link>
                <Button asChild variant="hero">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-3">
            <Link
              to="/discover"
              className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
              onClick={handleMobileLinkClick}
            >
              Discover
            </Link>
            <Link
              to="/projects"
              className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
              onClick={handleMobileLinkClick}
            >
              Projects
            </Link>
            
           
            
            <Link
              to="/how-it-works"
              className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
              onClick={handleMobileLinkClick}
            >
              How It Works
            </Link>

            {/* Dark mode toggle (mobile) */}
            <button
              onClick={() => {
                toggleDarkMode();
                handleMobileLinkClick();
              }}
              className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-smooth flex items-center gap-2"
              aria-label="Toggle Dark Mode"
            >
              {dark ? (
                <>
                  <Sun className="w-5 h-5" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" /> Dark Mode
                </>
              )}
            </button>

            {/* Auth Buttons (mobile) */}
            {isLoggedIn ? (
              <>
                <Link
                  to="/account"
                  className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
                  onClick={handleMobileLinkClick}
                >
                  My Account
                </Link>
                <div className="px-4">
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full text-left justify-start px-0"
                  >
                    Log Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
                  onClick={handleMobileLinkClick}
                >
                  Sign In
                </Link>
                <div className="px-4">
                  <Button asChild variant="hero" className="w-full">
                    <Link to="/auth" onClick={handleMobileLinkClick}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;