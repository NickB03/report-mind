
import { toast } from "sonner";
import { apiConfig } from "@/utils/apiConfig";

interface PdfExtractionOptions {
  extractText: boolean;
  detectCharts: boolean;
  detectTables: boolean;
  generateInsights: boolean;
  vectorize: boolean;
}

interface ExtractionResponse {
  id: string;
  reportId: string;
  status: 'completed' | 'processing' | 'failed';
  text: string[];
  tables: any[];
  charts: any[];
  insights: any[];
  summary?: string;
  industry?: string;
  vectorized?: boolean;
  chunks?: number;
  error?: string;
}

const extractPdf = async (
  fileId: string,
  options: PdfExtractionOptions
): Promise<ExtractionResponse> => {
  try {
    const formData = new FormData();
    formData.append('fileId', fileId);
    formData.append('options', JSON.stringify(options));

    const response = await fetch(`${apiConfig.baseUrl}/api/extract-pdf`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to extract PDF');
    }

    return await response.json();
  } catch (error) {
    console.error('PDF extraction error:', error);
    toast.error('Failed to extract PDF content');
    throw error;
  }
};

const getExtractionStatus = async (extractionId: string): Promise<ExtractionResponse> => {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/api/extraction-status/${extractionId}`, {
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get extraction status');
    }

    return await response.json();
  } catch (error) {
    console.error('Get extraction status error:', error);
    throw error;
  }
};

const downloadExtractedData = async (extractionId: string, format: string): Promise<Blob> => {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/api/download/${extractionId}?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download extracted data');
    }

    return await response.blob();
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Failed to download extracted data');
    throw error;
  }
};

export const pdfExtractor = {
  extractPdf,
  getExtractionStatus,
  downloadExtractedData
};
