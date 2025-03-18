
/**
 * API Configuration for AnalystAI
 * 
 * This file contains configuration for various API services used by AnalystAI.
 * In a production environment, sensitive values should be stored in environment variables.
 */

// Base API configuration
export const API_CONFIG = {
  // Base URL for API requests
  baseUrl: process.env.REACT_APP_API_BASE_URL || "https://api.example.com",
  
  // API Keys (these should be moved to environment variables in production)
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
  
  // Google Drive API configuration
  googleDrive: {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    scope: "https://www.googleapis.com/auth/drive.readonly",
  },
  
  // Google Cloud Storage configuration
  cloudStorage: {
    bucketName: process.env.REACT_APP_GCS_BUCKET_NAME || "analystai-storage",
  },
  
  // Firebase/Firestore configuration
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
  },
  
  // Gemini AI API configuration
  gemini: {
    apiKey: process.env.REACT_APP_GEMINI_API_KEY || "",
    modelName: "gemini-pro",
  }
};

/**
 * Gets an API configuration value safely
 * @param path Path to the configuration value (e.g., 'firebase.apiKey')
 * @returns The configuration value or undefined if not found
 */
export const getApiConfig = (path: string): any => {
  const keys = path.split('.');
  return keys.reduce((obj, key) => {
    return obj && obj[key] !== undefined ? obj[key] : undefined;
  }, API_CONFIG as any);
};

// Export individual configurations for convenience
export const firebaseConfig = API_CONFIG.firebase;
export const geminiConfig = API_CONFIG.gemini;
export const googleDriveConfig = API_CONFIG.googleDrive;
