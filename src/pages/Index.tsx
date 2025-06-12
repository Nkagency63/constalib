
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ServicesSection from '@/components/home/ServicesSection';
import CtaSection from '@/components/home/CtaSection';
import DownloadPdfSection from '@/components/home/DownloadPdfSection';
import AdBanner from '@/components/ads/AdBanner';
import AdSection from '@/components/ads/AdSection';
import { mockAds, bannerAds } from '@/data/adsData';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <Hero />
        
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
