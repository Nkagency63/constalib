
import { AlertCircle } from 'lucide-react';

interface DetailsStepProps {
  description: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DetailsStep = ({ description, handleInputChange }: DetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-constalib-dark">
          Description de l'accident
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={handleInputChange}
          rows={6}
          placeholder="Décrivez les circonstances de l'accident..."
          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue resize-none"
          required
        />
        <p className="text-sm text-constalib-dark-gray mt-1">
          Soyez aussi précis que possible. Mentionnez les conditions météorologiques, l'état de la route, etc.
        </p>
      </div>
      
      <div className="bg-constalib-light-blue p-4 rounded-lg flex items-start space-x-3">
        <AlertCircle className="text-constalib-blue flex-shrink-0 mt-1" size={20} />
        <div>
          <h4 className="text-constalib-blue font-medium">Conseil</h4>
          <p className="text-sm text-constalib-dark-gray">
            N'admettez pas de responsabilité dans votre description. Contentez-vous de décrire objectivement les faits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
