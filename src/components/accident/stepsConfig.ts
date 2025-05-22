
import { Step } from './types';

export const accidentFormSteps: Step[] = [
  {
    id: 'basics',
    title: 'Informations de base',
    description: 'Date, heure et conditions'
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
    id: 'owner-driver',
    title: 'Conducteurs',
    description: 'Informations sur les propriétaires et conducteurs'
  },
  {
    id: 'circumstances',
    title: 'Circonstances',
    description: 'Circonstances de l\'accident'
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
    id: 'signature',
    title: 'Signature',
    description: 'Signature des deux parties'
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
