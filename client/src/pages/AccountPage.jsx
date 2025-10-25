import React, { useState, useEffect } from 'react';
import { User, MapPin, BookText, Sparkles, Lock, X, Plus, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card.jsx";

// 1. Import the authentication context hook
import { useAuthContext } from '@/hooks/useAuthContext.jsx';
// 2. Import your userAPI
import { userAPI } from '@/lib/api.js'; // <-- IMPORT THE API

// --- Main AccountPage Component ---
export default function AccountPage() {
  // 3. Get user, token, and the login function from context
  const { user, token, login } = useAuthContext(); // <-- Get token and login

  // --- State ---
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState([]); // <-- Initialize as empty
  const [newSkill, setNewSkill] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false); // <-- Add loading state

  // 4. Populate form with user data
  useEffect(() => {
    if (user) {
      setUsername(user.name || '');
      setBio(user.bio || 'Tell us a little about yourself...');
      setLocation(user.location || '');
      // Load skills. Your backend populates skills as objects,
      // but we just want the names for the frontend state.
      setSkills(user.skills ? user.skills.map(skill => skill.name) : []);
    }
  }, [user]);

  // --- Handlers ---
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setStatusMessage({ message: 'Skill added (click Save to confirm)!', type: 'success' });
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
    } else if (skills.includes(newSkill.trim())) {
      setStatusMessage({ message: 'Skill already added.', type: 'error' });
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
    setStatusMessage({ message: 'Skill removed (click Save to confirm).', type: 'success' });
    setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
  };

  /**
   * Handles the main form submission.
   */
  const handleSubmit = async (e) => { // <-- Make this async
    console.log("Submitting form..."); // <-- Your console log
    e.preventDefault();
    setStatusMessage({ message: '', type: '' });
    setIsLoading(true); // <-- Set loading

    // --- Password Validation ---
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setStatusMessage({ message: 'New passwords do not match.', type: 'error' });
        setIsLoading(false);
        return;
      }
      if (newPassword.length < 8) { // Your model has minlength 6, but 8 is safer
        setStatusMessage({ message: 'New password must be at least 8 characters long.', type: 'error' });
        setIsLoading(false);
        return;
      }
      if (!currentPassword) {
        setStatusMessage({ message: 'Please enter your current password to change it.', type: 'error' });
        setIsLoading(false);
        return;
      }
    }

    // --- 5. REAL API Call ---
    try {
      // Build the payload
      const updatedData = {
        username: username, // Your backend controller maps this to 'name'
        bio: bio,
        location: location,
        skills: skills, // Send the array of strings
      };

      // Add password fields only if they are filled
      if (newPassword && currentPassword) {
        updatedData.currentPassword = currentPassword;
        updatedData.newPassword = newPassword;
      }

      // Call the API
      const response = await userAPI.updateMe(updatedData);
      
      // `response.data` is the *updated user object* from the backend

      // --- 6. Update Global State ---
      // This is the most important step!
      // Use the 'login' function to update AuthContext and localStorage
      login(response.data, token);

      // Show success message
      setStatusMessage({ message: 'Account settings saved successfully!', type: 'success' });
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      // Show error message from API
      const message = error.response?.data?.message || 'Failed to update settings.';
      setStatusMessage({ message, type: 'error' });
    } finally {
      setIsLoading(false); // <-- Stop loading
      
      // Hide status message after a few seconds
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 3000);
    }
  };

  // --- Render ---
  if (!user) {
    return <div>Loading account details...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto">
      
      {/* --- FIX PART 1 ---
        Remove the onSubmit handler from the <Card> component.
        The 'as="form"' prop is fine, but the onSubmit event isn't firing.
      */}
      <Card as="form">
        
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Account Settings
          </CardTitle>
        </CardHeader>

        {/* --- CardContent is unchanged --- */}
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
                  autoComplete="username"
                />
              </div>
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, NY"
                  autoComplete="address-level2"
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
                placeholder="Tell us a little about yourself..."
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
                    {/* Display the skill name. If skill is an object (from initial load), use skill.name. If it's a string (just added), use skill. */}
                    {typeof skill === 'object' ? skill.name : skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => handleRemoveSkill(index)}
                      aria-label={`Remove ${typeof skill === 'object' ? skill.name : skill}`}
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              <p className={`text-sm ${statusMessage.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
                {statusMessage.message}
              </p>
            )}
          </div>

          {/* --- FIX PART 2 ---
            Change type="submit" to type="button"
            Add the onClick={handleSubmit} handler directly to the button.
          */}
          <Button 
            type="button" 
            onClick={handleSubmit} 
            className="w-full sm:w-auto" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}