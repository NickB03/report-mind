
import { useState, useEffect } from "react";
import { ReportFile } from "./types";
import { LOCAL_STORAGE_REPORTS_KEY } from "./constants";

export const useReportManagement = () => {
  const [reports, setReports] = useState<ReportFile[]>([]);
  
  // Load reports from localStorage on initial load
  useEffect(() => {
    const storedReports = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (storedReports) {
      const parsedReports = JSON.parse(storedReports);
      setReports(parsedReports.map((report: any) => ({
        ...report,
        uploadedAt: new Date(report.uploadedAt)
      })));
    }
  }, []);
  
  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
    }
  }, [reports]);
  
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
  
  return {
    reports,
    addReport,
    removeReport,
    getReport,
    setReportProcessed,
    setReportProcessing
  };
};
