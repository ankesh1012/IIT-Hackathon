// client/src/pages/Discover.jsx

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Label } from '../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Search, MapPin, Star, Sparkles, X as XIcon, Loader2, Heart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { skillAPI, userAPI } from '@/lib/api';
import { useAuthContext } from '@/hooks/useAuthContext';

// --- Lazy Load the Map Component ---
const LazyUserMap = lazy(() => import('../components/UserMap'));

// --- Main Discover Page Component ---
export default function Discover() {
  const { user } = useAuthContext();

  // State for search filters
  const [nameQuery, setNameQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [skillQuery, setSkillQuery] = useState('');
  const [radius, setRadius] = useState('5'); 

  // State for skill autocomplete
  const [allSkills, setAllSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSkillInputFocused, setIsSkillInputFocused] = useState(false);

  // State for results
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  
  const skillInputRef = useRef(null);

  // Reusable function to fetch users
  const fetchUsers = async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userAPI.searchUsers(params);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all skills for autocomplete on mount
  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const response = await skillAPI.getAllSkillTags();
        setAllSkills(response.data.map(skill => skill.name));
      } catch (error) {
        console.error("Failed to fetch skills list:", error);
      }
    };
    fetchAllSkills();
  }, []);
  
  // --- Fetch initial users based on Learning Goals ---
  useEffect(() => {
    const initialParams = {};
    if (user) {
      // Send userId. Backend logic will now prioritize matching their learningSkills.
      initialParams.userId = user._id;
    }
    fetchUsers(initialParams);
  }, [user]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillInputRef.current && !skillInputRef.current.contains(event.target)) {
        setIsSkillInputFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle skill input typing
  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillQuery(value);
    setIsSkillInputFocused(true);

    if (value.length > 0) {
      setSuggestions(
        allSkills
          .filter(s => s.toLowerCase().startsWith(value.toLowerCase()))
          .slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };

  // Handle clicking a skill suggestion
  const handleSuggestionClick = (skillName) => {
    setSkillQuery(skillName);
    setSuggestions([]);
    setIsSkillInputFocused(false);
  };
  
  // Handle the main search
  const handleSearch = async (e) => {
    e.preventDefault();
    const params = {};
    if (nameQuery) params.name = nameQuery;
    if (locationQuery) params.location = locationQuery;
    if (skillQuery) params.skill = skillQuery;
    
    fetchUsers(params);
  };
  
  // --- Extract center coordinates for the map ---
  // If user is logged in, use their coordinates from the user context.
  // Otherwise, use the location of the first user in the search results.
  const mapCenterCoords = user?.coords?.lat ? {
      lat: user.coords.lat,
      lng: user.coords.lng
  } : (users.length > 0 && users[0].coords.lat !== 0 ? {
      lat: users[0].coords.lat,
      lng: users[0].coords.lng
  } : { lat: 20.5937, lng: 78.9629 }); // Default to India center if no known location

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Local Connections</h1>
        <p className="text-lg text-muted-foreground">Discover and connect with skilled neighbors in your area.</p>
      </header>
      
      {/* --- MAP SECTION --- */}
      <div className='mb-10'>
          <h2 className='text-2xl font-semibold mb-4'>Nearby Users Visualization</h2>
          {/* Use Suspense for the lazy-loaded map */}
          <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-lg"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>}>
              <LazyUserMap users={users} userLocation={mapCenterCoords} />
          </Suspense>
      </div>

      {/* Search and Filter Bar */}
      <form onSubmit={handleSearch} className="p-6 bg-card rounded-lg shadow-soft border mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Name Search */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Name or Bio</Label>
            <div className="relative mt-1">
              <Input
                id="name"
                type="text"
                placeholder="e.g., Jane Doe, 'tutor'"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          {/* Location Search */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium">Location</Label>
            <div className="relative mt-1">
              <Input
                id="location"
                type="text"
                placeholder="e.g., Brooklyn, NY"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          {/* Skill Search (with autocomplete) */}
          <div className="relative" ref={skillInputRef}>
            <Label htmlFor="skill" className="text-sm font-medium">Skill</Label>
            <div className="relative mt-1">
              <Input
                id="skill"
                type="text"
                placeholder="e.g., Gardening"
                value={skillQuery}
                onChange={handleSkillInputChange}
                onFocus={() => setIsSkillInputFocused(true)}
                autoComplete="off"
                className="pl-10"
              />
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            {/* Suggestions Box */}
            {isSkillInputFocused && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((s) => (
                  <div
                    key={s}
                    className="p-3 hover:bg-muted cursor-pointer text-sm capitalize"
                    onMouseDown={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Search
          </Button>
        </div>
      </form>

      {/* Results Grid */}
      <div>
        {isLoading && (
          <div className="text-center py-10">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground mt-2">Finding connections...</p>
          </div>
        )}
        
        {!isLoading && error && (
          <div className="text-center py-10 text-destructive">
            <XIcon className="h-8 w-8 mx-auto" />
            <p className="mt-2">{error}</p>
          </div>
        )}
        
        {!isLoading && users.length === 0 && (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold">
                {user ? "No matching skills found" : "No users found"}
            </h3>
            <p className="text-muted-foreground mt-2">
                {user ? "Try searching, or add more skills you want to learn to your account." : "Try adjusting your search filters or broadening your search."}
            </p>
          </div>
        )}
        
        {!isLoading && !error && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserProfileCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Reusable User Profile Card component (Unchanged) ---
function UserProfileCard({ user }) {
  const getInitials = (name) => {
    return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : '';
  };

  return (
    <Card className="flex flex-col shadow-soft hover:shadow-medium transition-smooth hover-lift h-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar || ''} alt={user.name} />
          <AvatarFallback className="text-2xl bg-muted">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{user.location || 'Location not set'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="font-semibold mb-2">Top Skills:</h4>
        <div className="flex flex-wrap gap-2">
          {user.skills && user.skills.length > 0 ? (
            user.skills.slice(0, 5).map((skill) => (
              <Badge key={skill._id || skill.name} variant="secondary" className="capitalize">{skill.name}</Badge>
            ))
          ) : (
             <p className="text-sm text-muted-foreground">No skills listed.</p>
          )}
           {user.skills && user.skills.length > 5 && (
            <Badge variant="outline">
              +{user.skills.length - 5} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {user.rating > 0 ? (
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{user.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground ml-1">({user.reviewCount || 0})</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No reviews yet</div>
        )}

        <Button asChild variant="outline" size="sm">
          <Link to={`/users/${user._id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}