
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Annotation } from '../types';
import { createMapIcon } from '@/utils/mapIcons';

interface AnnotationsLayerProps {
  annotations: Annotation[];
  readOnly: boolean;
  onRemoveAnnotation?: (id: string) => void;
  onUpdateAnnotation?: (id: string, text: string) => void;
}

const AnnotationsLayer = ({
  annotations,
  readOnly,
  onRemoveAnnotation,
  onUpdateAnnotation
}: AnnotationsLayerProps) => {
  return (
    <>
      {annotations.map((annotation) => (
        <Marker
          key={annotation.id}
          position={annotation.position}
          icon={createMapIcon('#10b981')}
        >
          <Popup>
            {readOnly ? (
              <p>{annotation.text}</p>
            ) : (
              <div className="space-y-2">
                <textarea
                  defaultValue={annotation.text}
                  onChange={(e) => onUpdateAnnotation?.(annotation.id, e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  rows={2}
                />
                <button
                  onClick={() => onRemoveAnnotation?.(annotation.id)}
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
