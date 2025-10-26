import { useEffect } from "react";
import { Card, CardContent } from '../components/ui/card.jsx';
import { Network, Calendar, Award, Lightbulb, Heart, Shield, DollarSign } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Network,
    title: "Local Connections",
    description: "Discover and connect with skilled neighbors within your customizable radius",
    image: "/assets/feature-connect.png",
    color: "secondary",
    path: "/discover"
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Built-in calendar with automated reminders and conflict detection",
    image: "/assets/feature-schedule.png",
    color: "secondary",
    path: "/bookings"
  },
  {
    icon: DollarSign,
    title: "Service Marketplace",
    description: "Sell your skills as services and earn credits for your time and expertise",
    image: "/assets/feature-service.png",
    color: "accent",
    path: "/services"
  },
  {
    icon: Lightbulb,
    title: "Community Projects",
    description: "Propose or join collaborative projects that strengthen your neighborhood",
    image: "/assets/feature-projects.png",
    color: "success",
    path: "/projects"
  },
  {
    icon: Heart,
    title: "Incentive Credits",
    description: "Earn credits for participation, redeemable for services or donations",
    image: "/assets/feature-incentive.png",
    color: "secondary",
    path: "/credits"
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Optional identity verification and skill validation for peace of mind",
    image: "/assets/feature-profile.png",
    color: "secondary",
    path: "/settings"
  }
];

const Features = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const path = document.getElementById("scroll-animated-path");
    if (!path) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#scroll-path-svg",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Animated Traced Line */}
      <svg
        id="scroll-path-svg"
        width="100%"
        height="510"
        viewBox="0 0 1440 510"
        fill="none"
        className="absolute left-0 right-0 top-0 pointer-events-none z-0"
      >
        <path
          id="scroll-animated-path"
          d="
      M 40 100
      Q 300 220, 600 150
      Q 900 80, 800 260
      Q 700 370, 1100 330
      Q 1400 300, 1280 400
    "
          stroke="rgba(150, 111, 51, 0.3)"  // Light brown with 30% opacity
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />
      </svg>




      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            Everything You Need to Build Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Powerful features designed to make skill sharing safe, easy, and rewarding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-soft transition-smooth cursor-pointer overflow-hidden border-2 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationDuration: '700ms' }}
                onClick={() => handleCardClick(feature.path)}
              >
                {feature.image &&
                  <div className="relative h-40 w-full overflow-hidden bg-card">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                }
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl gradient-${feature.color} flex items-center justify-center group-hover:scale-110 transition-bounce`}>
                    <Icon className="w-6 h-6 text-black dark:text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
