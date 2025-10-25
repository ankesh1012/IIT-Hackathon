// client/src/components/UserCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function UserCard({ user }) {
  // Function to get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    // --- THIS IS THE FIX ---
    // Wrap the entire Card in a Link component.
    // We add 'group' to the Link and 'group-hover:text-primary' to the name
    // to keep the hover effect on the user's name.
    <Link to={`/users/${user._id}`} className="group block">
      <Card className="shadow-soft hover:shadow-medium transition-smooth hover-lift h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || ''} alt={user.name} />
            <AvatarFallback className="text-xl bg-muted">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-smooth">
              {/* The Link is no longer needed here */}
              {user.name}
            </CardTitle>
            {user.location && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin size={14} />
                <span>{user.location}</span>
              </div>
            )}
          </div>
          {user.rating > 0 && (
            <div className="flex items-center gap-1 text-secondary-dark font-bold">
              <Star size={16} className="text-secondary-dark" />
              <span>{user.rating.toFixed(1)}</span>
              <span className="text-muted-foreground font-normal ml-1">
                ({user.reviewCount})
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
            {user.bio || 'No bio provided.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.slice(0, 7).map((skill) => ( // Show max 7 skills
                <Badge key={skill._id} variant="secondary" className="capitalize">
                  {skill.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed.</p>
            )}
            {user.skills && user.skills.length > 7 && (
              <Badge variant="outline">
                +{user.skills.length - 7} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
    // -------------------------
  );
}