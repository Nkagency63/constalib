
import { useState, useEffect } from 'react';

interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'constalib-cookie-consent';
const CONSENT_DATE_KEY = 'constalib-consent-date';

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true, // Always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    const consentDate = localStorage.getItem(CONSENT_DATE_KEY);
    
    if (savedConsent && consentDate) {
      // Check if consent is older than 13 months
      const consentTimestamp = parseInt(consentDate);
      const thirteenMonthsAgo = Date.now() - (13 * 30 * 24 * 60 * 60 * 1000);
      
      if (consentTimestamp > thirteenMonthsAgo) {
        setConsent(JSON.parse(savedConsent));
        setShowBanner(false);
      } else {
        // Consent expired, show banner again
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const newConsent = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setConsent(newConsent);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    localStorage.setItem(CONSENT_DATE_KEY, Date.now().toString());
    setShowBanner(false);
  };

  const acceptEssential = () => {
    const newConsent = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setConsent(newConsent);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    localStorage.setItem(CONSENT_DATE_KEY, Date.now().toString());
    setShowBanner(false);
  };

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent = { ...consent, ...newConsent, essential: true };
    setConsent(updatedConsent);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(updatedConsent));
    localStorage.setItem(CONSENT_DATE_KEY, Date.now().toString());
    setShowBanner(false);
  };

  const resetConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_DATE_KEY);
    setConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });
    setShowBanner(true);
  };

  return {
    showBanner,
    consent,
    acceptAll,
    acceptEssential,
    updateConsent,
    resetConsent,
    setShowBanner,
  };
};
