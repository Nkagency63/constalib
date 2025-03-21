
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-constalib-dark mb-6">À propos de Constalib</h1>
            
            <p className="text-lg text-constalib-dark-gray mb-6">
              Constalib est une solution innovante qui simplifie la déclaration d'accidents de la route en France.
              Notre mission est de rendre ce processus, souvent stressant, aussi simple et rapide que possible.
            </p>

            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold text-constalib-dark mb-4">Notre Mission</h2>
            <p className="text-lg text-constalib-dark-gray mb-6">
              Nous avons créé Constalib avec un objectif clair : transformer l'expérience de déclaration d'accident pour tous les conducteurs français. 
              Notre plateforme vous guide étape par étape à travers le processus, éliminant la confusion et réduisant le stress dans ces moments difficiles.
            </p>
            
            <h2 className="text-2xl font-semibold text-constalib-dark mb-4 mt-8">Nos Avantages</h2>
            <ul className="list-disc pl-6 text-lg text-constalib-dark-gray space-y-3 mb-8">
              <li>Un processus de déclaration guidé et intuitif</li>
              <li>Une transmission directe des informations à votre assureur</li>
              <li>Un suivi en temps réel de l'état de votre dossier</li>
              <li>Des conseils personnalisés après un accident</li>
              <li>Une assistance disponible 7j/7</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-constalib-dark mb-4 mt-8">Notre Équipe</h2>
            <p className="text-lg text-constalib-dark-gray mb-6">
              Constalib est composé d'experts en assurance, de développeurs et de designers passionnés par l'amélioration des services numériques pour les citoyens français.
              Notre équipe travaille constamment à l'amélioration de notre plateforme pour vous offrir la meilleure expérience possible.
            </p>
            
            <div className="bg-constalib-light-blue/30 p-6 rounded-lg mt-10">
              <h3 className="text-xl font-semibold text-constalib-dark mb-3">Prêt à simplifier vos démarches?</h3>
              <p className="text-lg text-constalib-dark-gray">
                Découvrez dès maintenant comment Constalib peut vous aider à gérer facilement vos déclarations d'accidents.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
