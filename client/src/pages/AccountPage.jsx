// client/src/pages/AccountPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { User, MapPin, BookText, Sparkles, Lock, X, Plus, Heart } from 'lucide-react'; // Added Heart icon
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card.jsx";
import { useAuthContext } from '@/hooks/useAuthContext.jsx';
import { userAPI, skillAPI } from '@/lib/api.js';

// --- Main AccountPage Component ---
export default function AccountPage() {
  const { user, token, login } = useAuthContext();

  // --- State ---
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  
  // Offered Skills
  const [skills, setSkills] = useState([]); 
  const [newSkill, setNewSkill] = useState(''); 
  
  // --- NEW STATE: Learning Goals ---
  const [learningSkills, setLearningSkills] = useState([]);
  const [newLearningSkill, setNewLearningSkill] = useState('');
  
  const [allSkills, setAllSkills] = useState([]); 
  const [suggestions, setSuggestions] = useState([]); 
  const [isSkillInputFocused, setIsSkillInputFocused] = useState(false); 
  const [activeInput, setActiveInput] = useState(null); // 'offered' or 'learning'

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const skillsInputRef = useRef(null);

  // 4. Populate form with user data
  useEffect(() => {
    if (user) {
      setUsername(user.name || '');
      setBio(user.bio || 'Tell us a little about yourself...');
      setLocation(user.location || '');
      // --- MODIFIED: Handle both skill lists ---
      setSkills(user.skills ? user.skills.map(skill => skill.name) : []);
      setLearningSkills(user.learningSkills ? user.learningSkills.map(skill => skill.name) : []);
    }
  }, [user]);

  // --- NEW EFFECT: Fetch all skills on mount (Unchanged) ---
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

  // --- NEW: Close suggestions when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillsInputRef.current && !skillsInputRef.current.contains(event.target)) {
        setIsSkillInputFocused(false);
        setSuggestions([]);
        setActiveInput(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- Reusable Handler for Adding Skills ---
  const handleAddSkill = (skillName, listType) => {
    const trimmedName = skillName.trim().toLowerCase();
    const currentList = listType === 'offered' ? skills : learningSkills;
    const setList = listType === 'offered' ? setSkills : setLearningSkills;
    
    if (trimmedName && !currentList.includes(trimmedName)) {
      setList([...currentList, trimmedName]);
      if (listType === 'offered') setNewSkill('');
      else setNewLearningSkill('');

      setSuggestions([]);
      setIsSkillInputFocused(false);
      setActiveInput(null);
      setStatusMessage({ message: 'Goal added (click Save)!', type: 'success' });
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
    } else if (currentList.includes(trimmedName)) {
      setStatusMessage({ message: 'Skill already added.', type: 'error' });
      setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
    }
  };

  // --- Reusable Handler for Removing Skills ---
  const handleRemoveSkill = (indexToRemove, listType) => {
    const currentList = listType === 'offered' ? skills : learningSkills;
    const setList = listType === 'offered' ? setSkills : setLearningSkills;

    setList(currentList.filter((_, index) => index !== indexToRemove));
    setStatusMessage({ message: 'Skill removed (click Save).', type: 'success' });
    setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
  };
  
  // --- Universal Input Change and Autocomplete Handler ---
  const handleUniversalInputChange = (e, listType) => {
    const value = e.target.value;
    const currentList = listType === 'offered' ? skills : learningSkills;

    if (listType === 'offered') setNewSkill(value);
    else setNewLearningSkill(value);
    
    setIsSkillInputFocused(true);
    setActiveInput(listType);

    if (value.length > 0) {
      const filteredSuggestions = allSkills
        .filter(skill => 
          skill.toLowerCase().startsWith(value.toLowerCase()) &&
          !currentList.includes(skill)
        )
        .slice(0, 10);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // --- Universal Suggestion Click Handler ---
  const handleSuggestionClick = (suggestion) => {
    // Determine which list to add the skill to based on the active input
    if (activeInput === 'offered') {
      handleAddSkill(suggestion, 'offered');
    } else if (activeInput === 'learning') {
      handleAddSkill(suggestion, 'learning');
    }
  };


  // --- handleSubmit is MODIFIED to send learningSkills ---
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

    try {
      const updatedData = {
        username: username,
        bio: bio,
        location: location,
        skills: skills, // Send offered skills
        learningSkills: learningSkills, // --- NEW: Send learning goals ---
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
            {/* ... (Profile inputs) ... */}
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
          
          {/* --- Skills Container: Wrap both skill sections in one Ref container --- */}
          <div ref={skillsInputRef}>

            {/* --- Section: Skills I Offer (MODIFIED) --- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Sparkles size={24} className="mr-3" />
                Skills I Offer
              </h2>
              
              {/* List of Offered Skills */}
              <div className="flex flex-wrap gap-3">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <Badge variant="secondary" key={`skill-${index}`} className="flex items-center gap-2 capitalize">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => handleRemoveSkill(index, 'offered')}
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
              
              {/* Add new skill input (MODIFIED for handler) */}
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    value={newSkill}
                    onChange={(e) => handleUniversalInputChange(e, 'offered')}
                    onFocus={() => setActiveInput('offered')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkill, 'offered');
                      }
                    }}
                    placeholder="Add a skill you can teach (e.g., Python)"
                    className="flex-grow"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddSkill(newSkill, 'offered')}
                    className="flex-shrink-0"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Skill
                  </Button>
                </div>
              </div>
            </div>

            <hr className='my-8' />

            {/* --- NEW SECTION: Skills I Want to Learn --- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Heart size={24} className="mr-3" />
                Skills I Want to Learn
              </h2>
              
              {/* List of Learning Skills */}
              <div className="flex flex-wrap gap-3">
                {learningSkills.length > 0 ? (
                  learningSkills.map((skill, index) => (
                    <Badge variant="secondary" key={`learning-${index}`} className="flex items-center gap-2 capitalize">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => handleRemoveSkill(index, 'learning')}
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={14} />
                      </Button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">What do you want to learn?</p>
                )}
              </div>
              
              {/* Add new learning skill input */}
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    value={newLearningSkill}
                    onChange={(e) => handleUniversalInputChange(e, 'learning')}
                    onFocus={() => setActiveInput('learning')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newLearningSkill, 'learning');
                      }
                    }}
                    placeholder="Add a skill you want to learn (e.g., Figma)"
                    className="flex-grow"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddSkill(newLearningSkill, 'learning')}
                    className="flex-shrink-0"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Goal
                  </Button>
                </div>
              </div>
            </div>
            {/* --- Suggestions Box (UNIVERSAL) --- */}
            {isSkillInputFocused && suggestions.length > 0 && activeInput && (
              <div className={`absolute z-20 w-full sm:w-[calc(100%-120px)] mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto ${activeInput === 'learning' ? 'top-[440px]' : 'top-[240px]'}`}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-muted cursor-pointer text-sm capitalize"
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

          </div> {/* End Skills Container */}


          <hr />

          {/* --- Section: Change Password (Unchanged) --- */}
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