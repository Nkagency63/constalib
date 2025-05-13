
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileCheck, FileText, CheckCircle, XCircle, BookOpen, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormData } from './types';

interface OfficialRegistrationDialogProps {
  open: boolean;
  onClose: () => void;
  formData: FormData;
  onConfirmRegistration: () => Promise<boolean>;
  isSubmitting: boolean;
  registrationComplete: boolean;
  registrationError: string | null;
}

const OfficialRegistrationDialog = ({
  open,
  onClose,
  formData,
  onConfirmRegistration,
  isSubmitting,
  registrationComplete,
  registrationError,
}: OfficialRegistrationDialogProps) => {
  const [showTerms, setShowTerms] = useState(false);

  const handleRegistration = async () => {
    await onConfirmRegistration();
  };
  
  // Conditions for the official registration
  const canRegister = formData.date && 
                      formData.time && 
                      formData.location && 
                      formData.licensePlate && 
                      formData.personalEmail;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileCheck className="h-5 w-5 mr-2" />
            Enregistrement officiel du constat
          </DialogTitle>
          <DialogDescription>
            Votre constat sera transmis aux services d'assurance.
          </DialogDescription>
        </DialogHeader>
        
        {registrationComplete ? (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-xl font-bold">Enregistrement réussi</h3>
              <p className="text-gray-500 mt-2">
                Votre constat a été enregistré avec succès et transmis aux services concernés.
                Vous recevrez une confirmation par email.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border">
              <h4 className="font-medium mb-1">Référence de votre dossier</h4>
              <p className="font-mono text-sm bg-white p-2 border rounded">
                CA-{Math.random().toString(36).substring(2, 10).toUpperCase()}-{new Date().getFullYear()}
              </p>
            </div>
          </div>
        ) : registrationError ? (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <h3 className="text-xl font-bold">Erreur lors de l'enregistrement</h3>
              <p className="text-gray-500 mt-2">
                {registrationError}
              </p>
            </div>
            
            <Alert variant="destructive">
              <AlertDescription>
                Veuillez réessayer ultérieurement ou contactez le support technique.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {!canRegister && (
              <Alert>
                <AlertDescription className="text-amber-700">
                  Des informations essentielles sont manquantes. Veuillez compléter au minimum la date, l'heure, le lieu, votre plaque d'immatriculation et votre email.
                </AlertDescription>
              </Alert>
            )}
            
            <div>
              <h4 className="font-medium mb-2">Informations à transmettre</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center mr-2">
                    {formData.date ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <span>Date et heure de l'accident</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center mr-2">
                    {formData.location ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <span>Lieu de l'accident</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center mr-2">
                    {formData.licensePlate ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <span>Informations des véhicules impliqués</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center mr-2">
                    {formData.personalEmail ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <span>Coordonnées de contact</span>
                </li>
              </ul>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => setShowTerms(!showTerms)}
              >
                <BookOpen className="h-3 w-3 mr-1" />
                {showTerms ? "Masquer" : "Afficher"} les conditions
              </Button>
              
              {showTerms && (
                <div className="mt-2 text-xs border rounded p-3 max-h-40 overflow-y-auto bg-gray-50">
                  <p className="mb-2">En enregistrant ce constat d'accident, vous confirmez que :</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Les informations fournies sont exactes et complètes à votre connaissance.</li>
                    <li>Vous autorisez la transmission de ces informations à votre assureur et aux autres parties concernées.</li>
                    <li>Vous comprenez que les informations seront utilisées dans le cadre du règlement de ce sinistre.</li>
                    <li>L'enregistrement tient lieu de signature électronique.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          {!registrationComplete && !registrationError ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                variant="default"
                onClick={handleRegistration}
                disabled={!canRegister || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    En cours...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OfficialRegistrationDialog;
