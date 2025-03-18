
// User interface for authentication
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Report file structure
export interface ReportFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  uploadedAt: Date;
  processed: boolean;
  processing: boolean;
}

// Data extracted from reports
export interface ExtractedData {
  id: string;
  reportId: string;
  text: string[];
  tables: Array<{
    id: string;
    title: string;
    data: string[][];
    page: number;
  }>;
  charts: Array<{
    id: string;
    title: string;
    type: string;
    imageUrl: string;
    page: number;
  }>;
  insights: Array<{
    id: string;
    text: string;
    confidence: number;
    category: string;
  }>;
  summary?: string;
  industry?: string;
  vectorized?: boolean;
  chunks?: number;
}

// Context type definition
export interface ReportContextType {
  reports: ReportFile[];
  addReport: (file: File) => string;
  removeReport: (id: string) => void;
  getReport: (id: string) => ReportFile | undefined;
  extractedData: Record<string, ExtractedData>;
  setReportProcessed: (id: string, processed: boolean) => void;
  setReportProcessing: (id: string, processing: boolean) => void;
  addExtractedData: (data: ExtractedData) => void;
  getExtractedData: (reportId: string) => ExtractedData | undefined;
  // Authentication related
  user: User | null;
  setUser: (user: User | null) => void;
  isSignedIn: boolean;
}
