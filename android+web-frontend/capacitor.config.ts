import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shutro.app', // Your app's unique identifier (Bundle ID for iOS, Application ID for Android)
  appName: 'Shutro.App', // The human-friendly name of your app
  webDir: 'build/client', // Remove or comment out this line as your app is not a static SPA
  bundledWebRuntime: false, // Recommended for modern frameworks like Remix, React, Vue, Angular

  // This is the crucial part for your Remix app:
  server: {
    url: 'https://shutro.netlify.app', // **REPLACE THIS with your actual Netlify deployment URL**
    // hostname: 'your-shutro-app.netlify.app', // Optional: Can be helpful for deep linking/autofill on Android
    // androidScheme: 'https', // Optional: Use 'https' if your remote URL is HTTPS for Android app links
    // You might use 'cleartext: true' for local development if your dev server runs on HTTP
    // cleartext: true, 
  },
  
  // Optional: Common Capacitor configurations
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Duration in milliseconds for the splash screen to show
      launchAutoHide: true, // Automatically hide the splash screen after launchShowDuration
      backgroundColor: "#ffffffff", // Background color of the splash screen
      androidSplashResourceName: "splash", // Name of the splash image in Android drawable
      iosSpinnerStyle: "small", // Style of the spinner on iOS (light, dark, small)
      spinnerColor: "#999999", // Color of the spinner
      showSpinner: true, // Show a spinner on the splash screen
      androidScaleType: "CENTER_CROP", // How the splash image scales on Android
    },
    Keyboard: {
      resize: "ionic", // Adjusts content when keyboard appears (ionic, body, none)
      style: "dark", // Keyboard appearance style (light or dark)
    },
    // Add other plugins as needed, e.g., Camera, Geolocation, etc.
  },
  
  // Optional: Platform-specific configurations
  android: {
    // path: 'android', // Default path to Android project
    // allowMixedContent: true, // Set to true if you need to load HTTP content from an HTTPS page
    // webContentsDebuggingEnabled: true, // Enable webview debugging via Chrome DevTools
  },
  ios: {
    // path: 'ios', // Default path to iOS project
    // preferredContentMode: 'mobile', // 'mobile' or 'desktop' for user agent
  },
};

export default config;