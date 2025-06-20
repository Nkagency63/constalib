
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ServicesSection from '@/components/home/ServicesSection';
import CtaSection from '@/components/home/CtaSection';
import DownloadPdfSection from '@/components/home/DownloadPdfSection';
import ConstatAmiableSection from '@/components/home/ConstatAmiableSection';
import AdBanner from '@/components/ads/AdBanner';
import AdSection from '@/components/ads/AdSection';
import { mockAds, bannerAds } from '@/data/adsData';
import { blogPosts } from '@/data/blogData';
import Button from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <Hero />
        
        {/* Auth CTA for non-authenticated users */}
        {!user && (
          <div className="bg-constalib-light-blue py-8">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-constalib-dark mb-4">
                Créez votre compte gratuit pour sauvegarder vos constats amiables
              </h2>
              <p className="text-constalib-dark-gray mb-6">
                Enregistrez vos informations et gérez vos déclarations d'accident automobile en toute simplicité
              </p>
              <Link to="/auth">
                <Button>
                  S'inscrire gratuitement au service constat amiable
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {/* Section dédiée Constat Amiable */}
        <ConstatAmiableSection />
        
        {/* Banner publicitaire premium */}
        <div className="container mx-auto px-4">
          <AdBanner {...bannerAds[0]} />
        </div>
        
        {/* Features section */}
        <FeaturesSection />
        
        {/* Section publicitaire carrossiers */}
        <div className="container mx-auto px-4">
          <AdSection 
            title="Nos partenaires carrossiers recommandés"
            ads={mockAds.carrossiers}
            maxAds={2}
          />
        </div>
        
        {/* How it works section */}
        <HowItWorksSection />
        
        {/* Blog section */}
        <section className="py-16 md:py-24 bg-constalib-light-gray/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
                Conseils et Guides <span className="text-constalib-blue">Constat Amiable</span>
              </h2>
              <p className="text-constalib-dark-gray text-lg max-w-3xl mx-auto mb-8">
                Découvrez nos articles de blog pour tout savoir sur le constat amiable, 
                l'assurance auto et la gestion des accidents de la route.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogPosts.slice(0, 3).map((post) => (
                <Card key={post.slug} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-constalib-light-blue/20 rounded-lg mb-4 flex items-center justify-center">
                      <post.icon className="w-6 h-6 text-constalib-blue" />
                    </div>
                    <CardTitle className="text-lg mb-2">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="hover:text-constalib-blue transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-constalib-dark-gray">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-constalib-dark-gray mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm" className="w-full group">
                        Lire l'article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/blog">
                <Button size="lg">
                  Voir tous les articles du blog
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Section publicitaire assureurs */}
        <div className="container mx-auto px-4">
          <AdSection 
            title="Comparez les assurances auto"
            ads={mockAds.assureurs}
            maxAds={2}
          />
        </div>
        
        {/* Services section */}
        <ServicesSection />
        
        {/* Download PDF section */}
        <DownloadPdfSection />
        
        {/* Section publicitaire location */}
        <div className="container mx-auto px-4">
          <AdSection 
            title="Véhicules de remplacement"
            ads={mockAds.location}
            maxAds={2}
          />
        </div>
        
        {/* CTA section */}
        <CtaSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
