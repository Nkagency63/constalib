import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { downloadPDF } from '@/utils/downloadUtils';

interface DownloadPdfSectionProps {
  pdfUrl: string;
  fileName?: string;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

const DownloadPdfSection: React.FC<DownloadPdfSectionProps> = ({
  pdfUrl,
  fileName = 'document.pdf',
  buttonText = 'Télécharger le PDF',
  className = '',
  variant = 'default'
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPDF(pdfUrl, fileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleDownload}
      disabled={isDownloading}
      className={className}
    >
      <FileDown className="mr-2 h-4 w-4" />
      {isDownloading ? 'Téléchargement...' : buttonText}
    </Button>
  );
};

export default DownloadPdfSection;
