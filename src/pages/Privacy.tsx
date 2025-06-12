
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Eye, FileText, Cookie, UserCheck, AlertTriangle } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Shield className="h-16 w-16 text-constalib-blue mx-auto" />
            <h1 className="text-3xl font-bold text-constalib-dark">
              Politique de Confidentialité & RGPD
            </h1>
            <p className="text-constalib-dark-gray">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <UserCheck className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Vos droits RGPD</h3>
                <p className="text-blue-700 text-sm">
                  Conformément au Règlement Général sur la Protection des Données (RGPD), 
                  vous disposez de droits sur vos données personnelles que nous respectons scrupuleusement.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            <section className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-constalib-blue" />
                <h2 className="text-2xl font-semibold text-constalib-dark">1. Collecte des données</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-constalib-dark">Données collectées :</h3>
                <ul className="space-y-2 text-constalib-dark-gray">
                  <li>• <strong>Données d'accident :</strong> Date, heure, lieu, description des circonstances</li>
                  <li>• <strong>Informations véhicules :</strong> Plaques d'immatriculation, marque, modèle</li>
                  <li>• <strong>Données personnelles :</strong> Nom, adresse, téléphone, email (conducteurs et assurés)</li>
                  <li>• <strong>Photos :</strong> Images des véhicules et des dégâts</li>
                  <li>• <strong>Données techniques :</strong> Adresse IP, données de géolocalisation</li>
                </ul>
                <h3 className="font-semibold text-constalib-dark mt-4">Finalités :</h3>
                <ul className="space-y-2 text-constalib-dark-gray">
                  <li>• Génération et transmission des constats d'accident</li>
                  <li>• Communication avec les assurances</li>
                  <li>• Amélioration de nos services</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-3">
                <Eye className="h-6 w-6 text-constalib-blue" />
                <h2 className="text-2xl font-semibold text-constalib-dark">2. Vos droits</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-constalib-dark mb-2">Droit d'accès</h3>
                    <p className="text-sm text-constalib-dark-gray">
                      Vous pouvez demander l'accès à vos données personnelles.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-constalib-dark mb-2">Droit de rectification</h3>
                    <p className="text-sm text-constalib-dark-gray">
                      Vous pouvez demander la correction de données inexactes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-constalib-dark mb-2">Droit à l'effacement</h3>
                    <p className="text-sm text-constalib-dark-gray">
                      Vous pouvez demander la suppression de vos données.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-constalib-dark mb-2">Droit à la portabilité</h3>
                    <p className="text-sm text-constalib-dark-gray">
                      Vous pouvez récupérer vos données dans un format structuré.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-3">
                <Cookie className="h-6 w-6 text-constalib-blue" />
                <h2 className="text-2xl font-semibold text-constalib-dark">3. Cookies et traceurs</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-constalib-dark">Types de cookies utilisés :</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-constalib-dark">Cookies essentiels</h4>
                    <p className="text-sm text-constalib-dark-gray">
                      Nécessaires au fonctionnement du site (session, sécurité)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-constalib-dark">Cookies de performance</h4>
                    <p className="text-sm text-constalib-dark-gray">
                      Analytics pour améliorer l'expérience utilisateur (avec votre consentement)
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-constalib-blue" />
                <h2 className="text-2xl font-semibold text-constalib-dark">4. Sécurité et conservation</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-constalib-dark mb-2">Sécurité</h3>
                  <p className="text-constalib-dark-gray">
                    Vos données sont protégées par des mesures de sécurité techniques et organisationnelles 
                    appropriées (chiffrement, accès restreint, surveillance).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-constalib-dark mb-2">Conservation</h3>
                  <ul className="space-y-1 text-constalib-dark-gray">
                    <li>• Données d'accident : 5 ans (durée légale)</li>
                    <li>• Données de contact : 3 ans après le dernier contact</li>
                    <li>• Cookies : 13 mois maximum</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-constalib-dark">5. Contact et réclamations</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-constalib-dark mb-2">Délégué à la Protection des Données (DPO)</h3>
                  <p className="text-constalib-dark-gray">
                    Email : dpo@constalib.fr<br />
                    Adresse : Constalib RGPD, 123 Avenue des Données, 75001 Paris
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-constalib-dark mb-2">Réclamations</h3>
                  <p className="text-constalib-dark-gray">
                    Vous pouvez introduire une réclamation auprès de la CNIL : 
                    <a href="https://www.cnil.fr" className="text-constalib-blue hover:underline ml-1">
                      www.cnil.fr
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
