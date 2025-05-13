
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Annotation } from '../types';

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  const addAnnotation = (position: [number, number]): Annotation[] => {
    const newAnnotation: Annotation = {
      id: uuidv4(),
      position,
      text: 'Nouvelle annotation'
    };
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    return updatedAnnotations;
  };
  
  const updateAnnotation = (id: string, text: string): Annotation[] => {
    const updatedAnnotations = annotations.map(annotation => 
      annotation.id === id 
        ? { ...annotation, text } 
        : annotation
    );
    setAnnotations(updatedAnnotations);
    return updatedAnnotations;
  };
  
  const removeAnnotation = (id: string): Annotation[] => {
    const updatedAnnotations = annotations.filter(annotation => annotation.id !== id);
    setAnnotations(updatedAnnotations);
    return updatedAnnotations;
  };
  
  return {
    annotations,
    setAnnotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation
  };
};
