
# AnalystAI Setup Guide

This guide will walk you through setting up AnalystAI with Supabase integration to handle authentication, data storage, and API calls.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- A Supabase account (free tier is sufficient)
- Google API credentials (for Google Sign-In)
- An AI service for text extraction and analysis (OpenAI, Claude, etc.)

## Step 1: Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. After the project is created, go to Project Settings and note down your:
   - Project URL
   - API Key (anon public key)

3. Create the necessary tables in your Supabase database:

```sql
-- Create a table for user profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (id)
);

-- Create a table for reports
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  last_modified BIGINT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  processed BOOLEAN DEFAULT FALSE,
  processing BOOLEAN DEFAULT FALSE
);

-- Create a table for extracted data
CREATE TABLE extracted_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES reports ON DELETE CASCADE,
  text JSONB DEFAULT '[]',
  tables JSONB DEFAULT '[]',
  charts JSONB DEFAULT '[]',
  insights JSONB DEFAULT '[]',
  summary TEXT,
  industry TEXT,
  vectorized BOOLEAN DEFAULT FALSE,
  chunks INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_data ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to access only their own data
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own reports" 
  ON reports FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" 
  ON reports FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
  ON reports FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports" 
  ON reports FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view extracted data for their reports" 
  ON extracted_data FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM reports WHERE id = report_id));

CREATE POLICY "Users can insert extracted data for their reports" 
  ON extracted_data FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM reports WHERE id = report_id));

CREATE POLICY "Users can update extracted data for their reports" 
  ON extracted_data FOR UPDATE 
  USING (auth.uid() = (SELECT user_id FROM reports WHERE id = report_id));

-- Create triggers to automatically update the updated_at field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_extracted_data_updated_at
BEFORE UPDATE ON extracted_data
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
```

4. Set up authentication providers:
   - Go to Authentication > Providers
   - Enable Google Authentication
   - Enter your Google OAuth credentials (Client ID and Secret)
   - Configure redirect URLs

## Step 2: Configure AI APIs

1. Create an account with your preferred AI service (OpenAI, Claude, etc.)
2. Obtain an API key for the service
3. For PDF extraction and analysis:
   - Set up an OpenAI API key for text extraction
   - Alternatively, use a specialized PDF extraction service (like PDFTron, Adobe PDF Services, etc.)

## Step 3: Integrate Supabase with AnalystAI

1. Install Supabase client library:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create a Supabase client configuration file:
   ```typescript
   // src/services/supabase.ts
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_PUBLIC_API_KEY';

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

3. Update the ReportContext to use Supabase:
   ```typescript
   // Example code - adjust as needed
   import { supabase } from '../services/supabase';

   const fetchReports = async () => {
     const { data, error } = await supabase
       .from('reports')
       .select('*')
       .order('uploaded_at', { ascending: false });
     
     if (error) {
       console.error('Error fetching reports:', error);
       return [];
     }
     
     return data || [];
   };
   ```

4. Implement Google Sign-In with Supabase:
   ```typescript
   // Example code - adjust as needed
   const handleSignIn = async () => {
     const { data, error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
     });
     
     if (error) {
       console.error('Error signing in:', error);
       return;
     }
     
     // User is now signed in
   };
   ```

## Step 4: Implement PDF Processing with AI

1. Create a service for PDF extraction:
   ```typescript
   // src/services/pdfExtractor.ts
   import { supabase } from './supabase';

   export const extractPdf = async (file: File, reportId: string) => {
     // 1. Upload the file to Supabase Storage
     const { data: fileData, error: fileError } = await supabase
       .storage
       .from('reports')
       .upload(`${reportId}/${file.name}`, file);
     
     if (fileError) {
       console.error('Error uploading file:', fileError);
       throw fileError;
     }
     
     // 2. Create a serverless function to process the PDF
     const { data, error } = await supabase
       .functions
       .invoke('process-pdf', {
         body: { 
           reportId,
           filePath: fileData.path,
           options: {
             extractText: true,
             detectCharts: true,
             detectTables: true,
             generateInsights: true,
             vectorize: true
           }
         }
       });
     
     if (error) {
       console.error('Error processing PDF:', error);
       throw error;
     }
     
     return data;
   };
   ```

2. Create a Supabase Edge Function to process the PDF:
   - Go to Supabase > Edge Functions
   - Create a new function called `process-pdf`
   - Implement PDF processing using your chosen AI service
   - Store the extracted data in the database

Example Edge Function:

```typescript
// supabase/functions/process-pdf/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reportId, filePath, options } = await req.json();
    
    // Create a Supabase client with the admin key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get the file from storage
    const { data: fileData, error: fileError } = await supabaseClient
      .storage
      .from('reports')
      .download(filePath);
    
    if (fileError) {
      throw fileError;
    }
    
    // Convert the file to base64 for processing with AI API
    const fileBuffer = await fileData.arrayBuffer();
    const fileBase64 = btoa(
      String.fromCharCode(...new Uint8Array(fileBuffer))
    );
    
    // Call OpenAI or other AI service to process the PDF
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that extracts information from PDF documents.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract the text, tables, charts, and insights from this PDF document.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${fileBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 4000
      })
    });
    
    const aiData = await aiResponse.json();
    
    // Process the AI response and extract the data
    const extractedData = {
      text: [],
      tables: [],
      charts: [],
      insights: []
      // Process the AI response to populate these arrays
    };
    
    // Update the report status
    await supabaseClient
      .from('reports')
      .update({ processed: true, processing: false })
      .eq('id', reportId);
    
    // Save the extracted data
    await supabaseClient
      .from('extracted_data')
      .insert({
        report_id: reportId,
        text: extractedData.text,
        tables: extractedData.tables,
        charts: extractedData.charts,
        insights: extractedData.insights
      });
    
    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## Step 5: Deployment

1. Deploy your frontend application:
   - Vercel, Netlify, or other hosting service
   - Configure environment variables for Supabase URL and API key

2. Test the entire flow:
   - User authentication
   - Uploading reports
   - Processing reports with AI
   - Viewing extracted data
   - Chatting with the AI about report contents

## Maintenance and Monitoring

1. Set up logging and monitoring:
   - Supabase provides database logs
   - Implement client-side error tracking (e.g., Sentry)

2. Consider implementing:
   - User feedback mechanism
   - Usage analytics
   - Rate limiting for API calls
   - Regular backups of important data

## Security Considerations

1. Never expose your Supabase service role key or AI API keys in client-side code
2. Implement proper Row Level Security in Supabase
3. Validate user input on both client and server
4. Implement rate limiting to prevent abuse
5. Regularly update dependencies to patch security vulnerabilities

## Further Improvements

1. Implement file versioning
2. Add collaboration features
3. Improve AI analysis with custom models or fine-tuning
4. Add export functionality for extracted data
5. Implement bulk processing of multiple reports
