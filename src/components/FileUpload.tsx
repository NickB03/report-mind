
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useReports } from "@/contexts/ReportContext";
import { toast } from "sonner";
import GoogleDriveSelector from "./GoogleDriveSelector";

interface FileUploadProps {
  onUploadComplete?: (reportId: string) => void;
}

const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const { addReport, isSignedIn } = useReports();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadTab, setUploadTab] = useState<string>("local");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFiles(acceptedFiles);
  }, []);

  const handleFiles = (newFiles: File[]) => {
    // Filter for PDF files only
    const pdfFiles = newFiles.filter(
      (file) => file.type === "application/pdf"
    );
    
    if (pdfFiles.length !== newFiles.length) {
      toast.error("Only PDF files are accepted");
    }
    
    setFiles((prev) => [...prev, ...pdfFiles]);
    
    // Initialize upload progress for each file
    pdfFiles.forEach((file) => {
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: 0,
      }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const currentProgress = prev[file.name] || 0;
          const newProgress = Math.min(currentProgress + 10, 100);
          
          if (newProgress === 100) {
            clearInterval(interval);
            // Call addReport and store the ID it returns
            const reportId = addReport(file);
            // Only call onUploadComplete if it exists
            if (onUploadComplete) {
              onUploadComplete(reportId);
            }
          }
          
          return {
            ...prev,
            [file.name]: newProgress,
          };
        });
      }, 300);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const handleDriveFilesSelected = (driveFiles: File[]) => {
    handleFiles(driveFiles);
    setUploadTab("local"); // Switch back to local tab to show uploaded files
  };

  return (
    <div className="space-y-4">
      <Tabs value={uploadTab} onValueChange={setUploadTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload from Device
          </TabsTrigger>
          <TabsTrigger value="drive" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Google Drive
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="local" className="mt-4">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-report-500 bg-report-50"
                : "border-border hover:border-report-300 hover:bg-report-50/30"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="h-10 w-10 text-report-500" />
              <h3 className="text-lg font-semibold">Drag and drop PDF files here</h3>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="drive" className="mt-4">
          <GoogleDriveSelector onFilesSelected={handleDriveFilesSelected} />
        </TabsContent>
      </Tabs>

      {files.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-2">Files ({files.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.name}
                className="border rounded-md p-3 flex items-center gap-2"
              >
                <File className="h-5 w-5 text-report-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={uploadProgress[file.name] || 0} className="h-2" />
                    <span className="text-xs text-muted-foreground">
                      {uploadProgress[file.name] || 0}%
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.name)}
                  disabled={uploadProgress[file.name] === 100}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
