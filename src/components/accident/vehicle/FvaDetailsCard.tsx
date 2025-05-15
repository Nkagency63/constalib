
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Calendar, User, Home, Phone, Mail, Check } from 'lucide-react';
import { FvaData } from '../types/vehicleTypes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FvaDetailsCardProps {
  fvaData: FvaData;
}

const FvaDetailsCard = ({ fvaData }: FvaDetailsCardProps) => {
  // Format dates for better readability
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-blue-800">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Informations d'assurance (FVA)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-blue-200 pb-2 md:pb-0 md:pr-4">
            <h4 className="font-medium text-blue-700">Informations véhicule</h4>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">Marque:</span>
              <span className="col-span-2">{fvaData.vehicleInfo.brand}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">Modèle:</span>
              <span className="col-span-2">{fvaData.vehicleInfo.model}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">Immatriculation:</span>
              <span className="col-span-2">{fvaData.vehicleInfo.licensePlate}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">N° VIN:</span>
              <span className="col-span-2">{fvaData.vehicleInfo.vin}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">Première immat.:</span>
              <span className="col-span-2">{formatDate(fvaData.vehicleInfo.firstRegistration)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-blue-700">Informations assurance</h4>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">Compagnie:</span>
              <span className="col-span-2 font-medium">{fvaData.insuranceInfo.company}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">N° police:</span>
              <span className="col-span-2">{fvaData.insuranceInfo.policyNumber}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">Contrat:</span>
              <span className="col-span-2">{fvaData.insuranceInfo.contractName}</span>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <span className="text-blue-700 font-medium">Validité:</span>
              <span className="col-span-2">
                Du {formatDate(fvaData.insuranceInfo.validFrom)} au {formatDate(fvaData.insuranceInfo.validUntil)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-blue-200">
          <h4 className="font-medium text-blue-700 mb-2">Garanties</h4>
          <div className="flex flex-wrap gap-2">
            {fvaData.insuranceInfo.guarantees.map((guarantee, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Check className="h-3 w-3 mr-1" />
                {guarantee}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-blue-200">
          <h4 className="font-medium text-blue-700 mb-2">Informations assuré</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-600" /> 
              {fvaData.insuranceInfo.insuredName}
            </div>
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2 text-blue-600" /> 
              {fvaData.insuranceInfo.insuredAddress}
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-blue-600" /> 
              {fvaData.insuranceInfo.insuredPhone}
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-600" /> 
              {fvaData.insuranceInfo.insuredEmail}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FvaDetailsCard;
