
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Annotation } from '../types';

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addAnnotation = (position: [number, number], type: 'obstacle' | 'sign' | 'note' = 'note') => {
    const newAnnotation: Annotation = {
      id: uuidv4(),
      position,
      text: type === 'note' ? 'Note' : type === 'obstacle' ? 'Obstacle' : 'Panneau',
      type
    };
    
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    return updatedAnnotations;
  };

  const updateAnnotation = (id: string, text: string) => {
    const updatedAnnotations = annotations.map(annotation => 
      annotation.id === id ? { ...annotation, text } : annotation
    );
    setAnnotations(updatedAnnotations);
    return updatedAnnotations;
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(current => current.filter(annotation => annotation.id !== id));
    return annotations.filter(annotation => annotation.id !== id);
  };

  return {
    annotations,
    setAnnotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation
  };
};
