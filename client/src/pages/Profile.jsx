import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Avatar } from '../components/ui/avatar.jsx';
import { Star, MapPin, Plus, CheckCircle, MessageSquare } from 'lucide-react';

// Mock Data for a single user profile
const userProfile = {
  id: 1,
  name: 'Jane Doe',
  location: 'New York, NY',
  bio: 'Passionate gardener and amateur plumber. Happy to help neighbors with small home projects and garden upkeep. Looking to build a community garden!',
  avatar: 'https://placehold.co/150x150/E2E8F0/64748B?text=JD',
  isVerified: true,
  skills: [
    { name: 'Gardening', endorsements: 12 },
    { name: 'Plumbing', endorsements: 5 },
    { name: 'Painting', endorsements: 2 },
  ],
  rating: 4.5,
  reviews: [
    { id: 1, reviewer: 'John S.', rating: 5, comment: 'Jane was amazing! She fixed my leaky faucet in 10 minutes. Highly recommend!' },
    { id: 2, reviewer: 'Alex J.', rating: 4, comment: 'Helped me plan my vegetable garden. Very knowledgeable.' },
  ]
};

/**
 * User Profile Page
 * Displays user information, skills, and the Reputation System (ratings/reviews).
 */
export default function Profile() {
  
  // TODO: In a real app, you would fetch the profile data based on a user ID from the URL params
  // const { userId } = useParams();
  // useEffect(() => {
  //   fetchProfile(userId);
  // }, [userId]);
  
  const { name, location, bio, avatar, isVerified, skills, rating, reviews } = userProfile;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <img src={avatar} alt={name} className="h-32 w-32 rounded-full mb-4" />
              <h1 className="text-3xl font-bold">{name}</h1>
              
              {isVerified && (
                <Badge className="mt-2 bg-blue-100 text-blue-800">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verified Profile
                </Badge>
              )}
              
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>

              <div className="flex items-center gap-1 mt-4">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
              
              <Button className="mt-6 w-full">
                <MessageSquare className="mr-2 h-4 w-4" /> Contact {name}
              </Button>
              <Button variant="outline" className="mt-2 w-full">
                Book a Service
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{bio}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Skills & Reputation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills (with Endorsements) */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {skills.map(skill => (
                  <div key={skill.name} className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-medium">{skill.name}</span>
                      {skill.endorsements > 0 && (
                        <span className="ml-2 text-sm text-gray-500">Endorsed by {skill.endorsements} people</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" /> Endorse
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reputation System: Reviews & Testimonials */}
          <Card>
            <CardHeader>
              <CardTitle>Reputation & Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">{review.reviewer}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

