import { Link, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { Users, Menu, UserCircle } from "lucide-react";
import { useState } from "react";
// 2. Fix path to ui component using relative path
import { Button } from "./ui/button.jsx"; 

// 3. Import the useAuthContext hook using relative path
import { useAuthContext } from "../hooks/useAuthContext.jsx"; // 4. Fix path to hook

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 5. Get user and logout function from context
  const { user, logout } = useAuthContext();
  const navigate = useNavigate(); // 6. Initialize navigate

  // 7. Check auth state
  const isLoggedIn = !!user; // true if user object exists, false if null

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };
  
  // 8. Create a real logout handler
  const handleLogout = () => {
    logout();
    navigate('/'); // 9. Redirect to home page on logout
    setIsMenuOpen(false); // Close menu on logout
  };

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
            <Link to="/discover" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
              Discover
            </Link>
            <Link to="/projects" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
              Projects
            </Link>
            <Link to="/how-it-works" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
              How It Works
            </Link>

            {/* --- 10. Use real auth state --- */}
            {isLoggedIn ? (
              <>
                <Link to="/account" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-smooth font-medium">
                  <UserCircle size={20} />
                  My Account
                </Link>
                <Button onClick={handleLogout} variant="ghost">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
                  Sign In
                </Link>
                <Button asChild variant="hero">
                  <Link to="/auth">Get Started</Link>
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
            
            {/* --- 11. Use real auth state (Mobile) --- */}
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
                  <Button onClick={handleLogout} variant="ghost" className="w-full text-left justify-start px-0">
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
                    <Link to="/auth" onClick={handleMobileLinkClick}>Get Started</Link>
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


