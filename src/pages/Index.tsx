import { Camera, FileText, MapPin, Shield, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import Button from '@/components/Button';
import { downloadPDF } from '@/utils/downloadUtils';

const Index = () => {
  // Features data
  const features = [
    {
      icon: FileText,
      title: 'Déclaration simple',
      description: 'Remplissez votre constat amiable numérique en quelques étapes guidées.'
    },
    {
      icon: Camera,
      title: 'Ajout de photos',
      description: 'Photographiez les dégâts et la scène de l\'accident directement depuis l\'application.'
    },
    {
      icon: MapPin,
      title: 'Localisation des carrossiers',
      description: 'Trouvez rapidement les carrossiers partenaires proches de vous.'
    },
    {
      icon: Shield,
      title: 'Données sécurisées',
      description: 'Vos informations personnelles et vos déclarations sont entièrement protégées.'
    }
  ];

  const handleDownloadConstat = () => {
    downloadPDF('/pdf/constat_amiable_vierge.pdf', 'constat_amiable_vierge.pdf');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <Hero />
        
        {/* Features section */}
        <section className="py-16 md:py-24 bg-constalib-light-gray/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium mb-4">
                Fonctionnalités
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-constalib-dark-gray text-lg max-w-2xl mx-auto">
                Constalib.fr propose une suite complète d'outils pour simplifier la gestion de vos accidents de la route.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium mb-4">
                Processus
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
                Comment ça marche
              </h2>
              <p className="text-constalib-dark-gray text-lg max-w-2xl mx-auto">
                Un processus simple en quelques étapes pour vous aider à gérer efficacement votre déclaration d'accident.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Remplissez le constat',
                  description: 'Suivez le guide étape par étape pour compléter votre constat amiable numérique.'
                },
                {
                  step: '02',
                  title: 'Ajoutez des photos',
                  description: 'Prenez des photos des véhicules et des dommages directement dans l\'application.'
                },
                {
                  step: '03',
                  title: 'Envoyez à votre assureur',
                  description: 'Transmettez automatiquement votre constat à votre compagnie d\'assurance.'
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-8 relative z-10 h-full shadow-sm border border-constalib-gray/20 hover:shadow-md transition-shadow">
                    <div className="text-4xl font-bold text-constalib-blue/20 mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-constalib-dark">
                      {item.title}
                    </h3>
                    <p className="text-constalib-dark-gray">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Connector line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-constalib-light-gray transform translate-x-1/2 -translate-y-1/2 z-0" style={{ width: '50%' }}></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/accident">
                <Button size="lg">
                  Commencer une déclaration
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Services section (replacing pricing) */}
        <section className="py-16 md:py-24 bg-constalib-light-gray/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium mb-4">
                Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
                Gérez tous vos besoins
              </h2>
              <p className="text-constalib-dark-gray text-lg max-w-2xl mx-auto">
                Constalib.fr vous permet de gérer tous les aspects liés à votre déclaration d'accident.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link to="/documents" className="bg-white rounded-xl p-8 flex flex-col items-center text-center border border-constalib-gray/20 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-constalib-light-blue/30 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-constalib-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-constalib-dark">Mes Documents</h3>
                <p className="text-constalib-dark-gray">
                  Accédez à tous vos documents de déclaration et suivez leur traitement par votre assureur.
                </p>
              </Link>
              
              <Link to="/appointments" className="bg-white rounded-xl p-8 flex flex-col items-center text-center border border-constalib-gray/20 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-constalib-light-blue/30 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-constalib-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-constalib-dark">Mes Rendez-vous</h3>
                <p className="text-constalib-dark-gray">
                  Planifiez et gérez vos rendez-vous avec les experts et les carrossiers partenaires.
                </p>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-constalib-blue/5 to-constalib-light-blue/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-constalib-dark">
                Prêt à simplifier vos déclarations d'accident ?
              </h2>
              <p className="text-constalib-dark-gray text-lg mb-8">
                Créez votre profil dès maintenant et gagnez du temps lors de vos futures déclarations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/profile">
                  <Button size="lg">
                    Créer mon profil
                  </Button>
                </Link>
                <Link to="/accident">
                  <Button variant="outline" size="lg">
                    Déclarer sans profil
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Download blank form section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-constalib-dark">
                Besoin d'un constat amiable papier ?
              </h2>
              <p className="text-constalib-dark-gray text-lg mb-8">
                Téléchargez un constat amiable vierge au format PDF à imprimer pour l'avoir toujours avec vous.
              </p>
              <Button 
                variant="secondary" 
                size="lg" 
                className="inline-flex items-center gap-2"
                onClick={handleDownloadConstat}
              >
                <Download className="w-5 h-5" />
                Télécharger le constat vierge (PDF)
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-constalib-light-gray py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <span className="text-constalib-blue font-bold text-2xl tracking-tight">Constalib.fr</span>
              <p className="text-constalib-dark-gray mt-4 max-w-xs">
                Simplifiez vos déclarations d'accident avec notre application intuitive et efficace.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-constalib-dark font-semibold mb-4">Application</h3>
                <ul className="space-y-2 text-constalib-dark-gray">
                  <li><Link to="/" className="hover:text-constalib-blue">Accueil</Link></li>
                  <li><Link to="/accident" className="hover:text-constalib-blue">Déclarer un accident</Link></li>
                  <li><Link to="/profile" className="hover:text-constalib-blue">Mon profil</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-constalib-dark font-semibold mb-4">Services</h3>
                <ul className="space-y-2 text-constalib-dark-gray">
                  <li><Link to="/documents" className="hover:text-constalib-blue">Mes Documents</Link></li>
                  <li><Link to="/appointments" className="hover:text-constalib-blue">Mes Rendez-vous</Link></li>
                  <li><a href="#" className="hover:text-constalib-blue">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-constalib-dark font-semibold mb-4">Légal</h3>
                <ul className="space-y-2 text-constalib-dark-gray">
                  <li><a href="#" className="hover:text-constalib-blue">Mentions légales</a></li>
                  <li><a href="#" className="hover:text-constalib-blue">Confidentialité</a></li>
                  <li><a href="#" className="hover:text-constalib-blue">CGU</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-constalib-light-gray text-center text-constalib-dark-gray text-sm">
            &copy; {new Date().getFullYear()} Constalib.fr. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
