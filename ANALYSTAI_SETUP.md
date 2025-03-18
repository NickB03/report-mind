
# AnalystAI Setup Guide

This guide provides step-by-step instructions for setting up and deploying the AnalystAI application, including all required API integrations and configurations.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A Google Cloud Platform (GCP) account
- Firebase project
- Git

## Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/analystai.git
   cd analystai
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the necessary variables (see Environment Configuration section below)

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Environment Configuration

Create a `.env` file in the root of your project with the following variables:

```
# API Base URL
REACT_APP_API_BASE_URL=https://your-api-base-url.com

# Google Authentication
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GOOGLE_API_KEY=your-google-api-key

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id

# Gemini AI API 
REACT_APP_GEMINI_API_KEY=your-gemini-api-key
```

## API Integration Setup

### 1. Google Sign-In Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add authorized JavaScript origins (e.g., `http://localhost:3000` for development)
7. Add authorized redirect URIs (e.g., `http://localhost:3000/auth/google/callback`)
8. Copy the Client ID and update your `.env` file

### 2. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication and add Google as a sign-in provider
4. Create a Firestore database
5. Set up Firebase Storage for file uploads
6. Go to Project Settings > General > Your apps
7. Add a web app to your Firebase project
8. Copy the Firebase configuration and update your `.env` file

### 3. Gemini AI API Setup

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign up or log in
3. Navigate to API Keys in your profile settings
4. Create a new API key
5. Copy the key and update your `.env` file with `REACT_APP_GEMINI_API_KEY`

### 4. PDF Extractor Backend Setup

The PDF extractor is the core of AnalystAI's functionality:

1. Set up a FastAPI backend using Python
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure the backend with the necessary GCP credentials
4. Deploy the backend or run locally:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
5. Update the `REACT_APP_API_BASE_URL` in your `.env` file with the backend URL

## Project Structure

- `/src/components`: UI components
- `/src/contexts`: React contexts (e.g., ReportContext)
- `/src/pages`: Page components
- `/src/services`: API services
- `/src/utils`: Utility functions
- `/backend`: Python-based PDF extractor API (if included)

## Testing the Integration

1. Start the development server
2. Navigate to the login page
3. Try signing in with Google
4. Upload a PDF file to test the extraction
5. Check that results are stored in Firebase
6. Test the AI chat functionality

## Deployment Options

### Option 1: Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```

4. Build your React application:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Option 2: Deploy to Google Cloud Run

Follow the instructions in the `DEPLOY_TO_GCP.md` file for a detailed guide on deploying both the frontend and backend to Google Cloud Run.

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Ensure your Google Client ID and Firebase configuration are correct.

2. **PDF Extraction Failed**: Check that your backend API is running and accessible.

3. **Firebase Connection Issues**: Verify your Firebase configuration and check Firebase console for any errors.

4. **CORS Errors**: Make sure your backend has proper CORS headers enabled.

### Getting Help

If you encounter issues not covered in this guide:

1. Check the project documentation
2. Review the console logs for specific error messages
3. Refer to the Firebase and Google Cloud documentation
4. Contact the AnalystAI support team

## Security Best Practices

1. Never commit `.env` files to source control
2. Set appropriate security rules in Firebase
3. Implement proper authentication and authorization
4. Regularly update dependencies
5. Use environment-specific API keys

## License and Attribution

AnalystAI is licensed under [Your License]. Please ensure you comply with all third-party library licenses.

---

For more detailed information about AnalystAI, refer to the main `README.md` and the GCP deployment guide in `DEPLOY_TO_GCP.md`.
