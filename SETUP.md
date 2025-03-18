
# AnalystAI Setup Guide

This guide provides instructions for setting up AnalystAI, including all required API integrations and configurations.

## Prerequisites

- Node.js (v14 or later)
- Python 3.9+ (for the PDF extractor backend)
- Docker (for containerizing the backend)
- A Google Cloud Platform (GCP) account
- Firebase project (can be created in GCP)

## Environment Configuration

AnalystAI requires several environment variables to be set for proper operation. Create a `.env` file in the root of the frontend project with the following variables:

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
7. Set up Firebase Storage for storing uploaded files

## Setting Up Gemini AI API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Gemini API" and enable it
3. Create an API key or use an existing one
4. Update the `.env` file with the API key

## PDF Extractor Backend Setup

The PDF extractor is a Python service that processes uploaded PDFs. It can be run locally for development or deployed to GCP for production.

### Local Development Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the FastAPI server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

3. Set `REACT_APP_API_BASE_URL` to `http://localhost:8000` in your `.env` file

### Docker Setup for Production

1. Build the Docker image:
   ```bash
   docker build -t analystai-pdf-extractor .
   ```

2. Run the container locally (for testing):
   ```bash
   docker run -p 8000:8000 analystai-pdf-extractor
   ```

## Deployment to Google Cloud Platform

### Frontend Deployment (Cloud Run)

1. Build your Docker image:
   ```bash
   docker build -t gcr.io/[PROJECT_ID]/analystai-frontend .
   ```

2. Push to Google Container Registry:
   ```bash
   docker push gcr.io/[PROJECT_ID]/analystai-frontend
   ```

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy analystai-frontend --image gcr.io/[PROJECT_ID]/analystai-frontend --platform managed
   ```

4. Set environment variables in Cloud Run:
   - In the GCP Console, go to Cloud Run > Your service
   - Click "Edit & Deploy New Revision"
   - Add all environment variables from your `.env` file

### PDF Extractor Backend Deployment (Cloud Run)

1. Build the Docker image:
   ```bash
   docker build -t gcr.io/[PROJECT_ID]/analystai-pdf-extractor .
   ```

2. Push to Google Container Registry:
   ```bash
   docker push gcr.io/[PROJECT_ID]/analystai-pdf-extractor
   ```

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy analystai-pdf-extractor --image gcr.io/[PROJECT_ID]/analystai-pdf-extractor --platform managed
   ```

4. Set backend environment variables:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GOOGLE_APPLICATION_CREDENTIALS`: Set to `/app/credentials.json` (and mount the credentials file)
   - `STORAGE_BUCKET_NAME`: Your GCS bucket name
   - `API_KEY`: A secret key for API authentication

5. Update the frontend's `.env` file with the new backend URL:
   ```
   REACT_APP_API_BASE_URL=https://analystai-pdf-extractor-xxxxxx.run.app
   ```

## Security Best Practices

1. **Environment Variables**: Never commit the `.env` file to your repository. Add it to `.gitignore`.

2. **API Keys**: Set appropriate restrictions on your API keys in the Google Cloud Console:
   - Restrict by IP address or application
   - Set usage quotas to prevent abuse

3. **Firebase Security Rules**: Configure proper security rules for Firestore and Storage:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, update, delete: if request.auth != null && request.auth.uid == userId;
         allow create: if request.auth != null;
       }
       match /reports/{reportId} {
         allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

4. **OAuth Scopes**: Request only the minimum scopes needed for your application:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/drive.readonly` (for Google Drive integration)

5. **Cloud Run Services**:
   - Enable HTTPS-only traffic
   - Set appropriate service account permissions
   - Configure authentication if needed

## PDF Processing Implementation Details

The PDF processor backend implements several key features:

1. **Text Extraction**: Uses PyMuPDF and pdfplumber to extract text content.
2. **Table Detection**: Uses a combination of PyMuPDF and custom algorithms to identify and extract tabular data.
3. **Chart Detection**: Uses OpenCV and image processing to detect and extract charts.
4. **Vectorization**: Chunks text and generates embeddings using transformers.
5. **AI Insight Generation**: Processes PDF content with Gemini AI to generate insights.

The backend API endpoints:
- `POST /api/extract-pdf`: Starts PDF processing
- `GET /api/extraction-status/{task_id}`: Gets the status of an extraction task
- `GET /api/download/{task_id}?format={format}`: Downloads extracted data in various formats

## Troubleshooting

- **Authentication Issues**: Ensure redirect URIs are correctly configured in the Google Cloud Console.
- **API Quotas**: Check usage quotas in the Google Cloud Console if API calls fail.
- **Firebase Permissions**: Verify security rules if Firestore operations fail.
- **Backend Connectivity**: Confirm that the frontend can reach the backend API.
- **PDF Processing Errors**: Check backend logs in Cloud Run for details on processing failures.

For more assistance, refer to the documentation for each service or contact support.

