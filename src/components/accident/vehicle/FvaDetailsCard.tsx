
import { FvaData } from '../types/vehicleTypes';
import { formatDateFr } from '../utils/licensePlateFormatters';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FvaDetailsCardProps {
  fvaData: FvaData;
}

const FvaDetailsCard = ({ fvaData }: FvaDetailsCardProps) => {
  if (!fvaData) return null;
  
  return (
    <Card className="mb-6 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Informations du FVA</CardTitle>
        <CardDescription>
          Fichier des Véhicules Assurés - Données complètes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Informations du véhicule</h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Immatriculation</dt>
              <dd>{fvaData.vehicleInfo.licensePlate}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">VIN</dt>
              <dd>{fvaData.vehicleInfo.vin}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Marque / Modèle</dt>
              <dd>{fvaData.vehicleInfo.brand} {fvaData.vehicleInfo.model}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Première immatriculation</dt>
              <dd>{formatDateFr(fvaData.vehicleInfo.firstRegistration)}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Informations d'assurance</h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Compagnie</dt>
              <dd>{fvaData.insuranceInfo.company}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Numéro de police</dt>
              <dd>{fvaData.insuranceInfo.policyNumber}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Contrat</dt>
              <dd>{fvaData.insuranceInfo.contractName}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Validité</dt>
              <dd>Du {formatDateFr(fvaData.insuranceInfo.validFrom)} au {formatDateFr(fvaData.insuranceInfo.validUntil)}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Informations de l'assuré</h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="col-span-2">
              <dt className="text-gray-500">Nom</dt>
              <dd>{fvaData.insuranceInfo.insuredName}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-gray-500">Adresse</dt>
              <dd>{fvaData.insuranceInfo.insuredAddress}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Téléphone</dt>
              <dd>{fvaData.insuranceInfo.insuredPhone}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-gray-500">Email</dt>
              <dd>{fvaData.insuranceInfo.insuredEmail}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Garanties</h4>
          <div className="flex flex-wrap gap-2">
            {fvaData.insuranceInfo.guarantees.map((guarantee, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                {guarantee}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FvaDetailsCard;
