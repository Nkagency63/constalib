
import { atom } from 'jotai';
import { Vehicle } from './types';

export const vehiclesAtom = atom<Vehicle[]>([]);
export const selectedVehicleAtom = atom<string | null>(null);
export const zoomAtom = atom(18);
export const historyAtom = atom<Vehicle[][]>([[]]);
export const historyIndexAtom = atom(0);

// Derived atoms for history state
export const canUndoAtom = atom((get) => get(historyIndexAtom) > 0);
export const canRedoAtom = atom((get) => get(historyIndexAtom) < get(historyAtom).length - 1);
