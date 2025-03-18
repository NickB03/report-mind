
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import ProcessOptions, { ProcessOptions as ProcessOptionsType } from "@/components/ProcessOptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useReports } from "@/contexts/ReportContext";
import { Button } from "@/components/ui/button";
import { Download, MessageCircle } from "lucide-react";

const Extract = () => {
  const navigate = useNavigate();
  const { getReport, setReportProcessing, addExtractedData } = useReports();
  const [uploadedReportId, setUploadedReportId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleUploadComplete = (reportId: string) => {
    setUploadedReportId(reportId);
    toast.success("Upload complete!");
  };

  const processReport = (options: ProcessOptionsType) => {
    if (!uploadedReportId) {
      toast.error("Please upload a report first");
      return;
    }

    const report = getReport(uploadedReportId);
    if (!report) {
      toast.error("Report not found");
      return;
    }

    setProcessing(true);
    setReportProcessing(uploadedReportId, true);

    // Simulate processing delay
    setTimeout(() => {
      // Create mock extracted data
      const mockExtractedData = {
        id: Date.now().toString(),
        reportId: uploadedReportId,
        text: Array(10).fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl."),
        tables: Array(3).fill(null).map((_, i) => ({
          id: `table-${i}`,
          title: `Table ${i + 1}: Market Share Analysis`,
          data: [
            ["Vendor", "Market Share (%)", "Growth YoY (%)"],
            ["Vendor A", "32.5", "4.2"],
            ["Vendor B", "28.1", "3.7"],
            ["Vendor C", "18.9", "5.1"],
            ["Others", "20.5", "-1.3"],
          ],
          page: i + 2,
        })),
        charts: Array(4).fill(null).map((_, i) => ({
          id: `chart-${i}`,
          title: `Figure ${i + 1}: ${["Revenue Forecast", "Market Trends", "Customer Satisfaction", "Competitive Landscape"][i % 4]}`,
          type: ["bar", "line", "pie", "scatter"][i % 4],
          imageUrl: `/chart-${i}.png`,
          page: i + 3,
        })),
        insights: [
          {
            id: "insight-1",
            text: "The market is expected to grow at a CAGR of 14.5% over the next five years, with cloud adoption being the primary driver.",
            confidence: 0.92,
            category: "Market Trends",
          },
          {
            id: "insight-2",
            text: "Vendor A maintains leadership position due to strong product innovation and customer satisfaction scores.",
            confidence: 0.89,
            category: "Competitive Analysis",
          },
          {
            id: "insight-3",
            text: "Security and compliance remain top concerns for enterprise customers, particularly in highly regulated industries.",
            confidence: 0.85,
            category: "Customer Concerns",
          },
        ],
        summary: "This report provides an in-depth analysis of the market landscape, highlighting key trends, competitive positioning, and future growth opportunities across the industry.",
        industry: "Technology",
        vectorized: true,
        chunks: 24,
      };

      // Add the extracted data
      addExtractedData(mockExtractedData);
      setProcessing(false);
      setProcessed(true);
      
      toast.success("Processing complete!");
    }, 5000);
  };

  const handleDownloadAll = () => {
    toast.success("All files are being prepared for download");
    // This would actually create and download all files in a real implementation
    // Including vectorized data, formatted text, charts, etc.
  };

  const handleAskAnalystAI = () => {
    if (uploadedReportId) {
      navigate(`/chat?reportId=${uploadedReportId}`);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl pt-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Extract Report Data</h1>
            <p className="text-muted-foreground mt-1">
              Upload an analyst report PDF to extract text, charts, tables, and insights
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Report</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>

          {uploadedReportId && !processed && (
            <ProcessOptions onProcess={processReport} isProcessing={processing} />
          )}

          {processed && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Your report has been successfully processed. You can now:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => navigate(`/results/${uploadedReportId}`)} 
                      variant="outline" 
                      className="h-auto py-4 px-4 flex flex-col items-center justify-center text-center gap-2"
                    >
                      <span className="text-lg font-medium">View Results</span>
                      <span className="text-sm text-muted-foreground">
                        See the extracted text, charts, tables, and insights
                      </span>
                    </Button>
                    
                    <Button 
                      onClick={handleDownloadAll} 
                      variant="outline" 
                      className="h-auto py-4 px-4 flex flex-col items-center justify-center text-center gap-2"
                    >
                      <Download className="h-5 w-5 mb-1" />
                      <span className="text-lg font-medium">Download All</span>
                      <span className="text-sm text-muted-foreground">
                        Get all files (text, charts, vectorized data)
                      </span>
                    </Button>
                    
                    <Button 
                      onClick={handleAskAnalystAI} 
                      className="h-auto py-4 px-4 flex flex-col items-center justify-center text-center gap-2 bg-report-600 hover:bg-report-700 col-span-1 md:col-span-2"
                    >
                      <MessageCircle className="h-5 w-5 mb-1" />
                      <span className="text-lg font-medium">Ask AnalystAI</span>
                      <span className="text-sm">
                        Chat with AI about this report's contents and insights
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Extract;
