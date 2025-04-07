
import { useState } from 'react';
import { Info, Plus, X, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailStepProps {
  insuranceEmails: string[];
  setInsuranceEmails: (emails: string[]) => void;
  involvedPartyEmails: string[];
  setInvolvedPartyEmails: (emails: string[]) => void;
  personalEmail: string;
  setPersonalEmail: (email: string) => void;
}

const EmailStep = ({
  insuranceEmails,
  setInsuranceEmails,
  involvedPartyEmails,
  setInvolvedPartyEmails,
  personalEmail,
  setPersonalEmail
}: EmailStepProps) => {
  const [newInsuranceEmail, setNewInsuranceEmail] = useState('');
  const [newInvolvedEmail, setNewInvolvedEmail] = useState('');
  
  const addInsuranceEmail = () => {
    if (newInsuranceEmail && isValidEmail(newInsuranceEmail) && !insuranceEmails.includes(newInsuranceEmail)) {
      setInsuranceEmails([...insuranceEmails, newInsuranceEmail]);
      setNewInsuranceEmail('');
    }
  };
  
  const removeInsuranceEmail = (email: string) => {
    setInsuranceEmails(insuranceEmails.filter(e => e !== email));
  };
  
  const addInvolvedEmail = () => {
    if (newInvolvedEmail && isValidEmail(newInvolvedEmail) && !involvedPartyEmails.includes(newInvolvedEmail)) {
      setInvolvedPartyEmails([...involvedPartyEmails, newInvolvedEmail]);
      setNewInvolvedEmail('');
    }
  };
  
  const removeInvolvedEmail = (email: string) => {
    setInvolvedPartyEmails(involvedPartyEmails.filter(e => e !== email));
  };
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-constalib-dark">Envoi du Constat par Email</h3>
        <p className="text-sm text-constalib-dark-gray">
          Saisissez les adresses email des destinataires du constat.
        </p>
      </div>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm text-blue-700">
          Le constat sera envoyé immédiatement après soumission aux adresses email indiquées ci-dessous.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="personalEmail" className="block mb-2">Votre adresse email</Label>
          <Input
            id="personalEmail"
            type="email"
            placeholder="votre.email@exemple.com"
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}
            className="w-full"
          />
          {personalEmail && !isValidEmail(personalEmail) && (
            <p className="mt-1 text-sm text-red-500">Veuillez saisir une adresse email valide.</p>
          )}
        </div>
        
        <div>
          <Label className="block mb-2">Compagnies d'assurance</Label>
          <div className="flex gap-2 mb-2">
            <Input
              type="email"
              placeholder="assurance@exemple.com"
              value={newInsuranceEmail}
              onChange={(e) => setNewInsuranceEmail(e.target.value)}
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={addInsuranceEmail}
              disabled={!newInsuranceEmail || !isValidEmail(newInsuranceEmail) || insuranceEmails.includes(newInsuranceEmail)}
            >
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </div>
          
          {insuranceEmails.length > 0 && (
            <div className="mt-2 space-y-2">
              {insuranceEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{email}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeInsuranceEmail(email)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Label className="block mb-2">Personnes impliquées</Label>
          <div className="flex gap-2 mb-2">
            <Input
              type="email"
              placeholder="personne@exemple.com"
              value={newInvolvedEmail}
              onChange={(e) => setNewInvolvedEmail(e.target.value)}
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={addInvolvedEmail}
              disabled={!newInvolvedEmail || !isValidEmail(newInvolvedEmail) || involvedPartyEmails.includes(newInvolvedEmail)}
            >
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </div>
          
          {involvedPartyEmails.length > 0 && (
            <div className="mt-2 space-y-2">
              {involvedPartyEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{email}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeInvolvedEmail(email)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailStep;
