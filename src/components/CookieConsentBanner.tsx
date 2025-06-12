
import React, { useState } from 'react';
import { X, Settings, Cookie, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Link } from 'react-router-dom';

const CookieConsentBanner = () => {
  const { showBanner, consent, acceptAll, acceptEssential, updateConsent, setShowBanner } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [tempConsent, setTempConsent] = useState(consent);

  if (!showBanner) return null;

  const handleCustomize = () => {
    setTempConsent(consent);
    setShowDetails(true);
  };

  const handleSaveCustom = () => {
    updateConsent(tempConsent);
    setShowDetails(false);
  };

  if (showDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-constalib-blue" />
                Paramètres des cookies
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-constalib-dark-gray">
              Choisissez les types de cookies que vous souhaitez autoriser. 
              Ces paramètres ne s'appliquent qu'à ce navigateur et cet appareil.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <Label className="font-medium">Cookies essentiels</Label>
                  </div>
                  <p className="text-sm text-constalib-dark-gray">
                    Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.
                  </p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Cookie className="h-4 w-4 text-blue-600" />
                    <Label className="font-medium">Cookies d'analyse</Label>
                  </div>
                  <p className="text-sm text-constalib-dark-gray">
                    Nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                  </p>
                </div>
                <Switch 
                  checked={tempConsent.analytics}
                  onCheckedChange={(checked) => 
                    setTempConsent(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Cookie className="h-4 w-4 text-purple-600" />
                    <Label className="font-medium">Cookies marketing</Label>
                  </div>
                  <p className="text-sm text-constalib-dark-gray">
                    Utilisés pour personnaliser les publicités et mesurer leur efficacité.
                  </p>
                </div>
                <Switch 
                  checked={tempConsent.marketing}
                  onCheckedChange={(checked) => 
                    setTempConsent(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveCustom} className="flex-1">
                Enregistrer mes préférences
              </Button>
              <Button variant="outline" onClick={acceptAll} className="flex-1">
                Tout accepter
              </Button>
            </div>

            <p className="text-xs text-constalib-dark-gray text-center">
              En savoir plus dans notre{' '}
              <Link to="/privacy" className="text-constalib-blue hover:underline">
                politique de confidentialité
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Cookie className="h-5 w-5 text-constalib-blue" />
              <h3 className="font-semibold text-constalib-dark">Respect de votre vie privée</h3>
            </div>
            <p className="text-sm text-constalib-dark-gray">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
              Vous pouvez choisir d'accepter tous les cookies ou personnaliser vos préférences.{' '}
              <Link to="/privacy" className="text-constalib-blue hover:underline">
                En savoir plus
              </Link>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={handleCustomize} size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Personnaliser
            </Button>
            <Button variant="outline" onClick={acceptEssential} size="sm">
              Cookies essentiels
            </Button>
            <Button onClick={acceptAll} size="sm">
              Tout accepter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
