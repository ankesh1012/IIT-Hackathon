// client/src/pages/AccountPage.jsx

import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { User, MapPin, BookText, Sparkles, Lock, X, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card.jsx";
import { useAuthContext } from '@/hooks/useAuthContext.jsx';
// Import both userAPI and new skillAPI
import { userAPI, skillAPI } from '@/lib/api.js';

// --- Main AccountPage Component ---
export default function AccountPage() {
  // 3. Get user, token, and the login function from context
  const { user, token, login } = useAuthContext();

  // --- State ---
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState([]); // User's current skills
  const [newSkill, setNewSkill] = useState(''); // Text in the input box
  
  // --- NEW STATE FOR AUTOCOMPLETE ---
  const [allSkills, setAllSkills] = useState([]); // All skills from DB
  const [suggestions, setSuggestions] = useState([]); // Filtered suggestions
  const [isSkillInputFocused, setIsSkillInputFocused] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Ref to detect clicks outside the skills input area
  const skillsInputRef = useRef(null);

  // 4. Populate form with user data
  useEffect(() => {
    if (user) {
      setUsername(user.name || '');
      setBio(user.bio || 'Tell us a little about yourself...');
      setLocation(user.location || '');
      setSkills(user.skills ? user.skills.map(skill => skill.name) : []);
    }
  }, [user]);

  // --- NEW EFFECT: Fetch all skills on mount ---
  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const response = await skillAPI.getAllSkillTags();
        // Store just the names for easier filtering
        setAllSkills(response.data.map(skill => skill.name));
      } catch (error) {
        console.error("Failed to fetch skills list:", error);
      }
    };
    fetchAllSkills();
  }, []); // Runs once on component mount

  // --- NEW: Close suggestions when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillsInputRef.current && !skillsInputRef.current.contains(event.target)) {
        setIsSkillInputFocused(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- MODIFIED: handleAddSkill now takes a name ---
  const handleAddSkill = (skillName) => {
    const trimmedName = skillName.trim().toLowerCase(); // Standardize to lowercase
    if (trimmedName && !skills.includes(trimmedName)) {
      setSkills([...skills, trimmedName]);
      setNewSkill('');
      setSuggestions([]); // Clear suggestions
      setIsSkillInputFocused(false); // Hide box
      setStatusMessage({ message: 'Skill added (click Save)!', type: 'success' });
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
    } else if (skills.includes(trimmedName)) {
      setStatusMessage({ message: 'Skill already added.', type: 'error' });
      setNewSkill('');
      setSuggestions([]);
      setIsSkillInputFocused(false);
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
    setStatusMessage({ message: 'Skill removed (click Save).', type: 'success' });
    setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
  };

  // --- NEW: Handle typing in the skill input ---
  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setNewSkill(value);
    setIsSkillInputFocused(true);

    if (value.length > 0) {
      const filteredSuggestions = allSkills
        .filter(skill => 
          skill.toLowerCase().startsWith(value.toLowerCase()) && // Check startsWith
          !skills.includes(skill) // Don't suggest skills already added
        )
        .slice(0, 10); // Show max 10 suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // --- NEW: Handle clicking a suggestion ---
  const handleSuggestionClick = (skillName) => {
    handleAddSkill(skillName); // Add skill directly on click
  };

  // --- handleSubmit is unchanged, it's already correct ---
  const handleSubmit = async (e) => {
    console.log("Submitting form...");
    e.preventDefault();
    setStatusMessage({ message: '', type: '' });
    setIsLoading(true);

    // ... (Password Validation is unchanged) ...
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setStatusMessage({ message: 'New passwords do not match.', type: 'error' });
        setIsLoading(false);
        return;
      }
      if (newPassword.length < 8) {
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

    // --- API Call is unchanged ---
    try {
      const updatedData = {
        username: username,
        bio: bio,
        location: location,
        skills: skills, // Send the array of strings
      };

      if (newPassword && currentPassword) {
        updatedData.currentPassword = currentPassword;
        updatedData.newPassword = newPassword;
      }

      const response = await userAPI.updateMe(updatedData);
      
      login(response.data, token); // Update global state

      setStatusMessage({ message: 'Account settings saved successfully!', type: 'success' });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update settings.';
      setStatusMessage({ message, type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 3000);
    }
  };

  // --- Render ---
  if (!user) {
    return <div>Loading account details...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto">
      <Card as="form">
        
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Account Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          
          {/* --- Section: Profile (Unchanged) --- */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <User size={24} className="mr-3" />
              Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
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

          {/* --- Section: Skills (MODIFIED) --- */}
          <div className="space-y-6" ref={skillsInputRef}> {/* Add ref here */}
            <h2 className="text-2xl font-semibold flex items-center">
              <Sparkles size={24} className="mr-3" />
              Skills
            </h2>
            
            {/* List of current skills (Unchanged, but render logic simplified) */}
            <div className="flex flex-wrap gap-3">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Badge variant="secondary" key={index} className="flex items-center gap-2 capitalize">
                    {/* The state `skills` is just strings, so render `skill` */}
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
            
            {/* Add new skill input (MODIFIED for autocomplete) */}
            <div className="relative"> {/* NEW: Relative container for suggestions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  value={newSkill}
                  onChange={handleSkillInputChange} // Use new handler
                  onFocus={() => setIsSkillInputFocused(true)} // Show on focus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkill);
D                    }
                  }}
                  placeholder="Type to search skills..."
                  className="flex-grow"
                  autoComplete="off" // Disable browser autocomplete
                />
                <Button
                  type="button"
                  onClick={() => handleAddSkill(newSkill)} // Pass newSkill
                  className="flex-shrink-0"
                >
                  <Plus size={18} className="mr-2" />
                  Add Skill
                </Button>
              </div>

              {/* --- NEW: Suggestions Box --- */}
              {isSkillInputFocused && suggestions.length > 0 && (
                <div className="absolute z-10 w-full sm:w-[calc(100%-120px)] mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-muted cursor-pointer text-sm capitalize"
                      // Use onMouseDown to fire before the input blurs
                      onMouseDown={(e) => {
                        e.preventDefault(); 
                        handleSuggestionClick(suggestion);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr />

          {/* --- Section: Change Password (Unchanged) --- */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Lock size={24} className="mr-3" />
              Change Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ... (password inputs are unchanged) ... */}
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

        {/* --- Footer: Actions (Unchanged) --- */}
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            {statusMessage.message && (
              <p className={`text-sm ${statusMessage.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
                {statusMessage.message}
              </p>
            )}
          </div>
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