
# AnalystAI Setup Guide

This guide provides instructions for setting up AnalystAI, including all required API integrations and configurations.

## Prerequisites

- Node.js (v14 or later)
- A Google Cloud Platform (GCP) account
- Firebase project (can be created in GCP)

## Environment Configuration

AnalystAI requires several environment variables to be set for proper operation. Create a `.env` file in the root of the project with the following variables:

```
# API Base URL
REACT_APP_API_BASE_URL=https://your-api-base-url.com

# Google API & Authentication
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GOOGLE_API_KEY=your-google-api-key

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id

# Google Cloud Storage
REACT_APP_GCS_BUCKET_NAME=your-gcs-bucket-name

# Gemini AI API
REACT_APP_GEMINI_API_KEY=your-gemini-api-key
```

## Setting Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add authorized JavaScript origins (e.g., `http://localhost:3000` for development)
7. Add authorized redirect URIs (e.g., `http://localhost:3000/auth/google/callback`)
8. Copy the Client ID and update the `.env` file

## Setting Up Google Drive API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google Drive API" and enable it
3. Create an API key or use an existing one
4. Update the `.env` file with the API key

## Setting Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to Project Settings to find your Firebase configuration
4. Update the `.env` file with the Firebase configuration values
5. Enable Authentication and add Google as a sign-in method
6. Create Firestore database and configure security rules

## Setting Up Gemini AI API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Gemini API" and enable it
3. Create an API key or use an existing one
4. Update the `.env` file with the API key

## Deployment to Google Cloud Platform

### Option 1: Cloud Run (Recommended)

1. Build your Docker image:
   ```
   docker build -t gcr.io/[PROJECT_ID]/analystai .
   ```

2. Push to Google Container Registry:
   ```
   docker push gcr.io/[PROJECT_ID]/analystai
   ```

3. Deploy to Cloud Run:
   ```
   gcloud run deploy analystai --image gcr.io/[PROJECT_ID]/analystai --platform managed
   ```

4. Set environment variables in Cloud Run:
   - In the GCP Console, go to Cloud Run > Your service
   - Click "Edit & Deploy New Revision"
   - Add all environment variables from your `.env` file

### Option 2: App Engine

1. Create an `app.yaml` file in the root of your project:
   ```yaml
   runtime: nodejs16
   
   env_variables:
     REACT_APP_API_BASE_URL: "https://your-api-base-url.com"
     REACT_APP_GOOGLE_CLIENT_ID: "your-google-client-id"
     # Add all other environment variables here
   ```

2. Deploy to App Engine:
   ```
   gcloud app deploy
   ```

## Security Best Practices

1. **Environment Variables**: Never commit the `.env` file to your repository. Add it to `.gitignore`.

2. **API Keys**: Set appropriate restrictions on your API keys in the Google Cloud Console:
   - Restrict by IP address
   - Restrict by HTTP referrer
   - Set usage quotas

3. **Firebase Security Rules**: Configure proper security rules for Firestore and Storage to restrict access.

4. **OAuth Scopes**: Request only the minimum scopes needed for your application.

5. **CORS Configuration**: Configure CORS properly to prevent unauthorized domains from accessing your APIs.

## Troubleshooting

- **Authentication Issues**: Ensure redirect URIs are correctly configured in the Google Cloud Console.
- **API Quotas**: Check usage quotas in the Google Cloud Console if API calls fail.
- **Firebase Permissions**: Verify security rules if Firestore operations fail.
- **Missing Environment Variables**: Ensure all required environment variables are set.

For more assistance, refer to the documentation for each service or contact support.
