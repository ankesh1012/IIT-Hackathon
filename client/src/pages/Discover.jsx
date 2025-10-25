import React, { useState } from 'react';
import { Input } from '../components/ui/input.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Search, MapPin, Star } from 'lucide-react';

// Mock data for user profile cards
const mockUsers = [
  { id: 1, name: 'Jane Doe', location: 'New York, NY', radius: 2, rating: 4.5, skills: ['Gardening', 'Plumbing'], avatar: 'https://placehold.co/100x100/E2E8F0/64748B?text=JD' },
  { id: 2, name: 'John Smith', location: 'Brooklyn, NY', radius: 5, rating: 5.0, skills: ['Math Tutor', 'JavaScript'], avatar: 'https://placehold.co/100x100/E2E8F0/64748B?text=JS' },
  { id: 3, name: 'Alex Johnson', location: 'Queens, NY', radius: 8, rating: 4.0, skills: ['Painting', 'Home Repair'], avatar: 'https://placehold.co/100x100/E2E8F0/64748B?text=AJ' },
];

/**
 * Discover Page (Local Connections)
 * This page allows users to find and connect with skilled neighbors.
 */
export default function Discover() {
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState('5'); // Default 5km radius

  // TODO: Add state for filtered users
  // TODO: Implement fetch logic in a useEffect to get users from the API
  // based on searchTerm and radius

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Local Connections</h1>
        <p className="text-lg text-gray-600">Discover and connect with skilled neighbors in your area.</p>
      </header>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search by skill (e.g., 'Plumber', 'Tutor')..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Select value={radius} onValueChange={setRadius}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select radius" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Within 1 km</SelectItem>
            <SelectItem value="5">Within 5 km</SelectItem>
            <SelectItem value="10">Within 10 km</SelectItem>
            <SelectItem value="25">Within 25 km</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full md:w-auto">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user) => (
          <UserProfileCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

/**
 * Reusable User Profile Card component
 */
function UserProfileCard({ user }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full" />
        <div>
          <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{user.location} ({user.radius}km away)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="font-semibold mb-2">Top Skills:</h4>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold">{user.rating.toFixed(1)}</span>
        </div>
        {/* This button should link to the new Profile.jsx page */}
        <Button variant="outline">View Profile</Button>
      </CardFooter>
    </Card>
  );
}
