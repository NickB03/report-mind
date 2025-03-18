
# AnalystAI Deployment Guide for Google Cloud Platform

This guide provides detailed instructions for deploying the AnalystAI application to Google Cloud Platform (GCP). The deployment consists of two main components:

1. Frontend React application
2. PDF Extractor backend service (Python)

## Prerequisites

- Google Cloud Platform account with billing enabled
- gcloud CLI installed and configured (https://cloud.google.com/sdk/docs/install)
- Docker installed locally for building containers
- Git for cloning the repository

## Step 1: Set Up GCP Project

1. Create a new GCP project (or use an existing one):
   ```bash
   gcloud projects create analystai-project --name="AnalystAI"
   gcloud config set project analystai-project
   ```

2. Enable required APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable storage.googleapis.com
   gcloud services enable aiplatform.googleapis.com
   gcloud services enable firestore.googleapis.com
   ```

## Step 2: Set Up Firebase (for Authentication and Storage)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Add a new project and select your GCP project
3. Set up Authentication with Google Sign-In
4. Create a Firestore database in Native mode
5. Set up Firebase Storage
6. Get your Firebase configuration (for the frontend .env file)

## Step 3: Deploy the PDF Extractor Backend

1. Build the Docker image for the PDF Extractor:
   ```bash
   # Navigate to the project root
   cd analystai-project

   # Build the Docker image
   docker build -t gcr.io/analystai-project/pdf-extractor -f Dockerfile .
   ```

2. Push the image to Google Container Registry:
   ```bash
   # Authenticate Docker to GCR
   gcloud auth configure-docker

   # Push the image
   docker push gcr.io/analystai-project/pdf-extractor
   ```

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy pdf-extractor \
     --image gcr.io/analystai-project/pdf-extractor \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 2Gi \
     --cpu 2 \
     --timeout 300 \
     --set-env-vars="GCP_PROJECT_ID=analystai-project,STORAGE_BUCKET_NAME=analystai-project.appspot.com"
   ```

4. Note the service URL from the output (e.g., `https://pdf-extractor-abcdef-uc.a.run.app`)

## Step 4: Configure and Deploy the Frontend

1. Create a `.env` file for the frontend with the following variables:
   ```
   REACT_APP_API_BASE_URL=https://pdf-extractor-abcdef-uc.a.run.app
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_GOOGLE_API_KEY=your-google-api-key
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
   REACT_APP_GCS_BUCKET_NAME=your-gcs-bucket-name
   REACT_APP_GEMINI_API_KEY=your-gemini-api-key
   ```

2. Create a Dockerfile for the frontend:
   ```
   # Create a Dockerfile.frontend
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. Create an nginx.conf file:
   ```
   # Create nginx.conf
   server {
     listen 80;
     root /usr/share/nginx/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. Build and push the frontend image:
   ```bash
   # Build the frontend Docker image
   docker build -t gcr.io/analystai-project/frontend -f Dockerfile.frontend .

   # Push the image
   docker push gcr.io/analystai-project/frontend
   ```

5. Deploy the frontend to Cloud Run:
   ```bash
   gcloud run deploy frontend \
     --image gcr.io/analystai-project/frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

6. Note the frontend service URL from the output (e.g., `https://frontend-abcdef-uc.a.run.app`)

## Step 5: Set Up Cloud Storage for PDF Files

1. Create a GCS bucket for PDF files:
   ```bash
   gsutil mb -l us-central1 gs://analystai-pdfs
   ```

2. Configure CORS for the bucket:
   ```bash
   # Create a cors.json file
   cat > cors.json << EOL
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT"],
       "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
       "maxAgeSeconds": 3600
     }
   ]
   EOL

   # Apply CORS configuration
   gsutil cors set cors.json gs://analystai-pdfs
   ```

3. Set up public access for the bucket:
   ```bash
   gsutil iam ch allUsers:objectViewer gs://analystai-pdfs
   ```

## Step 6: Configure Custom Domain (Optional)

1. Purchase a domain name if you don't already have one

2. Add the domain to Cloud Run:
   ```bash
   gcloud beta run domain-mappings create \
     --service frontend \
     --domain www.your-domain.com \
     --region us-central1
   ```

3. Update your DNS records as instructed by the command output

## Step 7: Set Up Continuous Deployment (Optional)

1. Connect your GitHub repository to Cloud Build:
   ```bash
   gcloud builds triggers create github \
     --repo=your-github-repo \
     --branch-pattern="main" \
     --build-config="cloudbuild.yaml"
   ```

2. Create a `cloudbuild.yaml` file in your repository:
   ```yaml
   steps:
   # Build and push the PDF extractor
   - name: 'gcr.io/cloud-builders/docker'
     args: ['build', '-t', 'gcr.io/$PROJECT_ID/pdf-extractor', '-f', 'Dockerfile', '.']
   - name: 'gcr.io/cloud-builders/docker'
     args: ['push', 'gcr.io/$PROJECT_ID/pdf-extractor']
   
   # Build and push the frontend
   - name: 'gcr.io/cloud-builders/docker'
     args: ['build', '-t', 'gcr.io/$PROJECT_ID/frontend', '-f', 'Dockerfile.frontend', '.']
   - name: 'gcr.io/cloud-builders/docker'
     args: ['push', 'gcr.io/$PROJECT_ID/frontend']
   
   # Deploy PDF extractor to Cloud Run
   - name: 'gcr.io/cloud-builders/gcloud'
     args:
     - 'run'
     - 'deploy'
     - 'pdf-extractor'
     - '--image'
     - 'gcr.io/$PROJECT_ID/pdf-extractor'
     - '--region'
     - 'us-central1'
     - '--platform'
     - 'managed'
     - '--allow-unauthenticated'
   
   # Deploy frontend to Cloud Run
   - name: 'gcr.io/cloud-builders/gcloud'
     args:
     - 'run'
     - 'deploy'
     - 'frontend'
     - '--image'
     - 'gcr.io/$PROJECT_ID/frontend'
     - '--region'
     - 'us-central1'
     - '--platform'
     - 'managed'
     - '--allow-unauthenticated'
   
   images:
   - 'gcr.io/$PROJECT_ID/pdf-extractor'
   - 'gcr.io/$PROJECT_ID/frontend'
   ```

## Step 8: Set Up IAM Permissions

1. Create a service account for the PDF extractor:
   ```bash
   gcloud iam service-accounts create pdf-extractor-sa \
     --display-name="PDF Extractor Service Account"
   ```

2. Grant necessary permissions:
   ```bash
   # Grant Storage Object Admin for accessing PDFs
   gcloud projects add-iam-policy-binding analystai-project \
     --member="serviceAccount:pdf-extractor-sa@analystai-project.iam.gserviceaccount.com" \
     --role="roles/storage.objectAdmin"

   # Grant Firestore access
   gcloud projects add-iam-policy-binding analystai-project \
     --member="serviceAccount:pdf-extractor-sa@analystai-project.iam.gserviceaccount.com" \
     --role="roles/datastore.user"

   # Grant AI Platform access for Gemini API
   gcloud projects add-iam-policy-binding analystai-project \
     --member="serviceAccount:pdf-extractor-sa@analystai-project.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. Update the PDF extractor Cloud Run service to use this service account:
   ```bash
   gcloud run services update pdf-extractor \
     --service-account=pdf-extractor-sa@analystai-project.iam.gserviceaccount.com \
     --region=us-central1
   ```

## Step 9: Scaling Configuration (Production Settings)

1. Configure autoscaling for the PDF extractor:
   ```bash
   gcloud run services update pdf-extractor \
     --min-instances=1 \
     --max-instances=10 \
     --region=us-central1
   ```

2. Configure autoscaling for the frontend:
   ```bash
   gcloud run services update frontend \
     --min-instances=1 \
     --max-instances=10 \
     --region=us-central1
   ```

## Step 10: Monitoring and Logging

1. Set up Cloud Monitoring dashboard:
   ```bash
   # Follow the web console instructions to create a custom dashboard
   # for monitoring both services
   ```

2. Configure alerts for high CPU/memory usage and errors:
   ```bash
   # Follow the web console instructions to set up alerting policies
   ```

## Verification Steps

1. Open the frontend URL in a browser
2. Verify you can sign in with Google
3. Upload a test PDF file
4. Confirm the PDF extraction process works
5. Verify all extracted data is correctly displayed
6. Test the AI Chat functionality
7. Verify the download options

## Troubleshooting

### Backend Service Issues
- Check Cloud Run logs: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=pdf-extractor"`
- Ensure the service has sufficient memory and CPU
- Verify environment variables are set correctly

### Frontend Issues
- Check browser console for JavaScript errors
- Ensure API URLs are correct in the .env file
- Verify CORS settings if seeing API request issues

### Storage Issues
- Check bucket permissions: `gsutil iam get gs://analystai-pdfs`
- Verify CORS settings: `gsutil cors get gs://analystai-pdfs`

## Maintenance and Updates

1. Deploy new versions of the backend:
   ```bash
   # Build and push new Docker image
   docker build -t gcr.io/analystai-project/pdf-extractor:v2 -f Dockerfile .
   docker push gcr.io/analystai-project/pdf-extractor:v2

   # Update the Cloud Run service
   gcloud run services update pdf-extractor \
     --image gcr.io/analystai-project/pdf-extractor:v2 \
     --region us-central1
   ```

2. Deploy new versions of the frontend:
   ```bash
   # Build and push new Docker image
   docker build -t gcr.io/analystai-project/frontend:v2 -f Dockerfile.frontend .
   docker push gcr.io/analystai-project/frontend:v2

   # Update the Cloud Run service
   gcloud run services update frontend \
     --image gcr.io/analystai-project/frontend:v2 \
     --region us-central1
   ```

## Security Best Practices

1. Regularly rotate API keys and service account credentials
2. Enable VPC Service Controls for additional network security
3. Set up Cloud Armor for web application firewall protection
4. Implement Cloud Security Command Center for security monitoring
5. Enable Cloud Audit Logs for API audit trail

## Cost Optimization

1. Set up budget alerts for the GCP project
2. Configure Cloud Run minimum instances to 0 for non-production environments
3. Use Compute Engine committed use discounts for predictable workloads
4. Set up Object Lifecycle Management for GCS buckets

---

For further assistance, refer to the Google Cloud documentation or contact your cloud administrator.
