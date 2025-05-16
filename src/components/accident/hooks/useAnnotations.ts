
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Annotation } from '../types';

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addAnnotation = useCallback((position: [number, number], text: string = 'Note') => {
    const newAnnotation: Annotation = {
      id: uuidv4(),
      position,
      text
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    return [...annotations, newAnnotation];
  }, [annotations]);

  const updateAnnotation = useCallback((id: string, text: string) => {
    setAnnotations(prev =>
      prev.map(annotation =>
        annotation.id === id ? { ...annotation, text } : annotation
      )
    );
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== id));
  }, []);

  return {
    annotations,
    setAnnotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation
  };
};
