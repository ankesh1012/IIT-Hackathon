import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MapPin, Star, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userAPI } from "@/lib/api";

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [radius, setRadius] = useState("5");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, radius]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers({ search: searchTerm });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Discover Skills Near You</h1>
            <p className="text-xl text-muted-foreground">
              Connect with talented neighbors and exchange skills in your community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for skills... (e.g., Guitar, Coding, Gardening)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={radius} onValueChange={setRadius}>
                  <SelectTrigger className="w-[150px] h-12">
                    <SelectValue placeholder="Radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mile</SelectItem>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="25">25 miles</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="lg">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card 
                  key={user._id}
                  className="group hover:shadow-soft transition-smooth cursor-pointer border-2"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 border-2 border-primary/20">
                        <AvatarFallback className="text-lg gradient-hero text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-smooth">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-semibold">{user.rating || 0}</span>
                          <span className="text-sm text-muted-foreground">({user.reviewCount || 0})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {user.bio || "No bio available"}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.slice(0, 3).map((skill, index) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="transition-smooth hover:scale-105"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Discover;