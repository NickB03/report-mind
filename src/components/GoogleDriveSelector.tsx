
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, HardDrive, Folder, File as FileIcon, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useReports } from "@/contexts/ReportContext";
import { toast } from "sonner";

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  iconLink?: string;
}

interface GoogleDriveSelectorProps {
  onFilesSelected: (files: File[]) => void;
}

const GoogleDriveSelector = ({ onFilesSelected }: GoogleDriveSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const { isSignedIn } = useReports();

  const handleConnectToDrive = () => {
    if (!isSignedIn) {
      toast.error("Please sign in first");
      return;
    }

    setIsLoading(true);
    
    // This is a placeholder for the actual Google Drive API integration
    // In a real implementation, you would use the Google Drive API
    setTimeout(() => {
      setIsConnected(true);
      setFiles([
        { id: "1", name: "Q1 Report.pdf", mimeType: "application/pdf", size: "2.4 MB" },
        { id: "2", name: "Market Analysis.pdf", mimeType: "application/pdf", size: "1.8 MB" },
        { id: "3", name: "Competitor Research", mimeType: "application/vnd.google-apps.folder" },
        { id: "4", name: "Industry Trends.pdf", mimeType: "application/pdf", size: "3.2 MB" },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleToggleFileSelection = (id: string) => {
    setSelectedFileIds(prevIds =>
      prevIds.includes(id)
        ? prevIds.filter(fileId => fileId !== id)
        : [...prevIds, id]
    );
  };

  const handleImportFiles = () => {
    if (selectedFileIds.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsLoading(true);
    
    // This is a placeholder for the actual file download from Google Drive
    // In a real implementation, you would use the Google Drive API to download the files
    setTimeout(() => {
      // Simulate downloading files from Google Drive
      const selectedFiles = files
        .filter(file => selectedFileIds.includes(file.id) && file.mimeType === "application/pdf")
        .map(file => {
          // Create a File object from the Google Drive file metadata
          return new File(
            [new ArrayBuffer(0)], // Empty content for simulation
            file.name,
            { type: "application/pdf" }
          );
        });
      
      onFilesSelected(selectedFiles);
      setIsLoading(false);
      setSelectedFileIds([]);
      toast.success(`Imported ${selectedFiles.length} file(s) from Google Drive`);
    }, 2000);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-28 mt-2" />
            </div>
          ) : (
            <Button onClick={handleConnectToDrive} className="gap-2">
              <HardDrive className="h-4 w-4" />
              Connect to Google Drive
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Google Drive Files
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsConnected(false)}
          >
            <X className="h-4 w-4 mr-1" /> Disconnect
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto border rounded-md divide-y">
              {files.map(file => (
                <div
                  key={file.id}
                  className={`flex items-center p-2 hover:bg-muted/50 cursor-pointer ${
                    selectedFileIds.includes(file.id) ? "bg-muted" : ""
                  }`}
                  onClick={() => file.mimeType === "application/pdf" && handleToggleFileSelection(file.id)}
                >
                  {file.mimeType === "application/vnd.google-apps.folder" ? (
                    <Folder className="h-5 w-5 text-report-500 mr-2" />
                  ) : (
                    <FileIcon className="h-5 w-5 text-report-500 mr-2" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {file.size && (
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    )}
                  </div>
                  {file.mimeType === "application/pdf" && (
                    <div className="w-5 h-5 flex items-center justify-center">
                      {selectedFileIds.includes(file.id) ? (
                        <Check className="h-4 w-4 text-report-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleImportFiles}
                disabled={selectedFileIds.length === 0}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Import Selected Files ({selectedFileIds.length})
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleDriveSelector;
