import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { ForensicSite } from '../types';
import L from 'leaflet';
import { Activity } from 'lucide-react';

// Fix for default leaflet marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationEventSetter({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

interface MapComponentProps {
  sites: ForensicSite[];
  userLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ sites, userLocation, onLocationSelect }) => {
  return (
    <div className="h-[400px] w-full border border-brand-line shadow-sm overflow-hidden">
      <MapContainer 
        center={userLocation ? [userLocation.lat, userLocation.lng] : [48.8566, 2.3522]} 
        zoom={userLocation ? 14 : 12} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationEventSetter onLocationSelect={onLocationSelect} />
        <MarkerClusterGroup>
        {sites.map(site => (
          <Marker 
            key={site.id} 
            position={[site.location.lat, site.location.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm">{site.name}</h3>
                <p className="text-xs text-gray-500">
                    ID: {site.id} | Status: <span className={`font-bold ${site.status === 'critical' ? 'text-red-500' : 'text-green-500'}`}>{site.status.toUpperCase()}</span>
                </p>
                <p className="text-[10px] text-gray-400 font-mono mt-1">
                  GPS: {site.location.lat.toFixed(4)}, {site.location.lng.toFixed(4)}
                </p>
                <div className="mt-2 text-xs flex gap-2">
                    <Activity className="w-3 h-3 text-brand-ink" />
                    <span>pH: {site.lastReading.sensors.pH}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        </MarkerClusterGroup>
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
             <Popup>User Entered Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
