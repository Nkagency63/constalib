import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ServicesSection from '@/components/home/ServicesSection';
import CtaSection from '@/components/home/CtaSection';
import DownloadPdfSection from '@/components/home/DownloadPdfSection';
import UploadPdfSection from '@/components/home/UploadPdfSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DownloadPdfSection pdfUrl="/pdf/constat-amiable-vierge.pdf" />
        <UploadPdfSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
