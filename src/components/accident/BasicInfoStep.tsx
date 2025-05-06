
import { Calendar } from 'lucide-react';

interface BasicInfoStepProps {
  date: string;
  time: string;
  location?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setGeolocation?: (lat: number, lng: number, address: string) => void;
}

const BasicInfoStep = ({ date, time, location = '', handleInputChange, setGeolocation }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-constalib-dark">
          Date de l'accident
        </label>
        <div className="relative">
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
            required
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-constalib-dark-gray" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="time" className="block text-sm font-medium text-constalib-dark">
          Heure de l'accident
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={time}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium text-constalib-dark">
          Lieu de l'accident
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-constalib-gray rounded-lg focus:ring-2 focus:ring-constalib-blue focus:border-constalib-blue"
          placeholder="Adresse, ville, code postal..."
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;
