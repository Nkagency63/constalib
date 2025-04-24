
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ea057c0030534d378eb5ed039b59cdbb',
  appName: 'Constalib',
  webDir: 'dist',
  server: {
    url: 'https://ea057c00-3053-4d37-8eb5-ed039b59cdbb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#3880ff"
    },
    App: {
      webviewAllowBackForwardNavigationGestures: true
    }
  },
  ios: {
    contentInset: "always"
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
