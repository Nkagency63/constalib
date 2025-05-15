
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
    id: 'circumstances',
    title: 'Circonstances',
    description: 'Sélection des circonstances de l\'accident'
  },
  {
    id: 'scheme',
    title: 'Schéma',
    description: 'Positionnement des véhicules'
  },
  {
    id: 'photos',
    title: 'Photos',
    description: 'Photographies des véhicules et des dégâts'
  },
  {
    id: 'review',
    title: 'Vérification',
    description: 'Vérifiez les informations et générez le constat'
  },
  {
    id: 'email',
    title: 'Envoi',
    description: 'Destinataires du constat'
  }
];
