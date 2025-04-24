
import React, { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Icon, LatLng, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car, Flag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  position: [number, number];
  rotation: number;
  color: string;
  label: string;
  description?: string;
}

interface Annotation {
  id: string;
  position: [number, number];
  text: string;
  type: 'flag' | 'info';
}

interface Trajectory {
  id: string;
  points: [number, number][];
  color: string;
  vehicleId: string;
}

interface InteractiveSchemeProps {
  center: [number, number];
  address: string;
  onSaveScheme?: (data: {
    vehicles: Vehicle[];
    annotations: Annotation[];
    trajectories: Trajectory[];
  }) => void;
}

// Custom Map Controls Component
const MapControls = ({ onAddVehicle, onAddAnnotation, onTakeSnapshot, onAddTrajectory, selectedVehicleId, vehicles }) => {
  const map = useMapEvents({
    click: (e) => {
      // This will be used for trajectory points if needed
    },
  });

  return (
    <div className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-md shadow-md flex flex-col gap-2">
      <Button size="sm" variant="outline" onClick={onAddVehicle}>
        <Car className="h-4 w-4 mr-1" />
        Ajouter véhicule
      </Button>
      <Button size="sm" variant="outline" onClick={onAddAnnotation}>
        <Flag className="h-4 w-4 mr-1" />
        Ajouter annotation
      </Button>
      {selectedVehicleId && (
        <Button size="sm" variant="outline" onClick={onAddTrajectory}>
          <ArrowRight className="h-4 w-4 mr-1" />
          Trajectoire
        </Button>
      )}
      <Button size="sm" variant="default" onClick={onTakeSnapshot}>
        Exporter
      </Button>
    </div>
  );
};

