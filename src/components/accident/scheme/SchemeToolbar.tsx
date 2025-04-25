
import React from 'react';
import { Button } from '@/components/ui/button';

interface SchemeToolbarProps {
  currentTool: 'select' | 'vehicle' | 'path' | 'annotation';
  setCurrentTool: (tool: 'select' | 'vehicle' | 'path' | 'annotation') => void;
}

const SchemeToolbar = ({ currentTool, setCurrentTool }: SchemeToolbarProps) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white rounded-md shadow-md p-2 flex flex-col gap-2">
      <Button
        size="sm"
        variant={currentTool === 'select' ? 'default' : 'outline'}
        onClick={() => setCurrentTool('select')}
        className="flex items-center"
      >
        <span className="sr-only">Sélectionner</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 17 9 4 9-4"/>
          <path d="m3 7 9 4 9-4"/>
          <path d="M3 12h18"/>
        </svg>
      </Button>
      
      <Button
        size="sm"
        variant={currentTool === 'vehicle' ? 'default' : 'outline'}
        onClick={() => setCurrentTool('vehicle')}
        className="flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.5 8.5 5.5 8.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z"/>
          <path d="M15 8.5V5a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v3.5"/>
          <line x1="3" x2="21" y1="12.5" y2="12.5"/>
        </svg>
        <span className="sr-only">Véhicule</span>
      </Button>
      
      <Button
        size="sm"
        variant={currentTool === 'path' ? 'default' : 'outline'}
        onClick={() => setCurrentTool('path')}
        className="flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20l1.3-3.9a9 9 0 1 1 2.6 3.9z"/>
          <path d="M16 8l-1.3 3.9A9 9 0 1 0 18.6 8z"/>
        </svg>
        <span className="sr-only">Trajectoire</span>
      </Button>
      
      <Button
        size="sm"
        variant={currentTool === 'annotation' ? 'default' : 'outline'}
        onClick={() => setCurrentTool('annotation')}
        className="flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 13a8 8 0 0 1 15 0"/>
          <path d="M7 21a8 8 0 0 0 15 0"/>
          <path d="M12 3v10"/>
        </svg>
        <span className="sr-only">Annotation</span>
      </Button>
    </div>
  );
};

export default SchemeToolbar;
