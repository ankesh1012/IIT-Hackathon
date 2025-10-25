import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { User, Shield, Bell } from 'lucide-react';

/**
 * Settings Page
 * Manages user account, notifications, and profile verification.
 */
export default function Settings() {
  
  // TODO: Fetch user settings from API
  const isVerified = false; // Mock data

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-lg text-gray-600">Manage your account and preferences.</p>
      </header>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account"><User className="mr-2 h-4 w-4" />Account</TabsTrigger>
          <TabsTrigger value="verification"><Shield className="mr-2 h-4 w-4" />Verification</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
        </TabsList>
        
        {/* Account Settings Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jane.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="New York, NY" />
              </div>
              <Button className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab (Verified Profiles) */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Profile Verification</CardTitle>
              <CardDescription>Verify your identity for peace of mind and community trust.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isVerified ? (
                <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Your profile is verified.</span>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-lg">Identity Verification</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a government-issued ID to verify your identity. This adds a
                    "Verified" badge to your profile. (This would use a secure 3rd-party service).
                  </p>
                  <Button>Start Identity Verification</Button>
                </div>
              )}
              
              <hr />

              <div>
                <h3 className="font-semibold text-lg">Skill Validation</h3>
                <p className="text-gray-600 mb-4">
                  Upload certificates or licenses to validate your professional skills.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Plumbing License</span>
                    <Button variant="outline" size="sm">Upload File</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Gardening Course Certificate</span>
                    <Button variant="outline" size="sm">Upload File</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
           <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TODO: Add Checkbox components from your UI library */}
              <p>Notification options would go here (e.g., Email, Push, etc.)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

