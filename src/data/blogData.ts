
import { FileText, Shield, Camera, MapPin, AlertCircle, Car } from 'lucide-react';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  icon: any;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'comment-remplir-constat-amiable',
    title: 'Comment Bien Remplir un Constat Amiable en 2024',
    excerpt: 'Guide complet pour remplir correctement votre constat amiable et éviter les erreurs qui pourraient vous coûter cher.',
    content: `
      <h2>Les Étapes Essentielles du Constat Amiable</h2>
      <p>Le <strong>constat amiable</strong> est un document crucial en cas d'accident automobile. Voici comment le remplir correctement :</p>
      
      <h3>1. Informations sur les Véhicules</h3>
      <p>Notez avec précision :</p>
      <ul>
        <li>Les plaques d'immatriculation</li>
        <li>La marque, le modèle et l'année des véhicules</li>
        <li>Le numéro de série (VIN) si possible</li>
      </ul>
      
      <h3>2. Circonstances de l'Accident</h3>
      <p>Décrivez factuellement les circonstances de l'<strong>accident automobile</strong> sans donner d'opinion sur les responsabilités.</p>
      
      <h3>3. Dégâts Constatés</h3>
      <p>Listez tous les dégâts visibles, même les plus petits. Prenez des photos si possible.</p>
      
      <h3>4. Informations sur les Conducteurs</h3>
      <p>Renseignez les informations d'<strong>assurance auto</strong> de chaque conducteur impliqué.</p>
      
      <h2>Erreurs à Éviter</h2>
      <p>Ne signez jamais un constat amiable incomplet ou si vous n'êtes pas d'accord avec les éléments mentionnés.</p>
      
      <h2>Après le Constat Amiable</h2>
      <p>Transmettez rapidement votre <strong>constat amiable</strong> à votre compagnie d'assurance, idéalement dans les 5 jours ouvrés.</p>
    `,
    author: 'Marie Dubois',
    date: '15 Janvier 2024',
    category: 'Guide Pratique',
    tags: ['constat amiable', 'accident automobile', 'assurance auto', 'guide pratique'],
    icon: FileText
  },
  {
    id: 2,
    slug: 'assurance-auto-obligations-legales',
    title: 'Assurance Auto : Vos Obligations Légales en France',
    excerpt: 'Tout ce que vous devez savoir sur vos obligations légales en matière d\'assurance automobile en France.',
    content: `
      <h2>L'Assurance Auto Obligatoire</h2>
      <p>En France, l'<strong>assurance auto</strong> est obligatoire pour tous les véhicules terrestres à moteur.</p>
      
      <h3>Garantie Responsabilité Civile</h3>
      <p>La garantie minimum obligatoire couvre :</p>
      <ul>
        <li>Les dommages corporels causés aux tiers</li>
        <li>Les dommages matériels causés aux biens d'autrui</li>
        <li>Les frais de défense et recours</li>
      </ul>
      
      <h3>Sanctions en Cas de Défaut d'Assurance</h3>
      <p>Conduire sans <strong>assurance véhicule</strong> valide expose à :</p>
      <ul>
        <li>Une amende de 3 750 €</li>
        <li>La suspension du permis de conduire</li>
        <li>L'immobilisation du véhicule</li>
      </ul>
      
      <h2>Contrôles et Vérifications</h2>
      <p>Gardez toujours votre carte verte d'assurance dans votre véhicule et vérifiez sa validité régulièrement.</p>
      
      <h2>En Cas d'Accident</h2>
      <p>Même avec une assurance, établir un <strong>constat amiable</strong> reste essentiel pour faciliter les démarches.</p>
    `,
    author: 'Pierre Martin',
    date: '10 Janvier 2024',
    category: 'Assurance',
    tags: ['assurance auto', 'obligations légales', 'responsabilité civile', 'carte verte'],
    icon: Shield
  },
  {
    id: 3,
    slug: 'photos-accident-preuves-efficaces',
    title: 'Photos d\'Accident : Comment Constituer des Preuves Efficaces',
    excerpt: 'L\'importance des photos dans un constat amiable et comment les prendre efficacement pour votre dossier.',
    content: `
      <h2>L'Importance des Photos dans un Constat Amiable</h2>
      <p>Les photos sont des preuves essentielles qui complètent votre <strong>constat amiable numérique</strong>.</p>
      
      <h3>Que Photographier ?</h3>
      <ul>
        <li>Vue d'ensemble de la scène d'<strong>accident</strong></li>
        <li>Tous les véhicules impliqués sous plusieurs angles</li>
        <li>Les dégâts spécifiques à chaque véhicule</li>
        <li>La signalisation routière</li>
        <li>Les traces de freinage ou débris</li>
      </ul>
      
      <h3>Conseils pour de Bonnes Photos</h3>
      <p>Pour des photos exploitables par votre <strong>assurance auto</strong> :</p>
      <ul>
        <li>Prenez plusieurs angles pour chaque élément</li>
        <li>Assurez-vous que les plaques d'immatriculation sont lisibles</li>
        <li>Photographiez en haute résolution</li>
        <li>Horodatez vos photos si possible</li>
      </ul>
      
      <h2>Photos et Constat Amiable Numérique</h2>
      <p>Avec un <strong>constat amiable en ligne</strong>, vous pouvez directement intégrer vos photos au dossier.</p>
      
      <h2>Respect de la Vie Privée</h2>
      <p>Évitez de photographier les personnes sans leur accord, concentrez-vous sur les véhicules et la scène.</p>
    `,
    author: 'Sophie Leroy',
    date: '8 Janvier 2024',
    category: 'Conseils Pratiques',
    tags: ['photos accident', 'preuves', 'constat amiable numérique', 'dossier assurance'],
    icon: Camera
  },
  {
    id: 4,
    slug: 'trouver-carrossier-agree-assurance',
    title: 'Comment Trouver un Carrossier Agréé par votre Assurance',
    excerpt: 'Guide pour choisir le bon carrossier et optimiser la prise en charge de vos réparations automobiles.',
    content: `
      <h2>Carrossiers Agréés : Qu'est-ce que c'est ?</h2>
      <p>Un <strong>carrossier agréé</strong> a signé une convention avec votre compagnie d'<strong>assurance auto</strong>.</p>
      
      <h3>Avantages des Carrossiers Agréés</h3>
      <ul>
        <li>Prise en charge directe des réparations</li>
        <li>Pas d'avance de frais de votre part</li>
        <li>Qualité garantie par l'assurance</li>
        <li>Processus simplifié</li>
      </ul>
      
      <h3>Comment Trouver un Carrossier Agréé</h3>
      <p>Plusieurs options s'offrent à vous :</p>
      <ul>
        <li>Site web de votre assurance</li>
        <li>Application mobile de l'assureur</li>
        <li>Appel au service client</li>
        <li>Annuaires spécialisés en ligne</li>
      </ul>
      
      <h2>Critères de Choix</h2>
      <p>Au-delà de l'agrément <strong>assurance</strong>, vérifiez :</p>
      <ul>
        <li>La proximité géographique</li>
        <li>Les avis clients</li>
        <li>Les spécialités (carrosserie, peinture, etc.)</li>
        <li>Les délais d'intervention</li>
      </ul>
      
      <h2>Après l'Accident</h2>
      <p>Une fois votre <strong>constat amiable</strong> établi, contactez rapidement un carrossier agréé pour l'expertise.</p>
    `,
    author: 'Marc Rousseau',
    date: '5 Janvier 2024',
    category: 'Réparations',
    tags: ['carrossier agréé', 'réparations auto', 'assurance auto', 'expertise'],
    icon: Car
  },
  {
    id: 5,
    slug: 'accident-que-faire-premiers-reflexes',
    title: 'Accident de Voiture : Les Premiers Réflexes à Adopter',
    excerpt: 'Les étapes cruciales à suivre immédiatement après un accident automobile pour votre sécurité et vos démarches.',
    content: `
      <h2>Sécurité Avant Tout</h2>
      <p>En cas d'<strong>accident automobile</strong>, la priorité absolue est la sécurité :</p>
      
      <h3>Immédiatement Après l'Impact</h3>
      <ul>
        <li>Vérifiez votre état et celui des passagers</li>
        <li>Allumez vos feux de détresse</li>
        <li>Sortez du véhicule si possible</li>
        <li>Placez un triangle de signalisation à 30m</li>
      </ul>
      
      <h3>Appels d'Urgence</h3>
      <p>Contactez immédiatement :</p>
      <ul>
        <li><strong>15 (SAMU)</strong> en cas de blessés</li>
        <li><strong>17 (Police)</strong> si nécessaire</li>
        <li><strong>18 (Pompiers)</strong> en cas d'incendie</li>
      </ul>
      
      <h2>Constitution du Dossier</h2>
      <p>Une fois la sécurité assurée :</p>
      <ul>
        <li>Établissez le <strong>constat amiable</strong></li>
        <li>Échangez les informations d'assurance</li>
        <li>Prenez des photos de la scène</li>
        <li>Notez les témoins éventuels</li>
      </ul>
      
      <h2>Contact avec l'Assurance</h2>
      <p>Prévenez votre <strong>assurance auto</strong> dans les plus brefs délais, idéalement dans les 5 jours ouvrés.</p>
      
      <h2>Ne Jamais Reconnaître sa Responsabilité</h2>
      <p>Même si vous pensez être responsable, laissez l'expertise déterminer les responsabilités.</p>
    `,
    author: 'Dr. Anne Moreau',
    date: '3 Janvier 2024',
    category: 'Urgence',
    tags: ['accident voiture', 'premiers secours', 'sécurité routière', 'urgences'],
    icon: AlertCircle
  },
  {
    id: 6,
    slug: 'geolocalisation-accident-importance',
    title: 'Géolocalisation d\'un Accident : Pourquoi c\'est Important',
    excerpt: 'L\'importance de bien localiser votre accident pour un constat amiable précis et des démarches facilitées.',
    content: `
      <h2>Précision de la Localisation</h2>
      <p>La <strong>géolocalisation</strong> précise de votre accident est cruciale pour :</p>
      
      <h3>Le Constat Amiable</h3>
      <ul>
        <li>Identification exacte du lieu</li>
        <li>Détermination de la juridiction compétente</li>
        <li>Contexte routier (intersection, virage, etc.)</li>
        <li>Conditions de circulation</li>
      </ul>
      
      <h3>L'Expertise d'Assurance</h3>
      <p>Une localisation précise aide votre <strong>assurance auto</strong> à :</p>
      <ul>
        <li>Reconstituer les circonstances</li>
        <li>Vérifier la cohérence du récit</li>
        <li>Déterminer les responsabilités</li>
        <li>Identifier des facteurs externes</li>
      </ul>
      
      <h2>Outils de Géolocalisation</h2>
      <p>Pour une localisation précise :</p>
      <ul>
        <li>GPS de votre smartphone</li>
        <li>Applications de navigation</li>
        <li>Points de repère fixes</li>
        <li>Adresses et intersections</li>
      </ul>
      
      <h2>Constat Amiable Numérique</h2>
      <p>Avec un <strong>constat amiable en ligne</strong>, la géolocalisation peut être automatiquement intégrée.</p>
      
      <h2>Informations Complémentaires</h2>
      <p>Notez également :</p>
      <ul>
        <li>Le sens de circulation</li>
        <li>Les conditions météorologiques</li>
        <li>L'état de la chaussée</li>
        <li>La signalisation présente</li>
      </ul>
    `,
    author: 'Thomas Dubois',
    date: '1 Janvier 2024',
    category: 'Technologie',
    tags: ['géolocalisation', 'constat amiable numérique', 'GPS', 'localisation accident'],
    icon: MapPin
  }
];
