
import { Step } from './types';

export const accidentFormSteps: Step[] = [
  {
    id: 'basics',
    title: 'Informations de base',
    description: 'Date et heure de l\'accident'
  },
  {
    id: 'location',
    title: 'Localisation',
    description: 'Adresse précise de l\'accident'
  },
  {
    id: 'vehicles',
    title: 'Véhicules',
    description: 'Identification des véhicules impliqués'
  },
  {
    id: 'details',
    title: 'Détails',
    description: 'Description de l\'accident'
  },
  {
    id: 'photos',
    title: 'Photos',
    description: 'Photographies des véhicules et des dégâts'
  },
  {
    id: 'scheme',
    title: 'Schéma',
    description: 'Positionnement des véhicules'
  },
  {
    id: 'email',
    title: 'Envoi',
    description: 'Destinataires du constat'
  },
  {
    id: 'review',
    title: 'Vérification',
    description: 'Vérifiez les informations avant de soumettre'
  }
];
