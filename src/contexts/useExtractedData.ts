
import { useState, useEffect } from "react";
import { ExtractedData } from "./types";
import { LOCAL_STORAGE_EXTRACTED_DATA_KEY } from "./constants";

export const useExtractedData = () => {
  const [extractedData, setExtractedData] = useState<Record<string, ExtractedData>>({});
  
  // Load extracted data from localStorage on initial load
  useEffect(() => {
    const storedExtractedData = localStorage.getItem(LOCAL_STORAGE_EXTRACTED_DATA_KEY);
    if (storedExtractedData) {
      setExtractedData(JSON.parse(storedExtractedData));
    }
  }, []);
  
  // Save extracted data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(extractedData).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_EXTRACTED_DATA_KEY, JSON.stringify(extractedData));
    }
  }, [extractedData]);
  
  const addExtractedData = (data: ExtractedData) => {
    setExtractedData((prevData) => ({
      ...prevData,
      [data.reportId]: data,
    }));
  };

  const getExtractedData = (reportId: string) => {
    return extractedData[reportId];
  };
  
  return {
    extractedData,
    addExtractedData,
    getExtractedData
  };
};
