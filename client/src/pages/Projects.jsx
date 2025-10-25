import React from 'react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Plus, Users } from 'lucide-react';

// Mock Data for projects
const mockProjects = [
  { id: 1, title: 'Community Garden Cleanup', creator: 'Jane Doe', volunteersNeeded: 10, volunteersJoined: 5, skills: ['Gardening', 'Landscaping'] },
  { id: 2, title: 'Local Park Mural Painting', creator: 'Alex Johnson', volunteersNeeded: 5, volunteersJoined: 5, skills: ['Painting', 'Art'] },
  { id: 3, title: 'Tech Literacy Workshop for Seniors', creator: 'John Smith', volunteersNeeded: 3, volunteersJoined: 1, skills: ['Teaching', 'IT Support'] },
];

/**
 * Community Projects Page
 * A gallery of local projects that users can propose and join.
 */
export default function Projects() {
  
  // TODO: Fetch projects from API in a useEffect

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Community Projects</h1>
          <p className="text-lg text-gray-600">Strengthen your neighborhood by collaborating on projects.</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Propose a New Project
        </Button>
      </header>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

/**
 * Reusable Project Card component
 */
function ProjectCard({ project }) {
  const isFull = project.volunteersJoined >= project.volunteersNeeded;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>Proposed by {project.creator}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="font-semibold mb-2 text-sm">Skills Needed:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map(skill => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-4 w-4" />
          <span>{project.volunteersJoined} / {project.volunteersNeeded} volunteers</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className={`h-2.5 rounded-full ${isFull ? 'bg-green-500' : 'bg-blue-600'}`} 
            style={{ width: `${(project.volunteersJoined / project.volunteersNeeded) * 100}%` }}
          ></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {isFull ? (
          <Badge className="bg-green-100 text-green-800">Project Full</Badge>
        ) : (
          <Button>Join Project</Button>
        )}
        <Button variant="link">View Details</Button>
      </CardFooter>
    </Card>
  );
}