// Custom Vehicle Marker
const VehicleMarker = ({ vehicle, isSelected, onClick, onRotate, onMove, onUpdate, onDelete }) => {
  // Create custom car icon with rotation
  const carIcon = useMemo(() => {
    return new DivIcon({
      className: '',
      iconSize: [40, 40],
      html: `
        <div style="
          width: 40px; 
          height: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background-color: ${vehicle.color}; 
          border-radius: 5px;
          transform: rotate(${vehicle.rotation}deg);
          ${isSelected ? 'border: 2px solid #3b82f6;' : ''}
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 17H5L3 15V13H21V15L19 17Z" stroke="white" stroke-width="2"/>
            <path d="M6 13V7C6 5.89543 6.89543 5 8 5H16C17.1046 5 18 5.89543 18 7V13" stroke="white" stroke-width="2"/>
          </svg>
          <div style="
            position: absolute; 
            bottom: -20px; 
            left: 50%; 
            transform: translateX(-50%); 
            background-color: white; 
            padding: 2px 4px; 
            border-radius: 3px; 
            font-size: 10px;
            white-space: nowrap;
          ">
            ${vehicle.label}
          </div>
        </div>
      `
    });
  }, [vehicle.color, vehicle.rotation, vehicle.label, isSelected]);

  return (
    <Marker
      position={vehicle.position}
      icon={carIcon}
      draggable={true}
      eventHandlers={{
        click: () => onClick(vehicle.id),
        dragend: (e) => onMove(vehicle.id, [e.target.getLatLng().lat, e.target.getLatLng().lng])
      }}
    >
      {isSelected && (
        <Popup closeButton={false} className="vehicle-popup">
          <div className="p-2">
            <div className="mb-2">
              <Label>Couleur</Label>
              <div className="flex gap-2 mt-1">
                {['#ff9f43', '#0abde3', '#10ac84', '#ee5253', '#8854d0'].map(color => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full ${vehicle.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdate(vehicle.id, { color })}
                  />
                ))}
              </div>
            </div>
            <div className="mb-2">
              <Label>Étiquette</Label>
              <Input
                value={vehicle.label}
                onChange={(e) => onUpdate(vehicle.id, { label: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="mb-2">
              <Label>Rotation</Label>
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="outline" onClick={() => onRotate(vehicle.id, -45)}>
                  ↺
                </Button>
                <Button size="sm" variant="outline" onClick={() => onRotate(vehicle.id, 45)}>
                  ↻
                </Button>
              </div>
            </div>
            <Button size="sm" variant="destructive" className="mt-2" onClick={() => onDelete(vehicle.id)}>
              Supprimer
            </Button>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

// Annotation Marker
const AnnotationMarker = ({ annotation, isSelected, onClick, onMove, onUpdate, onDelete }) => {
  const flagIcon = useMemo(() => {
    return new DivIcon({
      className: '',
      iconSize: [30, 30],
      html: `
        <div style="
          width: 30px; 
          height: 30px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background-color: ${annotation.type === 'flag' ? '#f59e0b' : '#3b82f6'}; 
          border-radius: 50%;
          ${isSelected ? 'border: 2px solid #3b82f6;' : ''}
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="${annotation.type === 'flag' 
              ? 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7' 
              : 'M12 8v4M12 16h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z'}" 
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `
    });
  }, [annotation.type, isSelected]);

  return (
    <Marker
      position={annotation.position}
      icon={flagIcon}
      draggable={true}
      eventHandlers={{
        click: () => onClick(annotation.id),
        dragend: (e) => onMove(annotation.id, [e.target.getLatLng().lat, e.target.getLatLng().lng])
      }}
    >
      {isSelected && (
        <Popup closeButton={false}>
          <div className="p-2">
            <div className="mb-2">
              <Label>Type</Label>
              <Select 
                value={annotation.type} 
                onValueChange={(value) => onUpdate(annotation.id, { type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flag">Drapeau</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-2">
              <Label>Texte</Label>
              <Input
                value={annotation.text}
                onChange={(e) => onUpdate(annotation.id, { text: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button size="sm" variant="destructive" className="mt-2" onClick={() => onDelete(annotation.id)}>
              Supprimer
            </Button>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

// Trajectory Line
const TrajectoryLine = ({ trajectory, isSelected, onClick, onDelete }) => {
  return (
    <>
      <Polyline
        positions={trajectory.points}
        pathOptions={{ color: trajectory.color, weight: 3 }}
        eventHandlers={{
          click: () => onClick(trajectory.id)
        }}
      />
      {isSelected && trajectory.points.length > 0 && (
        <Popup position={trajectory.points[trajectory.points.length - 1]}>
          <div className="p-2">
            <Button size="sm" variant="destructive" onClick={() => onDelete(trajectory.id)}>
              Supprimer trajectoire
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
};

const InteractiveScheme = ({ center, address, onSaveScheme }: InteractiveSchemeProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: 'vehicle' | 'annotation' | 'trajectory', id: string } | null>(null);
  const [isAddingTrajectory, setIsAddingTrajectory] = useState(false);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);

  // Derived state
  const selectedVehicleId = selectedItem?.type === 'vehicle' ? selectedItem.id : null;
  const selectedAnnotationId = selectedItem?.type === 'annotation' ? selectedItem.id : null;
  const selectedTrajectoryId = selectedItem?.type === 'trajectory' ? selectedItem.id : null;

  // Add Vehicle
  const handleAddVehicle = useCallback(() => {
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      position: center,
      rotation: 0,
      color: '#ff9f43',
      label: `Véhicule ${vehicles.length + 1}`
    };
    setVehicles(prev => [...prev, newVehicle]);
    setSelectedItem({ type: 'vehicle', id: newVehicle.id });
  }, [center, vehicles.length]);

  // Add Annotation
  const handleAddAnnotation = useCallback(() => {
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      position: center,
      text: 'Nouvelle annotation',
      type: 'flag'
    };
    setAnnotations(prev => [...prev, newAnnotation]);
    setSelectedItem({ type: 'annotation', id: newAnnotation.id });
  }, [center]);

  // Start Trajectory
  const handleAddTrajectory = useCallback(() => {
    if (!selectedVehicleId) return;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (!vehicle) return;
    
    const newTrajectory: Trajectory = {
      id: `trajectory-${Date.now()}`,
      points: [vehicle.position],
      color: vehicle.color,
      vehicleId: vehicle.id
    };
    
    setTrajectories(prev => [...prev, newTrajectory]);
    setIsAddingTrajectory(true);
    setActiveVehicleId(vehicle.id);
    setSelectedItem({ type: 'trajectory', id: newTrajectory.id });
    
    toast.info("Cliquez sur la carte pour ajouter des points à la trajectoire. Cliquez sur 'Terminer' quand vous avez fini.", {
      duration: 5000
    });
  }, [selectedVehicleId, vehicles]);

  // Add point to trajectory
  const handleMapClick = useCallback((e) => {
    if (!isAddingTrajectory || !selectedTrajectoryId) return;
    
    const { lat, lng } = e.latlng;
    setTrajectories(prev => prev.map(t => 
      t.id === selectedTrajectoryId
        ? { ...t, points: [...t.points, [lat, lng]] }
        : t
    ));
  }, [isAddingTrajectory, selectedTrajectoryId]);

  // Update vehicle
  const handleUpdateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ));
    
    // Update related trajectory color if vehicle color changes
    if (updates.color) {
      setTrajectories(prev => prev.map(t => 
        t.vehicleId === id ? { ...t, color: updates.color as string } : t
      ));
    }
  }, []);

  // Rotate vehicle
  const handleRotateVehicle = useCallback((id: string, degrees: number) => {
    setVehicles(prev => prev.map(v => 
      v.id === id ? { ...v, rotation: (v.rotation + degrees) % 360 } : v
    ));
  }, []);

  // Move vehicle
  const handleMoveVehicle = useCallback((id: string, position: [number, number]) => {
    setVehicles(prev => prev.map(v => 
      v.id === id ? { ...v, position } : v
    ));
  }, []);

  // Delete vehicle
  const handleDeleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    // Also delete related trajectories
    setTrajectories(prev => prev.filter(t => t.vehicleId !== id));
    setSelectedItem(null);
  }, []);

  // Update annotation
  const handleUpdateAnnotation = useCallback((id: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => prev.map(a => 
      a.id === id ? { ...a, ...updates } : a
    ));
  }, []);

  // Move annotation
  const handleMoveAnnotation = useCallback((id: string, position: [number, number]) => {
    setAnnotations(prev => prev.map(a => 
      a.id === id ? { ...a, position } : a
    ));
  }, []);

  // Delete annotation
  const handleDeleteAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
    setSelectedItem(null);
  }, []);

  // Delete trajectory
  const handleDeleteTrajectory = useCallback((id: string) => {
    setTrajectories(prev => prev.filter(t => t.id !== id));
    setSelectedItem(null);
  }, []);

  // Finish adding trajectory points
  const handleFinishTrajectory = useCallback(() => {
    setIsAddingTrajectory(false);
    setActiveVehicleId(null);
    toast.success("Trajectoire ajoutée avec succès");
  }, []);

  // Take snapshot
  const handleTakeSnapshot = useCallback(() => {
    if (onSaveScheme) {
      onSaveScheme({ vehicles, annotations, trajectories });
    }
    
    // Just show a message for now, later we can implement actual export
    toast.success("Schéma enregistré. L'export sera implémenté prochainement.");
  }, [vehicles, annotations, trajectories, onSaveScheme]);

  return (
    <div className="relative w-full h-[500px] rounded-lg shadow-lg">
      <MapContainer
        center={center}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        whenCreated={(map) => {
          map.on('click', handleMapClick);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Vehicles */}
        {vehicles.map(vehicle => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={selectedVehicleId === vehicle.id}
            onClick={(id) => setSelectedItem({ type: 'vehicle', id })}
            onRotate={handleRotateVehicle}
            onMove={handleMoveVehicle}
            onUpdate={handleUpdateVehicle}
            onDelete={handleDeleteVehicle}
          />
        ))}
        
        {/* Annotations */}
        {annotations.map(annotation => (
          <AnnotationMarker
            key={annotation.id}
            annotation={annotation}
            isSelected={selectedAnnotationId === annotation.id}
            onClick={(id) => setSelectedItem({ type: 'annotation', id })}
            onMove={handleMoveAnnotation}
            onUpdate={handleUpdateAnnotation}
            onDelete={handleDeleteAnnotation}
          />
        ))}
        
        {/* Trajectories */}
        {trajectories.map(trajectory => (
          <TrajectoryLine
            key={trajectory.id}
            trajectory={trajectory}
            isSelected={selectedTrajectoryId === trajectory.id}
            onClick={(id) => setSelectedItem({ type: 'trajectory', id })}
            onDelete={handleDeleteTrajectory}
          />
        ))}
        
        {/* Map Controls */}
        <MapControls
          onAddVehicle={handleAddVehicle}
          onAddAnnotation={handleAddAnnotation}
          onAddTrajectory={handleAddTrajectory}
          onTakeSnapshot={handleTakeSnapshot}
          selectedVehicleId={selectedVehicleId}
          vehicles={vehicles}
        />
      </MapContainer>
      
      {isAddingTrajectory && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-2 rounded-md shadow-md">
          <Button size="sm" onClick={handleFinishTrajectory}>
            Terminer la trajectoire
          </Button>
        </div>
      )}
      
      <style>{`
        .leaflet-container {
          font: inherit;
          border-radius: 0.5rem;
        }
        .vehicle-popup .leaflet-popup-content-wrapper {
          min-width: 200px;
        }
      `}</style>
    </div>
  );
};

export default InteractiveScheme;
