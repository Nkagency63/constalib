
import { Mail } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface EmailsCardProps {
  personalEmail: string;
  insuranceEmails: string[];
  involvedPartyEmails: string[];
}

const EmailsCard = ({ personalEmail, insuranceEmails, involvedPartyEmails }: EmailsCardProps) => {
  return (
    <ReviewCard icon={<Mail className="h-5 w-5 text-constalib-blue" />} title="Envoi du constat">
      {personalEmail && (
        <p className="text-sm text-constalib-dark-gray">
          <span className="font-medium">Votre email:</span> {personalEmail}
        </p>
      )}
      
      {insuranceEmails.length > 0 && (
        <div className="mt-1">
          <p className="text-sm text-constalib-dark-gray">
            <span className="font-medium">Compagnies d'assurance:</span> 
          </p>
          <ul className="list-disc pl-5 text-sm text-constalib-dark-gray">
            {insuranceEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      )}
      
      {involvedPartyEmails.length > 0 && (
        <div className="mt-1">
          <p className="text-sm text-constalib-dark-gray">
            <span className="font-medium">Personnes impliquées:</span> 
          </p>
          <ul className="list-disc pl-5 text-sm text-constalib-dark-gray">
            {involvedPartyEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      )}
    </ReviewCard>
  );
};

export default EmailsCard;
