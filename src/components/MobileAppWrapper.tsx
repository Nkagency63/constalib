
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

interface MobileAppWrapperProps {
  children: React.ReactNode;
}

const MobileAppWrapper: React.FC<MobileAppWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Listen for app URL open events (deep links)
    if (Capacitor.isPluginAvailable('App')) {
      // Handle deep links
      CapacitorApp.addListener('appUrlOpen', (data: { url: string }) => {
        // Example: handle deep links
        const slug = data.url.split('constalib.fr/').pop();
        if (slug) {
          // Handle navigation to specific route based on slug
          console.log('Deep link detected:', slug);
          // Further routing logic can be added here
        }
      });
      
      // Listen for back button on Android
      CapacitorApp.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
        if (!canGoBack) {
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });

      return () => {
        // Clean up listeners when component unmounts
        CapacitorApp.removeAllListeners();
      };
    }
  }, []);

  return <>{children}</>;
};

export default MobileAppWrapper;
