import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link to="/how-it-works" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
              How It Works
            </Link>
            <Link to="/auth" className="text-foreground/80 hover:text-primary transition-smooth font-medium">
              Sign In
            </Link>
            <Button variant="hero" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
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
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              to="/how-it-works"
              className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/auth"
              className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <div className="px-4">
              <Button variant="hero" className="w-full" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;