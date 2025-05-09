
import React from 'react';
import { Shield, Calendar, Fingerprint, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FvaData } from '../types/vehicleTypes';

interface FvaDetailsCardProps {
  fvaData: FvaData;
}

const FvaDetailsCard = ({ fvaData }: FvaDetailsCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Card className="border-constalib-blue bg-constalib-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-constalib-blue flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Information complète du FVA
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-constalib-dark">Véhicule</h4>
            <ul className="space-y-1 text-constalib-dark-gray">
              <li className="flex items-center gap-1">
                <Info className="h-4 w-4 text-constalib-blue" />
                <span className="font-medium">Plaque : </span>
                {fvaData.vehicleInfo.licensePlate}
              </li>
              <li className="flex items-center gap-1">
                <Fingerprint className="h-4 w-4 text-constalib-blue" />
                <span className="font-medium">VIN : </span>
                {fvaData.vehicleInfo.vin}
              </li>
              <li className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-constalib-blue" />
                <span className="font-medium">1ère immatriculation : </span>
                {formatDate(fvaData.vehicleInfo.firstRegistration)}
              </li>
              <li className="flex items-center gap-1">
                <Info className="h-4 w-4 text-constalib-blue" />
                <span className="font-medium">Marque/modèle : </span>
                {fvaData.vehicleInfo.brand} {fvaData.vehicleInfo.model}
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-constalib-dark">Assurance</h4>
            <ul className="space-y-1 text-constalib-dark-gray">
              <li className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-constalib-blue" />
                <span className="font-medium">Compagnie : </span>
                {fvaData.insuranceInfo.company}
              </li>
              <li className="flex items-center gap-1">
                <Info className="h-4 w-4 text-constalib-blue" />
                <span className="font-medium">Police n° : </span>
                {fvaData.insuranceInfo.policyNumber}
              </li>
              <li className="flex items-center gap-1">
                <Info className="h-4 w-4 text-constalib-blue" />
                <span className="font-medium">Contrat : </span>
                {fvaData.insuranceInfo.contractName}
              </li>
              <li className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-constalib-blue" />
                <span className="font-medium">Validité : </span>
                du {formatDate(fvaData.insuranceInfo.validFrom)} au {formatDate(fvaData.insuranceInfo.validUntil)}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-constalib-dark">Garanties</h4>
          <div className="flex flex-wrap gap-2">
            {fvaData.insuranceInfo.guarantees.map((guarantee, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-constalib-blue-100 text-constalib-blue rounded-full text-xs"
              >
                {guarantee}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2 text-constalib-dark">Informations assuré</h4>
          <ul className="space-y-1 text-constalib-dark-gray">
            <li className="flex items-center gap-1">
              <Info className="h-4 w-4 text-constalib-blue" />
              <span className="font-medium">Nom : </span>
              {fvaData.insuranceInfo.insuredName}
            </li>
            <li className="flex items-center gap-1">
              <Info className="h-4 w-4 text-constalib-blue" />
              <span className="font-medium">Adresse : </span>
              {fvaData.insuranceInfo.insuredAddress}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FvaDetailsCard;
