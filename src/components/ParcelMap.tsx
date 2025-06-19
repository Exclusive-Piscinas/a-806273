
import React from 'react';
import { MapPin } from 'lucide-react';

interface ParcelMapProps {
  coordinates?: { lat: number; lng: number };
  parcelName?: string;
  isEditing?: boolean;
  onCoordinatesChange?: (coords: { lat: number; lng: number }) => void;
}

const ParcelMap = ({ 
  coordinates = { lat: 45.4631, lng: 4.3873 }, 
  parcelName = "Parcela",
  isEditing = false,
  onCoordinatesChange 
}: ParcelMapProps) => {
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing || !onCoordinatesChange) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert pixel coordinates to approximate lat/lng
    const lat = coordinates.lat + (y - rect.height / 2) * 0.001;
    const lng = coordinates.lng + (x - rect.width / 2) * 0.001;
    
    onCoordinatesChange({ lat, lng });
  };

  return (
    <div 
      className="w-full h-full bg-green-50 relative overflow-hidden cursor-pointer"
      onClick={handleMapClick}
    >
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-green-200"></div>
          ))}
        </div>
      </div>
      
      {/* Parcel marker */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ 
          left: '50%', 
          top: '50%'
        }}
      >
        <div className="bg-green-600 text-white p-2 rounded-lg shadow-lg flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{parcelName}</span>
        </div>
      </div>
      
      {/* Coordinates display */}
      <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
        {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
      </div>
      
      {isEditing && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          Modo de edição - Clique para definir localização
        </div>
      )}
    </div>
  );
};

export default ParcelMap;
