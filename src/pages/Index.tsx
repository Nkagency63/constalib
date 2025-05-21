
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ServicesSection from '@/components/home/ServicesSection';
import CtaSection from '@/components/home/CtaSection';
import DownloadPdfSection from '@/components/home/DownloadPdfSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <Hero />
        
        {/* Features section */}
        <FeaturesSection />
        
        {/* How it works section */}
        <HowItWorksSection />
        
        {/* Services section */}
        <ServicesSection />
        
        {/* Download PDF section */}
        <DownloadPdfSection />
        
        {/* CTA section */}
        <CtaSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
