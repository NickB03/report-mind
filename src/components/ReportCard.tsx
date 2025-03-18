
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Loader2, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useReports, ReportFile } from "@/contexts/ReportContext";

interface ReportCardProps {
  report: ReportFile;
}

const ReportCard = ({ report }: ReportCardProps) => {
  const navigate = useNavigate();
  const { getExtractedData } = useReports();
  const extractedData = getExtractedData(report.id);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const viewReport = () => {
    navigate(`/results/${report.id}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="bg-report-50 p-2 rounded-md">
            <File className="h-8 w-8 text-report-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium truncate">{report.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{formatFileSize(report.size)}</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
              <span>
                Uploaded {formatDistanceToNow(report.uploadedAt, { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            {report.processing ? (
              <div className="flex items-center text-report-600">
                <Loader2 className="h-5 w-5 mr-1 animate-spin" />
                <span className="text-sm">Processing</span>
              </div>
            ) : report.processed ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">Processed</span>
              </div>
            ) : null}
          </div>
        </div>

        {report.processed && extractedData && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-muted rounded-md p-2">
              <p className="text-lg font-medium">{extractedData.text.length}</p>
              <p className="text-muted-foreground">Pages</p>
            </div>
            <div className="bg-muted rounded-md p-2">
              <p className="text-lg font-medium">{extractedData.tables.length}</p>
              <p className="text-muted-foreground">Tables</p>
            </div>
            <div className="bg-muted rounded-md p-2">
              <p className="text-lg font-medium">{extractedData.charts.length}</p>
              <p className="text-muted-foreground">Charts</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3">
        <Button
          variant="ghost"
          className="ml-auto"
          onClick={viewReport}
          disabled={!report.processed}
        >
          View Results
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
