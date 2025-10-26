// client/src/components/UserMap.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Fix for default Leaflet marker icon issue in Webpack environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to dynamically set the map view
const ChangeView = ({ center }) => {
  const map = useMap();
  // Ensure zoom is reasonable when setting view
  map.setView(center, map.getZoom() > 8 ? map.getZoom() : 10);
  return null;
};

export default function UserMap({ users, userLocation }) {
  // Use userLocation's coords if available, otherwise default to a general India location
  const defaultCenter = useMemo(() => [userLocation.lat || 20.5937, userLocation.lng || 78.9629], [userLocation]);

  // Filter users to only include those with valid coordinates (lat != 0 and lng != 0)
  const validUsers = users.filter(u => u.coords && u.coords.lat !== 0 && u.coords.lng !== 0);
  
  // Set the map center based on a user or the default center
  const mapCenter = validUsers.length > 0 ? [validUsers[0].coords.lat, validUsers[0].coords.lng] : defaultCenter;

  if (validUsers.length === 0) {
    return <div className="p-8 text-center text-muted-foreground bg-card rounded-lg shadow-soft">No connectable users with valid locations found on the map.</div>;
  }

  return (
    <Card className="shadow-medium overflow-hidden h-[400px] p-0">
        <MapContainer 
            center={mapCenter} 
            zoom={10} 
            scrollWheelZoom={true}
            className="w-full h-full"
        >
            <ChangeView center={mapCenter} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {validUsers.map((user) => (
                <Marker key={user._id} position={[user.coords.lat, user.coords.lng]}>
                    <Popup>
                        <div className="space-y-2 p-1">
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin size={12} /> {user.location}
                            </p>
                            <div className="text-xs flex items-center gap-1">
                                <Sparkles size={12} />
                                {user.skills.slice(0, 3).map(skill => skill.name).join(', ')}...
                            </div>
                            <Button asChild variant="link" className="h-fit p-0 pt-2">
                                <Link to={`/users/${user._id}`}>View Profile</Link>
                            </Button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </Card>
  );
}