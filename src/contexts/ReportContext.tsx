
import { createContext, useContext, ReactNode, useEffect } from "react";
import { ReportContextType } from "./types";
import { useAuth } from "./useAuth";
import { useReportManagement } from "./useReportManagement";
import { useExtractedData } from "./useExtractedData";

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, isSignedIn } = useAuth();
  const { 
    reports, 
    addReport, 
    removeReport, 
    getReport, 
    setReportProcessed, 
    setReportProcessing 
  } = useReportManagement();
  const { 
    extractedData, 
    addExtractedData, 
    getExtractedData 
  } = useExtractedData();
  
  // Handle user sign-out data cleanup
  useEffect(() => {
    if (!user && reports.length > 0) {
      // Set a timeout to clear anonymous user data after some time
      const timeoutId = setTimeout(() => {
        if (!localStorage.getItem("analystai-user")) {
          localStorage.removeItem("analystai-reports");
          localStorage.removeItem("analystai-extracted-data");
        }
      }, 30 * 60 * 1000); // 30 minutes
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, reports.length]);

  // Clean up extracted data when removing a report
  const handleRemoveReport = (id: string) => {
    removeReport(id);
    const newData = { ...extractedData };
    delete newData[id];
    addExtractedData({ ...newData } as any);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        removeReport: handleRemoveReport,
        getReport,
        extractedData,
        setReportProcessed,
        setReportProcessing,
        addExtractedData,
        getExtractedData,
        user,
        setUser,
        isSignedIn,
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

// Re-export types for easier imports
export * from "./types";
