import { Link } from "react-router-dom";
import { Users, Menu, UserCircle, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dark mode state
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleDarkMode = () => {
    setDark(!dark);
  };

  const handleMobileLinkClick = () => setIsMenuOpen(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsMenuOpen(false);
  };

  // Common class for navigation links and toggle button icon color:
  // text-foreground/80 + hover:text-primary transition
  const navLinkClasses = "text-foreground/80 hover:text-primary transition-smooth font-medium flex items-center gap-1";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
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
            <Link to="/how-it-works" className={navLinkClasses}>
              How It Works
            </Link>

            {/* Dark mode toggle button - icon with same color scheme */}
            <button
              onClick={toggleDarkMode}
              className={`${navLinkClasses} p-2 rounded hover:bg-muted transition-smooth`}
              aria-label="Toggle Dark Mode"
              title="Toggle Dark Mode"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons Desktop */}
            {isLoggedIn ? (
              <>
                <Link to="/account" className={navLinkClasses}>
                  <UserCircle size={20} />
                  My Account
                </Link>
                <button
                  onClick={toggleLogin}
                  className="text-foreground/80 hover:text-primary transition-smooth font-medium px-4 py-1 rounded"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className={navLinkClasses}>
                  Sign In
                </Link>
                <button
                  onClick={toggleLogin}
                  className="bg-primary text-primary-foreground px-4 py-1 rounded hover:bg-primary-dark transition"
                >
                  Get Started (Log In)
                </button>
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
              to="/how-it-works"
              className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
              onClick={handleMobileLinkClick}
            >
              How It Works
            </Link>
            {/* Dark mode toggle in mobile menu */}
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

            {isLoggedIn ? (
              <>
                <Link
                  to="/account"
                  className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
                  onClick={handleMobileLinkClick}
                >
                  My Account
                </Link>
                <button
                  onClick={toggleLogin}
                  className="block w-full px-4 py-2 text-left hover:bg-muted rounded-lg transition-smooth"
                >
                  Log Out
                </button>
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
                <button
                  onClick={toggleLogin}
                  className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition"
                >
                  Get Started (Log In)
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
