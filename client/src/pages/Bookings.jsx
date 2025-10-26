// client/src/pages/Bookings.jsx

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar as CalendarIcon, DollarSign, Clock, BookOpen, Users, Zap, Mail, User as UserIcon, LogIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { sessionAPI, skillAPI } from '@/lib/api';
import { useAuthContext } from '@/hooks/useAuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isSameDay, isPast } from 'date-fns';

// --- Session Creation Form Component (Unchanged) ---
const CreateSessionForm = ({ skills, onSessionCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillName, setSkillName] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [price, setPrice] = useState('10');
  const [maxAttendees, setMaxAttendees] = useState('5');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (!title || !skillName || !dateTime) {
      setMessage({ type: 'error', text: 'Title, Skill, and Date are required.' });
      setIsLoading(false);
      return;
    }
    if (new Date(dateTime) < new Date()) {
        setMessage({ type: 'error', text: 'Cannot schedule a session in the past.' });
        setIsLoading(false);
        return;
    }

    try {
      const sessionData = {
        title,
        description,
        skillName,
        dateTime: dateTime.toISOString(),
        durationMinutes: parseInt(durationMinutes),
        price: parseFloat(price),
        maxAttendees: parseInt(maxAttendees),
      };

      await sessionAPI.createSession(sessionData);
      setMessage({ type: 'success', text: 'Session created successfully!' });

      // Reset form
      setTitle('');
      setDescription('');
      setSkillName('');
      setDateTime(new Date());
      
      onSessionCreated(); // Trigger parent reload
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create session.';
      setMessage({ type: 'error', text: msg });
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
          <Zap size={24} /> Schedule a New Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Intro to React Hooks" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will the attendees learn?" rows="3" />
          </div>

          {/* Skill Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skill">Skill Taught</Label>
              <Select value={skillName} onValueChange={setSkillName}>
                <SelectTrigger id="skill">
                  <SelectValue placeholder="Select a Skill" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((skill) => (
                    <SelectItem key={skill.name} value={skill.name}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input id="price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="10" />
            </div>
          </div>

          {/* Date and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <DatePicker
                selected={dateTime}
                onChange={(date) => setDateTime(date)}
                showTimeSelect
                dateFormat="MMM d, yyyy h:mm aa"
                className="w-full border p-2 rounded-md bg-card focus:ring-2 focus:ring-primary focus:border-primary"
                minDate={new Date()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Select value={durationMinutes} onValueChange={setDurationMinutes}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Max Attendees */}
          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Max Attendees</Label>
            <Input id="maxAttendees" type="number" min="1" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} placeholder="5" />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Schedule Session'}
          </Button>
          
          {message.text && (
            <p className={`text-sm font-medium ${message.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
              {message.text}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};


// --- Sessions List and Calendar Component (Unchanged) ---
const SessionsView = ({ sessions, onJoinSession, currentUserId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  
  // Filtering for Tabs
  const allUserSessions = sessions.filter(session => session.instructor._id === currentUserId || session.attendees.map(a => a._id).includes(currentUserId));
  
  const sessionsOnSelectedDay = allUserSessions.filter(session => 
    isSameDay(new Date(session.dateTime), selectedDate)
  );

  // Calendar highlights
  const dateHighlights = allUserSessions.map(session => ({
    date: new Date(session.dateTime),
    className: isPast(new Date(session.dateTime)) ? 'bg-muted/50 rounded-full' : 'font-bold bg-primary/20 rounded-full',
  }));

  // Handle clicking a date in the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSession(null); // Clear session detail when date changes
  };
  
  // Filter sessions for the tabs
  const filterSessions = (status) => {
      const now = new Date();
      return sessions.filter(session => {
          const isUserInstructor = session.instructor._id === currentUserId;
          const isUserAttendee = session.attendees.some(a => a._id === currentUserId);
          const isPastSession = isPast(new Date(session.dateTime));
          
          if (status === 'upcoming') {
              return (isUserInstructor || isUserAttendee) && !isPastSession;
          } else if (status === 'history') {
              return isPastSession && (isUserInstructor || isUserAttendee);
          } else if (status === 'teaching') {
              return isUserInstructor && !isPastSession;
          }
          return false;
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Column 1: Calendar View */}
      <Card className="lg:col-span-1 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarIcon size={20} /> My Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Custom DatePicker styling using className for Tailwind context */}
          <style jsx="true">{`
            .react-datepicker {
              border: none;
              font-family: inherit;
              width: 100%;
            }
            .react-datepicker__header {
              background-color: var(--card);
              border-bottom: 1px solid var(--border);
            }
            .react-datepicker__day-name, .react-datepicker__day {
              margin: 0.3rem;
            }
          `}</style>
          <div className='flex justify-center'>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              highlightDates={dateHighlights}
              dayClassName={(date) => {
                const highlight = dateHighlights.find(h => isSameDay(h.date, date));
                return highlight ? highlight.className : undefined;
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Column 2 & 3: Sessions List and Details */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* List of Sessions for Selected Day */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl">
              Sessions on {format(selectedDate, 'MMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessionsOnSelectedDay.length > 0 ? (
              sessionsOnSelectedDay.map(session => (
                <div 
                  key={session._id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSession?._id === session._id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <p className="font-semibold">{session.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(session.dateTime), 'h:mm aa')} - {session.skill.name}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No sessions scheduled for this day.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Session Details */}
        {selectedSession && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedSession.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-primary-dark">
                  <CalendarIcon size={16} />
                  <span>{format(new Date(selectedSession.dateTime), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{selectedSession.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>${selectedSession.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span className="capitalize">{selectedSession.skill.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{selectedSession.attendees.length}/{selectedSession.maxAttendees} spots</span>
                </div>
              </div>
              
              <p className="text-muted-foreground pt-2">{selectedSession.description || 'No description provided.'}</p>
              
              <p className="font-semibold mt-4">Instructor: {selectedSession.instructor.name}
                {selectedSession.instructor._id === currentUserId ? ' (You)' : ''}
              </p>
              
              <p className="font-semibold mt-4">Attendees:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSession.attendees.length > 0 ? selectedSession.attendees.map(attendee => (
                  <Badge 
                    key={attendee._id} 
                    variant={attendee._id === currentUserId ? "default" : "outline"}
                  >
                    {attendee.name}{attendee._id === currentUserId && ' (You)'}
                  </Badge>
                )) : (<p className="text-sm text-muted-foreground">No attendees yet.</p>)}
              </div>
              
            </CardContent>
          </Card>
        )}

        {/* Tabbed View of Sessions (Complementary to Calendar) */}
        <h2 className="text-2xl font-semibold pt-4">Session Management</h2>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teaching">Teaching (Upcoming)</TabsTrigger>
            <TabsTrigger value="upcoming">Attending (Upcoming)</TabsTrigger>
            <TabsTrigger value="history">History (Completed)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teaching">
              {filterSessions('teaching').length > 0 ? (
                  <div className="grid gap-4 mt-4">
                      {filterSessions('teaching').map(session => (
                           <SessionCard key={session._id} session={session} type="teaching" onJoinSession={onJoinSession} currentUserId={currentUserId} />
                      ))}
                  </div>
              ) : (<p className='mt-4 text-muted-foreground'>No upcoming sessions where you are the instructor.</p>)}
          </TabsContent>

          <TabsContent value="upcoming">
              {filterSessions('upcoming').length > 0 ? (
                  <div className="grid gap-4 mt-4">
                      {filterSessions('upcoming').map(session => (
                           <SessionCard key={session._id} session={session} type="attending" onJoinSession={onJoinSession} currentUserId={currentUserId} />
                      ))}
                  </div>
              ) : (<p className='mt-4 text-muted-foreground'>No upcoming sessions you are attending.</p>)}
          </TabsContent>

          <TabsContent value="history">
              {filterSessions('history').length > 0 ? (
                  <div className="grid gap-4 mt-4">
                      {filterSessions('history').map(session => (
                           <SessionCard key={session._id} session={session} type="history" onJoinSession={onJoinSession} currentUserId={currentUserId} />
                      ))}
                  </div>
              ) : (<p className='mt-4 text-muted-foreground'>No completed sessions in your history.</p>)}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

// --- Reusable Session Card for Tabs and Browse ---
const SessionCard = ({ session, type, onJoinSession, currentUserId }) => {
    const isInstructor = session.instructor._id === currentUserId;
    const isAttending = session.attendees.map(a => a._id).includes(currentUserId);
    const isPastSession = isPast(new Date(session.dateTime));
    const isFull = session.attendees.length >= session.maxAttendees;

    // Determine the variant based on who created/joined
    const cardVariant = isInstructor ? "border-primary-dark" : isAttending ? "border-green-600" : "border-border";
    
    // Determine the button text/action
    let buttonText = "View Details";
    let buttonAction = null;
    let buttonVariant = "outline";
    let buttonDisabled = false;

    if (type === 'browse') {
        if (isInstructor) {
            buttonText = "My Session";
            buttonDisabled = true;
        } else if (isAttending) {
            buttonText = "Already Joined";
            buttonDisabled = true;
        } else if (isFull) {
            buttonText = "Session Full";
            buttonDisabled = true;
        } else {
            buttonText = `Join for $${session.price}`;
            buttonAction = () => onJoinSession(session._id);
            buttonVariant = "default";
        }
    } else if (type === 'history') {
        buttonText = "Review";
        buttonVariant = "secondary";
        buttonDisabled = true; // Placeholder for review logic
    } else if (type === 'teaching') {
        buttonText = "Manage Session";
    }

    return (
        <Card className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 shadow-sm hover:shadow-md transition-shadow ${cardVariant}`}>
            <div className="flex-1 space-y-1">
                <CardTitle className="text-lg font-semibold">{session.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <CalendarIcon size={14} />
                    <span>{format(new Date(session.dateTime), 'MMM d, h:mm a')}</span>
                    {(isInstructor || isAttending) && <Badge variant="secondary">{isInstructor ? 'Teaching' : 'Attending'}</Badge>}
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <UserIcon size={14} />
                    <span>{isInstructor ? `Attendees: ${session.attendees.length}` : `Instructor: ${session.instructor.name}`}</span>
                </div>
            </div>
            <CardFooter className="mt-3 sm:mt-0 p-0 flex flex-col items-start sm:items-end gap-2">
                <span className="text-lg font-bold text-primary">${session.price}</span>
                <Button 
                    variant={buttonVariant} 
                    size="sm" 
                    onClick={buttonAction} 
                    disabled={buttonDisabled}
                >
                    {buttonText}
                </Button>
            </CardFooter>
        </Card>
    );
};


// --- Main Bookings Page Component (MODIFIED) ---
export default function Bookings() {
  const { user } = useAuthContext();
  const [userSessions, setUserSessions] = useState([]); // Sessions involving the user
  const [publicSessions, setPublicSessions] = useState([]); // All public sessions
  const [allSkillTags, setAllSkillTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch user sessions, public sessions, and skill tags
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const skillsResponse = await skillAPI.getAllSkillTags();
      setAllSkillTags(skillsResponse.data);

      let fetchedUserSessions = [];
      if (user) {
        // Fetch sessions where user is instructor or attendee
        const sessionsResponse = await sessionAPI.getSessionsForUser();
        fetchedUserSessions = sessionsResponse.data;
        setUserSessions(fetchedUserSessions);
      }
      
      // Fetch public sessions (all future sessions)
      const publicResponse = await sessionAPI.getAllPublicSessions();
      setPublicSessions(publicResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const handleSessionCreated = () => {
      fetchAllData(); // Refresh data after creation
  };

  const handleJoinSession = async (sessionId) => {
    if (!user) return alert('Please log in to join a session.');
    try {
      // NOTE: Placeholder for actual payment logic here
      const confirmJoin = window.confirm("Are you sure you want to join this session? This action is irreversible.");
      if (!confirmJoin) return;
      
      await sessionAPI.joinSession(sessionId);
      alert('Successfully joined session!');
      fetchAllData(); // Refresh data
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to join session.';
      alert(msg);
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="ml-4 text-lg text-muted-foreground">Loading scheduling data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 md:p-10 space-y-10">
      <h1 className="text-4xl font-bold mb-4 text-center">Session Dashboard</h1>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="create">Schedule New</TabsTrigger>
          <TabsTrigger value="browse">Browse Sessions</TabsTrigger>
          {/* Add a placeholder for pending if needed later */}
          {/* <TabsTrigger value="pending">Requests</TabsTrigger> */}
        </TabsList>

        {/* Tab 1: My Calendar and Sessions */}
        <TabsContent value="schedule">
            {user ? (
                // FIX: Pass userSessions to SessionsView
                <SessionsView sessions={userSessions} onJoinSession={handleJoinSession} currentUserId={user._id} />
            ) : (
                <Card className="mt-4 p-8 text-center shadow-soft">
                    <h3 className="text-xl font-semibold">Log In to See Your Schedule</h3>
                    <p className="text-muted-foreground">Your personal calendar and attended sessions will appear here.</p>
                </Card>
            )}
        </TabsContent>

        {/* Tab 2: Create New Session */}
        <TabsContent value="create">
            {user ? (
                <CreateSessionForm skills={allSkillTags} onSessionCreated={handleSessionCreated} />
            ) : (
                <Card className="mt-4 p-8 text-center shadow-soft">
                    <h3 className="text-xl font-semibold">Log In to Schedule</h3>
                    <p className="text-muted-foreground">You must be logged in to offer a session.</p>
                </Card>
            )}
        </TabsContent>

        {/* Tab 3: Browse Public Sessions (NEW) */}
        <TabsContent value="browse">
            <h2 className="text-3xl font-semibold mb-4">Join an Upcoming Session</h2>
            <div className="grid gap-4">
                {publicSessions.length > 0 ? publicSessions.map(session => (
                    <SessionCard 
                        key={session._id} 
                        session={session} 
                        type="browse" 
                        onJoinSession={handleJoinSession} 
                        currentUserId={user?._id}
                    />
                )) : (
                    <p className="text-muted-foreground">No public sessions available right now. Check back later!</p>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}