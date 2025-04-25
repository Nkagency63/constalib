
import { useState } from 'react';
import { SchemeData } from '../types';

export const useSchemeHistory = () => {
  const [history, setHistory] = useState<SchemeData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const saveToHistory = (state: SchemeData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, state]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = (currentState: SchemeData) => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      return prevState;
    }
    return currentState;
  };

  const handleRedo = (currentState: SchemeData) => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      return nextState;
    }
    return currentState;
  };

  return {
    saveToHistory,
    handleUndo,
    handleRedo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};
