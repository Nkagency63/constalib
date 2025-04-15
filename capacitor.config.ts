
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ea057c0030534d378eb5ed039b59cdbb',
  appName: 'constalib',
  webDir: 'dist',
  server: {
    url: 'https://ea057c00-3053-4d37-8eb5-ed039b59cdbb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000
    }
  }
};

export default config;
