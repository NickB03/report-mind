
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
}

// Add user interface for authentication
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface ReportContextType {
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

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const LOCAL_STORAGE_REPORTS_KEY = "analystai-reports";
const LOCAL_STORAGE_EXTRACTED_DATA_KEY = "analystai-extracted-data";
const LOCAL_STORAGE_USER_KEY = "analystai-user";

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [extractedData, setExtractedData] = useState<Record<string, ExtractedData>>({});
  const [user, setUser] = useState<User | null>(null);
  
  // Load data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Only load reports if user is signed in
    // or if there are reports in localStorage (for anonymous users)
    const storedReports = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (storedReports) {
      const parsedReports = JSON.parse(storedReports);
      setReports(parsedReports.map((report: any) => ({
        ...report,
        uploadedAt: new Date(report.uploadedAt)
      })));
    }
    
    const storedExtractedData = localStorage.getItem(LOCAL_STORAGE_EXTRACTED_DATA_KEY);
    if (storedExtractedData) {
      setExtractedData(JSON.parse(storedExtractedData));
    }
  }, []);
  
  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
    }
  }, [reports]);
  
  // Save extracted data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(extractedData).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_EXTRACTED_DATA_KEY, JSON.stringify(extractedData));
    }
  }, [extractedData]);
  
  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      // If user signs out, clear their reports data
      // We don't immediately clear localStorage for anonymous users
      // in case they're just signing in
      if (reports.length > 0 && !localStorage.getItem(LOCAL_STORAGE_USER_KEY)) {
        // Set a timeout to clear anonymous user data after some time
        const timeoutId = setTimeout(() => {
          if (!localStorage.getItem(LOCAL_STORAGE_USER_KEY)) {
            localStorage.removeItem(LOCAL_STORAGE_REPORTS_KEY);
            localStorage.removeItem(LOCAL_STORAGE_EXTRACTED_DATA_KEY);
            setReports([]);
            setExtractedData({});
          }
        }, 30 * 60 * 1000); // 30 minutes
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [user, reports.length]);

  const addReport = (file: File): string => {
    const newReport: ReportFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      uploadedAt: new Date(),
      processed: false,
      processing: false,
    };
    setReports((prevReports) => [...prevReports, newReport]);
    return newReport.id;
  };

  const removeReport = (id: string) => {
    setReports((prevReports) => prevReports.filter((report) => report.id !== id));
    setExtractedData((prevData) => {
      const newData = { ...prevData };
      delete newData[id];
      return newData;
    });
  };

  const getReport = (id: string) => {
    return reports.find((report) => report.id === id);
  };

  const setReportProcessed = (id: string, processed: boolean) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, processed } : report
      )
    );
  };

  const setReportProcessing = (id: string, processing: boolean) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, processing } : report
      )
    );
  };

  const addExtractedData = (data: ExtractedData) => {
    setExtractedData((prevData) => ({
      ...prevData,
      [data.reportId]: data,
    }));
    setReportProcessed(data.reportId, true);
    setReportProcessing(data.reportId, false);
  };

  const getExtractedData = (reportId: string) => {
    return extractedData[reportId];
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        removeReport,
        getReport,
        extractedData,
        setReportProcessed,
        setReportProcessing,
        addExtractedData,
        getExtractedData,
        user,
        setUser,
        isSignedIn: !!user,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};
