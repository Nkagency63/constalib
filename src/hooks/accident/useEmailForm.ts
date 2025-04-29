
import { useState } from 'react';

export const useEmailForm = (initialData?: any) => {
  const [personalEmail, setPersonalEmail] = useState<string>(initialData?.personalEmail || '');
  const [insuranceEmails, setInsuranceEmails] = useState<string[]>(initialData?.insuranceEmails || []);
  const [involvedPartyEmails, setInvolvedPartyEmails] = useState<string[]>(initialData?.involvedPartyEmails || []);

  const handleSetPersonalEmail = (email: string) => {
    setPersonalEmail(email);
  };

  const handleSetInsuranceEmails = (emails: string[]) => {
    setInsuranceEmails(emails);
  };

  const handleSetInvolvedPartyEmails = (emails: string[]) => {
    setInvolvedPartyEmails(emails);
  };

  return {
    personalEmail,
    insuranceEmails,
    involvedPartyEmails,
    setPersonalEmail: handleSetPersonalEmail,
    setInsuranceEmails: handleSetInsuranceEmails,
    setInvolvedPartyEmails: handleSetInvolvedPartyEmails,
    getEmailData: () => ({
      personalEmail,
      insuranceEmails,
      involvedPartyEmails
    })
  };
};
