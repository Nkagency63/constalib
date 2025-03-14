
import { AlertCircle } from 'lucide-react';

interface FormData {
  date: string;
  time: string;
  location: string;
  description: string;
  vehiclePhotos: File[];
  damagePhotos: File[];
}

interface ReviewStepProps {
  formData: FormData;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-constalib-dark">Récapitulatif</h3>
        <p className="text-sm text-constalib-dark-gray">
          Vérifiez les informations saisies avant de soumettre votre déclaration.
        </p>
        
        <div className="bg-constalib-light-blue rounded-lg p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-constalib-dark">Date et heure</h4>
            <p className="text-constalib-dark-gray">{formData.date} à {formData.time || 'Non spécifié'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-constalib-dark">Lieu</h4>
            <p className="text-constalib-dark-gray">{formData.location || 'Non spécifié'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-constalib-dark">Description</h4>
            <p className="text-constalib-dark-gray">{formData.description || 'Aucune description fournie'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-constalib-dark">Photos</h4>
            <p className="text-constalib-dark-gray">
              {formData.vehiclePhotos.length} photo(s) de véhicule(s), {formData.damagePhotos.length} photo(s) de dégât(s)
            </p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Une fois soumise, votre déclaration sera envoyée à votre assureur et ne pourra plus être modifiée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
