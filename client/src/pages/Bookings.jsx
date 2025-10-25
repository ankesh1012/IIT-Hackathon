import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Avatar } from '../components/ui/avatar.jsx';
import { Check, X } from 'lucide-react';

// TODO: Import a calendar library like 'react-big-calendar' or 'FullCalendar'
// For this example, we'll just show the booking management tabs.

// Mock Data
const pendingRequests = [
  { id: 1, user: 'John Smith', service: 'Math Tutoring', date: '2025-11-10 @ 4:00 PM', avatar: 'https://placehold.co/100x100/E2E8F0/64748B?text=JS' },
];
const upcomingBookings = [
  { id: 2, user: 'Jane Doe', service: 'Gardening Help', date: '2025-11-12 @ 10:00 AM', avatar: 'https://placehold.co/100x100/E2E8F0/64748B?text=JD' },
];
const completedBookings = [
  { id: 3, user: 'Alex Johnson', service: 'Painting', date: '2025-10-15 @ 9:00 AM', reviewed: true, avatar: 'https://placehold.co/100x100/E2E8F0/64748B?text=AJ' },
];

/**
 * Bookings Page (Easy Scheduling)
 * Manages pending, upcoming, and completed bookings.
 * This would also feature a main calendar view.
 */
export default function Bookings() {
  
  // TODO: Fetch all booking data from API in a useEffect

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">My Bookings & Calendar</h1>
        <p className="text-lg text-gray-600">Manage your schedule and appointments.</p>
      </header>

      {/* Calendar View Placeholder */}
      <div className="mb-8 p-8 h-96 bg-white rounded-lg shadow flex items-center justify-center">
        <p className="text-gray-500 text-xl">[Full Calendar Component Would Go Here]</p>
        {/* TODO: Add a library like react-big-calendar and feed it booking data */}
      </div>

      {/* Booking Management Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        {/* Pending Requests Tab */}
        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingRequests.map(booking => (
              <BookingCard key={booking.id} booking={booking} type="pending" />
            ))}
            {pendingRequests.length === 0 && <p>No pending requests.</p>}
          </div>
        </TabsContent>

        {/* Upcoming Bookings Tab */}
        <TabsContent value="upcoming">
           <div className="grid gap-4">
            {upcomingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} type="upcoming" />
            ))}
            {upcomingBookings.length === 0 && <p>No upcoming bookings.</p>}
          </div>
        </TabsContent>

        {/* Booking History Tab */}
        <TabsContent value="history">
           <div className="grid gap-4">
            {completedBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} type="history" />
            ))}
            {completedBookings.length === 0 && <p>No completed bookings.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Reusable Booking Card component
 */
function BookingCard({ booking, type }) {
  // TODO: Implement handleAccept, handleDecline, handleCancel, handleReview
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={booking.avatar} alt={booking.user} className="h-12 w-12 rounded-full" />
          <div>
            <CardTitle className="text-lg">{booking.service}</CardTitle>
            <p className="text-sm text-gray-500">with {booking.user}</p>
          </div>
        </div>
        <span className="text-sm font-medium">{booking.date}</span>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        {type === 'pending' && (
          <>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
              <X className="mr-2 h-4 w-4" /> Decline
            </Button>
            <Button size="sm">
              <Check className="mr-2 h-4 w-4" /> Accept
            </Button>
          </>
        )}
        {type === 'upcoming' && (
          <Button variant="outline" size="sm">Cancel</Button>
        )}
        {type === 'history' && (
          <Button variant="outline" size="sm" disabled={booking.reviewed}>
            {booking.reviewed ? 'Review Submitted' : 'Leave a Review'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

