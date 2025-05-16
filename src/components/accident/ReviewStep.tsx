
import React, { useState } from 'react';
import { FormData } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { CheckCircle, File, Send, Clock, MapPin, Car, User, Camera, FileText, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import InteractiveScheme from './InteractiveScheme';

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");
  
  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // PDF generation logic would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('PDF generated successfully');
      toast.success("PDF généré avec succès !");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      // Email sending logic would go here
      await new Promise(resolve => setTimeout(resolve, 1200));
      console.log('Email sent successfully');
      toast.success("Constat envoyé par email avec succès !");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="resume" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Résumé</span>
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Véhicules</span>
          </TabsTrigger>
          <TabsTrigger value="scheme" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Schéma</span>
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-1">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Photos</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Onglet Résumé */}
        <TabsContent value="resume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé du constat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Informations de base</h3>
                <p>Date: {formatDate(formData.date)}</p>
                <p>Heure: {formData.time}</p>
                <p>Lieu: {formData.location}</p>
                {formData.geolocation?.address && (
                  <p>Adresse exacte: {formData.geolocation.address}</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Témoins et blessés</h3>
                <p>Témoins: {formData.hasWitnesses ? `Oui (${formData.witnesses?.length || 0})` : 'Non'}</p>
                <p>Blessés: {formData.hasInjuries ? 'Oui' : 'Non'}</p>
                {formData.hasInjuries && formData.injuriesDescription && (
                  <p>Description des blessures: {formData.injuriesDescription}</p>
                )}
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
                  <File className="mr-2 h-4 w-4" />
                  Télécharger le PDF
                </>
              )}
            </Button>
            
            <Button variant="secondary" className="flex-1" onClick={handleSendEmail} disabled={isSendingEmail}>
              {isSendingEmail ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer par email
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        {/* Onglet Véhicules */}
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Véhicule A (Votre véhicule)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Marque:</strong> {formData.vehicleBrand || 'Non renseigné'}</p>
              <p><strong>Modèle:</strong> {formData.vehicleModel || 'Non renseigné'}</p>
              <p><strong>Immatriculation:</strong> {formData.licensePlate || 'Non renseigné'}</p>
              <p><strong>Assurance:</strong> {formData.insuranceCompany || 'Non renseigné'}</p>
              <p><strong>N° de police:</strong> {formData.insurancePolicy || 'Non renseigné'}</p>
              {formData.vehicleDescription && (
                <p><strong>Description:</strong> {formData.vehicleDescription}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Véhicule B (Véhicule adverse)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Marque:</strong> {formData.otherVehicle?.brand || 'Non renseigné'}</p>
              <p><strong>Modèle:</strong> {formData.otherVehicle?.model || 'Non renseigné'}</p>
              <p><strong>Immatriculation:</strong> {formData.otherVehicle?.licensePlate || 'Non renseigné'}</p>
              <p><strong>Assurance:</strong> {formData.otherVehicle?.insuranceCompany || 'Non renseigné'}</p>
              <p><strong>N° de police:</strong> {formData.otherVehicle?.insurancePolicy || 'Non renseigné'}</p>
              {formData.otherVehicle?.description && (
                <p><strong>Description:</strong> {formData.otherVehicle.description}</p>
              )}
            </CardContent>
          </Card>
          
          {formData.circumstances && (
            <Card>
              <CardHeader>
                <CardTitle>Circonstances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Véhicule A</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(formData.circumstances.A || {})
                        .filter(([_, checked]) => checked)
                        .map(([id]) => (
                          <li key={`A-${id}`} className="text-sm">
                            {id}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Véhicule B</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(formData.circumstances.B || {})
                        .filter(([_, checked]) => checked)
                        .map(([id]) => (
                          <li key={`B-${id}`} className="text-sm">
                            {id}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Onglet Schéma */}
        <TabsContent value="scheme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schéma de l'accident</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.schemeData ? (
                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                  <InteractiveScheme 
                    formData={formData}
                    onUpdateSchemeData={() => {}} 
                    initialData={formData.schemeData}
                    readOnly={true}
                  />
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p>Aucun schéma n'a été créé pour cet accident.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Photos */}
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Photos du constat</CardTitle>
            </CardHeader>
            <CardContent>
              {(formData.vehiclePhotos?.length > 0 || formData.damagePhotos?.length > 0) ? (
                <div className="space-y-6">
                  {formData.vehiclePhotos?.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Photos des véhicules</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.isArray(formData.vehiclePhotos) ? (
                          formData.vehiclePhotos.map((photo, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              {typeof photo === 'string' ? (
                                <img 
                                  src={photo} 
                                  alt={`Photo de véhicule ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Camera className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-4">
                            Format de données photos non supporté
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {formData.damagePhotos?.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Photos des dommages</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.isArray(formData.damagePhotos) ? (
                          formData.damagePhotos.map((photo, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              {typeof photo === 'string' ? (
                                <img 
                                  src={photo} 
                                  alt={`Photo de dommage ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Camera className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-4">
                            Format de données photos non supporté
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p>Aucune photo n'a été ajoutée au constat.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
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
