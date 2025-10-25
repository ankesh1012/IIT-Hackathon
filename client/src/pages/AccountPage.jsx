import React, { useState } from 'react';
import { User, MapPin, BookText, Sparkles, Lock, X, Plus } from 'lucide-react';
// Import components from your UI library
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card.jsx";

// Store default profile text as constants
const DEFAULT_USERNAME = 'jane_doe';
const DEFAULT_BIO = 'Frontend developer passionate about React and creating beautiful, accessible web experiences.';
const DEFAULT_LOCATION = 'San Francisco, CA';

// --- Main AccountPage Component ---
/**
 * The Account Settings page component.
 * Note: We've renamed this from App to AccountPage.
 */
export default function AccountPage() {
  // --- State ---
  // User profile state initialized with default values
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  // Skills state
  const [skills, setSkills] = useState(['React', 'JavaScript', 'Tailwind CSS', 'Next.js', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });

  // --- Handlers ---

  /**
   * Handles adding a new skill to the list.
   */
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setStatusMessage({ message: 'Skill added!', type: 'success' });
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
    } else if (skills.includes(newSkill.trim())) {
      setStatusMessage({ message: 'Skill already added.', type: 'error' });
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
    }
  };

  /**
   * Handles removing a skill from the list by its index.
   */
  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
    setStatusMessage({ message: 'Skill removed.', type: 'success' });
    setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
  };

  /**
   * Handles the main form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage({ message: '', type: '' }); // Clear previous messages

    // --- Password Validation ---
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setStatusMessage({ message: 'New passwords do not match.', type: 'error' });
        return;
      }
      if (newPassword.length < 8) {
        setStatusMessage({ message: 'New password must be at least 8 characters long.', type: 'error' });
        return;
      }
      if (!currentPassword) {
        setStatusMessage({ message: 'Please enter your current password to change it.', type: 'error' });
        return;
      }
    }

    // --- API Call Simulation ---
    // Check if profile fields are still the default, and if so, submit an empty string
    const usernameToSubmit = username === DEFAULT_USERNAME ? '' : username;
    const bioToSubmit = bio === DEFAULT_BIO ? '' : bio;
    const locationToSubmit = location === DEFAULT_LOCATION ? '' : location;

    console.log('Submitting data to API...');
    console.log({
      username: usernameToSubmit,
      bio: bioToSubmit,
      location: locationToSubmit,
      skills,
      // Note: Only send password data if it's actually being changed.
      ...(newPassword && { currentPassword, newPassword })
    });

    // Simulate a successful API call
    setStatusMessage({ message: 'Account settings saved successfully!', type: 'success' });
    
    // Clear password fields after successful submission
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Hide success message after a few seconds
    setTimeout(() => setStatusMessage({ message: '', type: '' }), 3000);
  };

  // --- Render ---
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto">
      <Card as="form" onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Account Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          
          {/* --- Section: Profile --- */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <User size={24} className="mr-3" />
              Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => {
                    if (username === DEFAULT_USERNAME) {
                      setUsername('');
                    }
                  }}
                  onBlur={() => {
                    if (username.trim() === '') {
                      setUsername(DEFAULT_USERNAME);
                    }
                  }}
                  autoComplete="username"
                  className={username === DEFAULT_USERNAME ? 'text-muted-foreground' : ''}
                />
              </div>
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => {
                    if (location === DEFAULT_LOCATION) {
                      setLocation('');
                    }
                  }}
                  onBlur={() => {
                    if (location.trim() === '') {
                      setLocation(DEFAULT_LOCATION);
                    }
                  }}
                  placeholder="e.g., New York, NY"
                  autoComplete="address-level2"
                  className={location === DEFAULT_LOCATION ? 'text-muted-foreground' : ''}
                />
              </div>
            </div>
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center">
                <BookText size={16} className="mr-2" />
                Bio
              </Label>
              <Textarea
                id="bio"
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onFocus={() => {
                  // If the bio is the default text, clear it on click
                  if (bio === DEFAULT_BIO) {
                    setBio('');
                  }
                }}
                onBlur={() => {
                  // If the user clicks away and the field is empty,
                  // reset it to the default text.
                  if (bio.trim() === '') {
                    setBio(DEFAULT_BIO);
                  }
                }}
                placeholder="Tell us a little about yourself..."
                // Conditionally apply a 'placeholder' text color if it's the default value
                className={bio === DEFAULT_BIO ? 'text-muted-foreground' : ''}
              />
            </div>
          </div>

          <hr />

          {/* --- Section: Skills --- */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Sparkles size={24} className="mr-3" />
              Skills
            </h2>
            {/* List of current skills */}
            <div className="flex flex-wrap gap-3">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Badge variant="secondary" key={index} className="flex items-center gap-2">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => handleRemoveSkill(index)}
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={14} />
                    </Button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              )}
            </div>
            {/* Add new skill input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a new skill (e.g., Python)"
                className="flex-grow"
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                className="flex-shrink-0"
              >
                <Plus size={18} className="mr-2" />
                Add Skill
              </Button>
            </div>
          </div>

          <hr />

          {/* --- Section: Change Password --- */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Lock size={24} className="mr-3" />
              Change Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.g.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>
          
        </CardContent>

        {/* --- Footer: Actions --- */}
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            {statusMessage.message && (
              <p className={`text-sm ${statusMessage.type === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                {statusMessage.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Save All Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

