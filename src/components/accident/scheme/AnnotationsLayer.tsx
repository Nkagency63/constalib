
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Annotation } from '../types/scheme';
import { createMapIcon } from '@/utils/mapIcons';

interface AnnotationsLayerProps {
  annotations: Annotation[];
  readOnly?: boolean;
  onRemoveAnnotation?: (id: string) => void;
  onUpdateAnnotation?: (id: string, text: string) => void;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
  onUpdate?: (id: string, text: string) => void;
}

const AnnotationsLayer = ({
  annotations,
  readOnly = false,
  onRemoveAnnotation,
  onUpdateAnnotation,
  onSelect,
  onRemove,
  onUpdate
}: AnnotationsLayerProps) => {
  // Use the provided handlers or fallback to the legacy ones
  const handleSelect = onSelect || ((id: string) => {});
  const handleRemove = onRemove || onRemoveAnnotation || ((id: string) => {});
  const handleUpdate = onUpdate || onUpdateAnnotation || ((id: string, text: string) => {});

  return (
    <>
      {annotations.map((annotation) => (
        <Marker
          key={annotation.id}
          position={annotation.position}
          icon={createMapIcon('#10b981')}
          eventHandlers={{
            click: () => handleSelect(annotation.id)
          }}
        >
          <Popup>
            {readOnly ? (
              <p>{annotation.text}</p>
            ) : (
              <div className="space-y-2">
                <textarea
                  defaultValue={annotation.text}
                  onChange={(e) => handleUpdate(annotation.id, e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  rows={2}
                />
                <button
                  onClick={() => handleRemove(annotation.id)}
                  className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs"
                >
                  Supprimer
                </button>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default AnnotationsLayer;
