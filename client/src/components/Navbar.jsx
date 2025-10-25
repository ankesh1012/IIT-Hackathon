import { Link } from "react-router-dom";
// Note: I'm importing UserCircle for the account button
import { Users, Menu, UserCircle } from "lucide-react";
import { useState } from "react";
// We are now importing your project's Button component
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- Mock Auth State ---
  // In a real app, this would come from React Context or a state management library.
  // We'll toggle this state for demonstration.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Helper to close the mobile menu on navigation
  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };
  
  // Helper to simulate login/logout
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsMenuOpen(false); // Close menu on login/logout
  };

  return (
    // Reverted to your original glass effect styles
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Reverted to your original gradient-hero styles */}
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center transition-bounce group-hover:shadow-glow group-hover:scale-110">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SkillShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Reverted to your original text colors */}
            <Link to="/discover" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
              Discover
            </Link>
            <Link to="/how-it-works" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
              How It Works
            </Link>

            {/* --- Conditional Auth Buttons (Desktop) --- */}
            {isLoggedIn ? (
              <>
                <Link to="/account" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-smooth font-medium">
                  <UserCircle size={20} />
                  My Account
                </Link>
                {/* Using variant="ghost" from your Button component */}
                <Button onClick={toggleLogin} variant="ghost">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
                  Sign In
                </Link>
                {/* Using variant="hero" from your Button component */}
                <Button onClick={toggleLogin} variant="hero">
                  Get Started (Log In)
                </Button>
              </>
            )}
            {/* ------------------------------------------- */}

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          // Reverted to your original mobile styles
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
            
            {/* --- Conditional Auth Buttons (Mobile) --- */}
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
                  {/* Using variant="ghost" from your Button component */}
                  <Button onClick={toggleLogin} variant="ghost" className="w-full text-left justify-start px-0">
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
                  {/* Using variant="hero" from your Button component */}
                  <Button onClick={toggleLogin} variant="hero" className="w-full">
                    Get Started (Log In)
                  </Button>
                </div>
              </>
            )}
            {/* --------------------------------------- */}

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

