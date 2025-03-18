
import { createContext, useContext, useState, ReactNode } from "react";

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

interface ReportContextType {
  reports: ReportFile[];
  addReport: (file: File) => void;
  removeReport: (id: string) => void;
  getReport: (id: string) => ReportFile | undefined;
  extractedData: Record<string, ExtractedData>;
  setReportProcessed: (id: string, processed: boolean) => void;
  setReportProcessing: (id: string, processing: boolean) => void;
  addExtractedData: (data: ExtractedData) => void;
  getExtractedData: (reportId: string) => ExtractedData | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [extractedData, setExtractedData] = useState<Record<string, ExtractedData>>({});

  const addReport = (file: File) => {
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
