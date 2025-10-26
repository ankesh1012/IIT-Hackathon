// client/src/pages/Projects.jsx

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Plus, Users, Loader2, Zap } from 'lucide-react';
import { projectAPI, skillAPI } from '@/lib/api';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// --- Project Creation Form Component (Unchanged) ---
const CreateProjectForm = ({ skills, onProjectCreated }) => {
    const { user } = useAuthContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [volunteersNeeded, setVolunteersNeeded] = useState('5');
    const [location, setLocation] = useState(user?.location || '');
    const [requiredSkill, setRequiredSkill] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        if (!title || !description || !requiredSkill || !volunteersNeeded) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            setIsLoading(false);
            return;
        }

        try {
            const projectData = {
                title,
                description,
                skills: [requiredSkill], 
                volunteersNeeded: parseInt(volunteersNeeded),
                location,
            };

            await projectAPI.createProject(projectData);
            setMessage({ type: 'success', text: 'Project proposed successfully!' });

            // Reset form
            setTitle('');
            setDescription('');
            setVolunteersNeeded('5');
            setRequiredSkill('');
            
            onProjectCreated(); 
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to propose project.';
            setMessage({ type: 'error', text: msg });
            console.error(error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        }
    };

    return (
        <Card className="shadow-soft mt-6">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                    <Zap size={24} /> New Project Proposal
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Local Library Clean-up Day" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Project Details / Goals</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain what the project involves and the desired outcome." rows="4" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="skill">Main Skill Required</Label>
                            <Select value={requiredSkill} onValueChange={setRequiredSkill}>
                                <SelectTrigger id="skill">
                                    <SelectValue placeholder="Select Skill" />
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
                            <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
                            <Input id="volunteersNeeded" type="number" min="1" value={volunteersNeeded} onChange={(e) => setVolunteersNeeded(e.target.value)} placeholder="5" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="location">Project Location</Label>
                        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Central Park, Sector-10" />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Propose Project'}
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


// --- Reusable Project Card component (Unchanged) ---
function ProjectCard({ project, onJoinProject, currentUserId }) {
    const isFull = project.volunteers.length >= project.volunteersNeeded;
    const isJoined = project.volunteers.map(v => v._id).includes(currentUserId);
    const isCreator = project.creator._id === currentUserId;
    const isClosed = project.status !== 'Open';

    // Determine button state
    let buttonText = "Join Project";
    let buttonDisabled = false;
    let buttonVariant = "default";
    let buttonAction = () => onJoinProject(project._id);

    if (isCreator) {
        buttonText = "My Project";
        buttonDisabled = true;
        buttonVariant = "secondary";
    } else if (isClosed) {
        buttonText = project.status;
        buttonDisabled = true;
        buttonVariant = "destructive";
    } else if (isJoined) {
        buttonText = "Joined!";
        buttonDisabled = true;
        buttonVariant = "outline";
    } else if (isFull) {
        buttonText = "Project Full";
        buttonDisabled = true;
        buttonVariant = "secondary";
    }

    return (
        <Card className="flex flex-col shadow-soft hover:shadow-medium transition-smooth h-full">
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>Proposed by {project.creator.name} in {project.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <h4 className="font-semibold mb-2 text-sm">Skills Needed:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.skillsNeeded.map(skill => (
                        <Badge key={skill._id} variant="secondary">{skill.name}</Badge>
                    ))}
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{project.volunteers.length} / {project.volunteersNeeded} volunteers joined</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                        className={`h-2.5 rounded-full ${isFull ? 'bg-green-600' : 'bg-blue-600'}`} 
                        style={{ width: `${(project.volunteers.length / project.volunteersNeeded) * 100}%` }}
                    ></div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Button 
                    variant={buttonVariant} 
                    onClick={buttonAction}
                    disabled={buttonDisabled}
                >
                    {buttonText}
                </Button>
                <Button variant="link">View Details</Button>
            </CardFooter>
        </Card>
    );
}


// --- Main Projects Page Component (Modified) ---
export default function Projects() {
    const { user } = useAuthContext();
    const [openProjects, setOpenProjects] = useState([]);
    const [userProjects, setUserProjects] = useState([]); // NEW: State for user's projects
    const [allSkillTags, setAllSkillTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('browse');
    const [isDataLoading, setIsDataLoading] = useState(true);

    const fetchAllData = async () => {
        setIsDataLoading(true);
        try {
            const [projectsResponse, skillsResponse] = await Promise.all([
                projectAPI.getProjects(), // Open projects for browse tab
                skillAPI.getAllSkillTags(),
            ]);
            setOpenProjects(projectsResponse.data);
            setAllSkillTags(skillsResponse.data);

            // Fetch user-specific projects only if logged in
            if (user) {
                const userProjectsResponse = await projectAPI.getProjectsForUser(); // NEW API CALL
                setUserProjects(userProjectsResponse.data);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [user]);

    const handleProjectCreated = () => {
        fetchAllData(); // Refresh list after creation
        setActiveTab('browse'); // Switch to browse tab
    };

    const handleJoinProject = async (projectId) => {
        if (!user) return alert('Please log in to join a project.');
        try {
            const confirmJoin = window.confirm("Are you sure you want to volunteer for this project? You will be contacted by the project creator.");
            if (!confirmJoin) return;
            
            await projectAPI.joinProject(projectId);
            alert('You have successfully joined the project!');
            fetchAllData(); // Refresh data
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to join project.';
            alert(msg);
            console.error(error);
        }
    };

    // Filter user's projects into created and joined
    const createdProjects = userProjects.filter(p => p.creator._id === user?._id);
    const joinedProjects = userProjects.filter(p => p.creator._id !== user?._id);


    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Community Projects</h1>
                    <p className="text-lg text-muted-foreground">Strengthen your neighborhood by collaborating on projects.</p>
                </div>
                <Button className="mt-4 md:mt-0" onClick={() => setActiveTab('create')} disabled={!user}>
                    <Plus className="mr-2 h-4 w-4" /> Propose a New Project
                </Button>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
                    <TabsTrigger value="browse">Browse Open Projects ({openProjects.length})</TabsTrigger>
                    <TabsTrigger value="mine" disabled={!user}>My Projects</TabsTrigger>
                    <TabsTrigger value="create">Propose New</TabsTrigger>
                </TabsList>

                {/* Tab 1: Browse Open Projects */}
                <TabsContent value="browse">
                    <h2 className="text-2xl font-semibold pt-4">Volunteer Opportunities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {isDataLoading ? (
                            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto col-span-full mt-10" />
                        ) : openProjects.length > 0 ? (
                            openProjects.map(project => (
                                <ProjectCard 
                                    key={project._id} 
                                    project={project} 
                                    onJoinProject={handleJoinProject}
                                    currentUserId={user?._id}
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground col-span-full text-center py-10">No open projects right now. Why not propose one?</p>
                        )}
                    </div>
                </TabsContent>

                {/* Tab 2: My Projects (Created or Joined) */}
                <TabsContent value="mine">
                    {user ? (
                        <div className='space-y-6'>
                            <h2 className="text-2xl font-semibold pt-4">Projects I Created ({createdProjects.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isDataLoading ? (
                                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                                ) : createdProjects.length > 0 ? (
                                    createdProjects.map(project => (
                                        <ProjectCard 
                                            key={project._id} 
                                            project={project} 
                                            onJoinProject={handleJoinProject}
                                            currentUserId={user?._id}
                                        />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">You haven't proposed any projects yet.</p>
                                )}
                            </div>

                            <h2 className="text-2xl font-semibold pt-4">Projects I'm Volunteering For ({joinedProjects.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isDataLoading ? (
                                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                                ) : joinedProjects.length > 0 ? (
                                    joinedProjects.map(project => (
                                        <ProjectCard 
                                            key={project._id} 
                                            project={project} 
                                            onJoinProject={handleJoinProject}
                                            currentUserId={user?._id}
                                        />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">You haven't joined any projects yet.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground pt-4">Please log in to view your projects.</p>
                    )}
                </TabsContent>

                {/* Tab 3: Propose New Project */}
                <TabsContent value="create">
                    {user ? (
                        <CreateProjectForm skills={allSkillTags} onProjectCreated={handleProjectCreated} />
                    ) : (
                        <Card className="mt-4 p-8 text-center shadow-soft">
                            <h3 className="text-xl font-semibold">Log In to Propose a Project</h3>
                            <p className="text-muted-foreground">You must be logged in to create a community initiative.</p>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}