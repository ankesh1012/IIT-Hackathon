import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Start Sharing Skills in Minutes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to connect, collaborate, and grow with your community
            </p>
          </div>
        </div>

        <HowItWorks />

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6 max-w-2xl mx-auto glass p-12 rounded-2xl shadow-soft">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of community members already sharing skills and building connections
            </p>
            <Button variant="hero" size="xl" asChild className="group">
              <Link to="/auth">
                Create Your Free Account
                <ArrowRight className="group-hover:translate-x-1 transition-smooth" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;