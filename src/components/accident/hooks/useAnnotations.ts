
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Annotation } from '../types/scheme';
import { toast } from 'sonner';

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addAnnotation = useCallback((position: [number, number], text: string = 'Note...') => {
    const newAnnotation: Annotation = {
      id: uuidv4(),
      position,
      text
    };

    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    return updatedAnnotations;
  }, [annotations]);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations(prevAnnotations => prevAnnotations.filter(a => a.id !== id));
    toast.info("Annotation supprimée");
  }, []);

  const updateAnnotation = useCallback((id: string, text: string) => {
    setAnnotations(prevAnnotations => 
      prevAnnotations.map(a => a.id === id ? { ...a, text } : a)
    );
  }, []);

  return {
    annotations,
    addAnnotation,
    removeAnnotation,
    updateAnnotation,
    setAnnotations
  };
};
