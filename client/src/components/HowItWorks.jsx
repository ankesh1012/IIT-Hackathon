import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, Calendar, Star } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and list your skills or learning needs in minutes",
    step: "01"
  },
  {
    icon: Search,
    title: "Discover Neighbors",
    description: "Search for skills or browse community members near you",
    step: "02"
  },
  {
    icon: Calendar,
    title: "Connect & Schedule",
    description: "Book sessions, arrange meetups, or join collaborative projects",
    step: "03"
  },
  {
    icon: Star,
    title: "Build Reputation",
    description: "Share experiences and grow your community standing",
    step: "04"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Get started in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -z-10" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="relative group hover:shadow-soft transition-smooth border-2 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationDuration: '700ms' }}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-6 w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg shadow-soft">
                  {step.step}
                </div>
                
                <CardContent className="p-6 pt-10 space-y-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-bounce">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;