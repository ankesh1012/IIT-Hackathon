// client/src/pages/ServiceMarketplace.jsx

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, DollarSign, Zap, User, Star, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { serviceAPI, skillAPI } from '@/lib/api';
import { useAuthContext } from '@/hooks/useAuthContext';

// --- Reusable Service Card ---
const ServiceCard = ({ service, onPurchase, currentUserId }) => {
    const isOwner = service.provider._id === currentUserId;
    const isAvailable = service.isAvailable;

    return (
        <Card className="flex flex-col shadow-soft hover:shadow-medium transition-shadow border-2 border-border/50">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-primary">{service.title}</CardTitle>
                    <Badge variant="secondary" className="capitalize">{service.skill.name}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User size={14} />
                    <span>{service.provider.name}</span>
                    {service.provider.rating > 0 && (
                        <span className="flex items-center gap-1 text-secondary-dark">
                            <Star size={12} className="fill-secondary-dark" />
                            {service.provider.rating.toFixed(1)}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{service.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-0">
                <span className="text-2xl font-bold text-green-600 flex items-center">
                    <DollarSign size={20} className="mr-1" />
                    {service.price}
                </span>
                
                {isOwner ? (
                    <Button variant="outline" disabled>Your Listing</Button>
                ) : (
                    <Button 
                        variant={isAvailable ? "default" : "destructive"} 
                        onClick={() => onPurchase(service._id)} 
                        disabled={!isAvailable}
                    >
                        {isAvailable ? 'Buy Service' : 'Unavailable'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};


// --- Service Creation Form ---
const CreateListingForm = ({ skills, onListingCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillName, setSkillName] = useState('');
    const [price, setPrice] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        if (!title || !description || !skillName || !price) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            setIsLoading(false);
            return;
        }

        try {
            const data = { title, description, skillName, price: parseFloat(price) };
            await serviceAPI.createService(data);
            setMessage({ type: 'success', text: 'Service listing created successfully!' });
            setTitle('');
            setDescription('');
            setSkillName('');
            setPrice('50');
            onListingCreated();
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to create listing.';
            setMessage({ type: 'error', text: msg });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        }
    };

    return (
        <Card className="shadow-soft">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 text-secondary-dark">
                    <Plus size={24} /> List a New Service
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Service Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., WordPress Site Setup (1-Hour)" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Detailed Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What exactly does your service include?" rows="4" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="skill">Skill Category</Label>
                            <Select value={skillName} onValueChange={setSkillName}>
                                <SelectTrigger id="skill">
                                    <SelectValue placeholder="Select Primary Skill" />
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
                        
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (Credits)</Label>
                            <Input id="price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="50" />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Listing'}
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

// --- Main Service Marketplace Component ---
export default function ServiceMarketplace() {
    const { user } = useAuthContext();
    const [services, setServices] = useState([]);
    const [allSkillTags, setAllSkillTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('browse');

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const [servicesResponse, skillsResponse] = await Promise.all([
                serviceAPI.getAllServices(),
                skillAPI.getAllSkillTags(),
            ]);
            setServices(servicesResponse.data);
            setAllSkillTags(skillsResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handlePurchase = async (serviceId) => {
        if (!user) return alert('Please log in to purchase a service.');
        try {
            const confirmPurchase = window.confirm(`Confirm purchase? This will deduct ${services.find(s => s._id === serviceId)?.price} credits from your account.`);
            if (!confirmPurchase) return;
            
            const response = await serviceAPI.purchaseService(serviceId);
            alert(response.data.message);
            fetchAllData(); // Refresh data and user balance
        } catch (error) {
            const msg = error.response?.data?.message || 'Purchase failed. Check your balance.';
            alert(msg);
            console.error(error);
        }
    };

    const userListings = services.filter(s => s.provider._id === user?._id);
    const otherListings = services.filter(s => s.provider._id !== user?._id);

    return (
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 md:p-10 space-y-10">
            <h1 className="text-4xl font-bold mb-4 text-center">Skill Service Marketplace</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="browse">Browse Services</TabsTrigger>
                    <TabsTrigger value="create">List New Service</TabsTrigger>
                    <TabsTrigger value="mine">My Listings ({userListings.length})</TabsTrigger>
                </TabsList>

                {/* Tab 1: Browse Public Services */}
                <TabsContent value="browse">
                    <h2 className="text-2xl font-semibold mb-4 pt-4">Services Available Today</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto col-span-full mt-10" />
                        ) : otherListings.length > 0 ? (
                            otherListings.map(service => (
                                <ServiceCard 
                                    key={service._id} 
                                    service={service} 
                                    onPurchase={handlePurchase} 
                                    currentUserId={user?._id} 
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground col-span-full text-center">No services listed yet. Be the first!</p>
                        )}
                    </div>
                </TabsContent>
                
                {/* Tab 2: Create New Service */}
                <TabsContent value="create">
                    {user ? (
                        <CreateListingForm skills={allSkillTags} onListingCreated={fetchAllData} />
                    ) : (
                        <Card className="mt-4 p-8 text-center shadow-soft">
                            <h3 className="text-xl font-semibold">Log In to List a Service</h3>
                            <p className="text-muted-foreground">You must be logged in and have established skills to list a service.</p>
                        </Card>
                    )}
                </TabsContent>
                
                {/* Tab 3: My Listings */}
                <TabsContent value="mine">
                    <h2 className="text-2xl font-semibold mb-4 pt-4">Your Active Listings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userListings.length > 0 ? (
                            userListings.map(service => (
                                <ServiceCard 
                                    key={service._id} 
                                    service={service} 
                                    currentUserId={user?._id}
                                    onPurchase={() => {}} // No purchase action needed for own listing
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground col-span-full">You have no active service listings.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}