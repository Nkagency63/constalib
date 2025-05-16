
import React, { useState } from 'react';
import { FormData } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { CheckCircle, FilePdf, Send, Clock } from 'lucide-react';

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // PDF generation logic would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Résumé du constat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Informations de base</h3>
            <p>Date: {formData.date}</p>
            <p>Heure: {formData.time}</p>
            <p>Lieu: {formData.location}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Votre véhicule (A)</h3>
            <p>Marque: {formData.vehicleBrand || 'Non renseigné'}</p>
            <p>Modèle: {formData.vehicleModel || 'Non renseigné'}</p>
            <p>Immatriculation: {formData.licensePlate || 'Non renseigné'}</p>
            <p>Assurance: {formData.insuranceCompany || 'Non renseigné'}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Véhicule adverse (B)</h3>
            <p>Marque: {formData.otherVehicle?.brand || 'Non renseigné'}</p>
            <p>Modèle: {formData.otherVehicle?.model || 'Non renseigné'}</p>
            <p>Immatriculation: {formData.otherVehicle?.licensePlate || 'Non renseigné'}</p>
            <p>Assurance: {formData.otherVehicle?.insuranceCompany || 'Non renseigné'}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf} className="flex-1">
          {isGeneratingPdf ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <FilePdf className="mr-2 h-4 w-4" />
              Télécharger le PDF
            </>
          )}
        </Button>
        
        <Button variant="secondary" className="flex-1">
          <Send className="mr-2 h-4 w-4" />
          Envoyer par email
        </Button>
      </div>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <p className="text-green-800 text-sm">
            Votre constat est prêt à être envoyé. Vérifiez les informations avant de continuer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
