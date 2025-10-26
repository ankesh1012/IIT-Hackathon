// client/src/pages/UserProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '@/lib/api';
import { Loader2, MapPin, Mail, Sparkles, Star, User, XIcon, Award, MessageCircle } from 'lucide-react'; // Added MessageCircle
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuthContext } from '@/hooks/useAuthContext'; // Import context to check if logged in

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuthContext(); // Get logged-in user
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await userAPI.getUser(id);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user profile.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        <XIcon className="h-12 w-12 mx-auto" />
        <h2 className="mt-4 text-2xl font-semibold">{error}</h2>
        <Button asChild variant="link" className="mt-2">
          <Link to="/connections">Back to Connections</Link>
        </Button>
      </div>
    );
  }

  if (!user) {
    return null; // Should be covered by error state
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column (Avatar & Contact) */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <Avatar className="h-40 w-40 border-4 border-card shadow-medium">
            <AvatarImage src={user.avatar || ''} alt={user.name} />
            <AvatarFallback className="text-5xl bg-muted">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold mt-4 text-center md:text-left">{user.name}</h1>
          
          {user.location && (
            <div className="flex items-center gap-2 text-muted-foreground text-lg mt-2">
              <MapPin size={18} />
              <span>{user.location}</span>
            </div>
          )}
          
          {user.rating > 0 && (
            <div className="flex items-center gap-1 text-secondary-dark font-bold text-lg mt-3">
              <Star size={20} className="text-secondary-dark" />
              <span>{user.rating.toFixed(1)}</span>
              <span className="text-muted-foreground font-normal ml-1">
                ({user.reviewCount} reviews)
              </span>
            </div>
          )}
          
          {/* --- MODIFIED CONTACT BUTTON --- */}
          <Button 
            size="lg" 
            className="w-full mt-6 gradient-primary"
            asChild
            disabled={!currentUser || isOwnProfile} // Disable if not logged in or viewing own profile
          >
            {/* If logged in, go to chat page. If not, mailto is the fallback. */}
            {currentUser && !isOwnProfile ? (
                <Link to={`/chat/${user._id}`}>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with {user.name.split(' ')[0]}
                </Link>
            ) : (
                <a href={`mailto:${user.email}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    Email {user.name.split(' ')[0]}
                </a>
            )}
          </Button>
          {/* ------------------------------- */}

          <Button asChild variant="outline" className="w-full mt-3">
            <Link to="/projects">View Projects</Link>
          </Button>
        </div>

        {/* Right Column (Bio & Skills) */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <User size={24} />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-muted-foreground leading-relaxed">
              {user.bio || 'No bio provided.'}
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Sparkles size={24} />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {user.skills.map((skill) => (
                    <Badge 
                      key={skill._id} 
                      variant="secondary" 
                      className="text-base px-4 py-2 capitalize"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">This user hasn't added any skills yet.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}