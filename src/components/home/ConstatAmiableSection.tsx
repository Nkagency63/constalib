
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Clock, Shield, CheckCircle } from 'lucide-react';

const ConstatAmiableSection = () => {
  const benefits = [
    {
      icon: FileText,
      title: "Constat Amiable Numérique Officiel",
      description: "Formulaire conforme à la réglementation française, reconnu par toutes les compagnies d'assurance auto en France."
    },
    {
      icon: Clock,
      title: "Remplissage Rapide en 5 Minutes",
      description: "Interface guidée pour créer votre constat amiable rapidement, même sans expérience préalable."
    },
    {
      icon: Shield,
      title: "Données Sécurisées et Confidentielles",
      description: "Protection maximale de vos informations personnelles selon les normes RGPD européennes."
    },
    {
      icon: CheckCircle,
      title: "Validation Automatique",
      description: "Vérification automatique des informations saisies pour éviter les erreurs dans votre constat amiable."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête de section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
              Qu'est-ce qu'un <span className="text-constalib-blue">Constat Amiable</span> ?
            </h2>
            <p className="text-lg text-constalib-dark-gray max-w-3xl mx-auto leading-relaxed">
              Le <strong>constat amiable</strong> est un document officiel obligatoire en cas d'accident de voiture en France. 
              Il permet de déclarer les circonstances de l'accident automobile et facilite le traitement du dossier par votre assurance auto.
            </p>
          </div>

          {/* Explication détaillée */}
          <div className="bg-constalib-light-gray/20 rounded-xl p-6 md:p-8 mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-constalib-dark">
              Pourquoi utiliser notre service de constat amiable en ligne ?
            </h3>
            
            <div className="prose prose-lg max-w-none text-constalib-dark-gray">
              <p className="mb-4">
                Notre <strong>constat amiable numérique</strong> vous permet de :
              </p>
              <ul className="space-y-2 mb-6">
                <li>✓ Déclarer votre accident automobile directement depuis votre smartphone</li>
                <li>✓ Générer automatiquement le formulaire constat amiable au format PDF officiel</li>
                <li>✓ Transmettre instantanément votre déclaration d'accident à votre assurance auto</li>
                <li>✓ Éviter les erreurs de remplissage grâce à notre interface guidée</li>
                <li>✓ Gagner du temps dans le traitement de votre dossier sinistre</li>
              </ul>
              
              <p className="text-sm bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <strong>Important :</strong> Le constat amiable numérique a la même valeur légale qu'un constat amiable papier. 
                Il est officiellement reconnu par toutes les compagnies d'assurance automobile françaises depuis 2018.
              </p>
            </div>
          </div>

          {/* Avantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white border border-constalib-light-blue/30 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <benefit.icon className="w-8 h-8 text-constalib-blue" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-constalib-dark mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-constalib-dark-gray text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/accident">
              <Button size="lg" className="mb-4">
                Créer mon Constat Amiable Maintenant
              </Button>
            </Link>
            <p className="text-sm text-constalib-dark-gray">
              Service gratuit • Aucune inscription obligatoire • Compatible tous assureurs
            </p>
          </div>

          {/* FAQ rapide */}
          <div className="mt-16 bg-constalib-light-blue/10 rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-constalib-dark text-center">
              Questions Fréquentes sur le Constat Amiable
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-constalib-dark mb-2">Le constat amiable en ligne est-il obligatoire ?</h4>
                <p className="text-constalib-dark-gray">
                  Non, mais il facilite grandement la déclaration d'accident et accélère le traitement par votre assurance auto.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-constalib-dark mb-2">Mon assurance accepte-t-elle le constat numérique ?</h4>
                <p className="text-constalib-dark-gray">
                  Oui, toutes les assurances françaises acceptent le constat amiable numérique depuis 2018 (AXA, Maif, Macif, etc.).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-constalib-dark mb-2">Que faire si l'autre conducteur refuse le constat ?</h4>
                <p className="text-constalib-dark-gray">
                  Vous pouvez remplir votre partie du constat amiable même si l'autre partie refuse de signer.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-constalib-dark mb-2">Le service est-il vraiment gratuit ?</h4>
                <p className="text-constalib-dark-gray">
                  Oui, 100% gratuit. Aucun frais caché pour créer, télécharger ou transmettre votre constat amiable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConstatAmiableSection;
