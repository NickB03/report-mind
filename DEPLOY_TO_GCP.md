
# Deploying AnalystAI to Google Cloud Platform

This guide provides step-by-step instructions for deploying the AnalystAI application to Google Cloud Platform (GCP).

## Prerequisites

Before you begin, ensure you have:

1. A Google Cloud Platform account
2. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured
3. [Docker](https://docs.docker.com/get-docker/) installed
4. Git installed to clone the repository

## Step 1: Set Up GCP Project

1. Create or select a GCP project:
   ```bash
   gcloud projects create [PROJECT_ID] --name="AnalystAI"
   # Or select an existing project
   gcloud config set project [PROJECT_ID]
   ```

2. Enable the required APIs:
   ```bash
   gcloud services enable cloudapis.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable storage.googleapis.com
   gcloud services enable aiplatform.googleapis.com
   gcloud services enable firestore.googleapis.com
   ```

## Step 2: Set Up Firebase

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Add a new project and select your GCP project
3. Set up Firebase Authentication with Google Sign-in
4. Create a Firestore database in Native mode
5. Set up Firebase Storage

## Step 3: Configure Environment Variables

1. Create a `.env` file based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```

2. Fill in all the required values:
   - Set `REACT_APP_API_BASE_URL` to your backend service URL (will be created later)
   - Add your Google Client ID for authentication
   - Add your Google API key for Drive integration
   - Add your Firebase configuration (from Firebase console)
   - Add your GCS bucket name
   - Add your Gemini API key (from Google AI Studio)

## Step 4: Deploy the Backend

1. Build the backend Docker image:
   ```bash
   docker build -t gcr.io/[PROJECT_ID]/pdf-extractor -f Dockerfile .
   ```

2. Push the image to Google Container Registry:
   ```bash
   docker push gcr.io/[PROJECT_ID]/pdf-extractor
   ```

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy pdf-extractor \
     --image gcr.io/[PROJECT_ID]/pdf-extractor \
     --platform managed \
     --region us-central1 \
     --memory 2Gi \
     --cpu 2 \
     --timeout 300s \
     --allow-unauthenticated \
     --set-env-vars "GCP_PROJECT_ID=[PROJECT_ID],STORAGE_BUCKET_NAME=[YOUR_BUCKET_NAME]"
   ```

4. Note the service URL for the frontend configuration

## Step 5: Deploy the Frontend

1. Update the `.env` file with the backend URL:
   ```
   REACT_APP_API_BASE_URL=https://pdf-extractor-xxxxxx.run.app
   ```

2. Build the frontend Docker image:
   ```bash
   docker build -t gcr.io/[PROJECT_ID]/frontend -f Dockerfile.frontend .
   ```

3. Push the image to Google Container Registry:
   ```bash
   docker push gcr.io/[PROJECT_ID]/frontend
   ```

4. Deploy to Cloud Run:
   ```bash
   gcloud run deploy frontend \
     --image gcr.io/[PROJECT_ID]/frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

5. Note the service URL to access your application

## Step 6: Set Up Continuous Deployment (Optional)

1. Create a Cloud Build trigger connected to your GitHub repository:
   ```bash
   gcloud builds triggers create github \
     --repo=[GITHUB_REPO] \
     --branch-pattern="main" \
     --build-config=cloudbuild.yaml
   ```

2. The provided `cloudbuild.yaml` will automatically:
   - Build both the frontend and backend images
   - Push them to Container Registry
   - Deploy them to Cloud Run

## Step 7: Set Up Domain and SSL (Optional)

1. Purchase a domain and configure it in Cloud Run:
   ```bash
   gcloud run domain-mappings create --service frontend \
     --domain your-domain.com --region us-central1
   ```

2. Follow the instructions to verify domain ownership and configure DNS

## Troubleshooting

### Backend Service Issues
- Check Cloud Run logs: `gcloud run services logs read pdf-extractor`
- Verify environment variables are set correctly
- Test API endpoints directly with curl or Postman

### Frontend Service Issues
- Check Cloud Run logs: `gcloud run services logs read frontend`
- Verify the backend URL is correct in your environment variables
- Test in an incognito browser window to avoid caching issues

### Authentication Issues
- Verify OAuth credentials are configured with the correct redirect URIs
- Check Firebase Authentication settings in console
- Review browser console for authentication errors

## Security Considerations

1. Consider using Cloud Run with internal traffic only and put it behind a Cloud Load Balancer
2. Implement OAuth2 authentication for the backend API
3. Set up proper IAM roles and permissions for service accounts
4. Configure Firestore and Storage security rules properly

## Cost Optimization

1. Set up budget alerts in GCP
2. Configure Cloud Run to scale to zero when not in use
3. Monitor resource usage and adjust allocations as needed
4. Consider using preemptible VMs for batch processing

## Maintenance

1. Regularly update dependencies
2. Set up monitoring and alerting with Cloud Monitoring
3. Configure log-based metrics for error tracking
4. Schedule regular database backups

For more detailed information, refer to the official documentation:
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud Build Documentation](https://cloud.google.com/build/docs)
