import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Decorative Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/assets/hero-community.png"
          alt="Community Illustration"
          className="w-full h-full object-cover object-center opacity-80"
          style={{ minHeight: '100%', minWidth: '100%' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-background/80 to-accent/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass shadow-soft">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">Join 10,000+ community members</span>
          </div>
          {/* Headline */}
          <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Share Skills, Build Community, Grow Together
          </h1>
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            Connect with neighbors to exchange skills, collaborate on projects, and strengthen your local community
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <Button variant="hero" size="xl" asChild className="group">
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="group-hover:translate-x-1 transition-smooth" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/discover">Explore Skills</Link>
            </Button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <div className="glass p-6 rounded-xl shadow-card hover:shadow-soft transition-smooth">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold text-primary">10K+</span>
              </div>
              <p className="text-muted-foreground">Active Members</p>
            </div>
            <div className="glass p-6 rounded-xl shadow-card hover:shadow-soft transition-smooth">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-3xl font-bold text-secondary">500+</span>
              </div>
              <p className="text-muted-foreground">Local Communities</p>
            </div>
            <div className="glass p-6 rounded-xl shadow-card hover:shadow-soft transition-smooth">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-3xl font-bold text-accent">25K+</span>
              </div>
              <p className="text-muted-foreground">Skills Shared</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default Hero;
