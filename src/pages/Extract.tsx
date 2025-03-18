
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import ProcessOptions, { ProcessOptions as ProcessOptionsType } from "@/components/ProcessOptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useReports } from "@/contexts/ReportContext";

const Extract = () => {
  const navigate = useNavigate();
  const { getReport, setReportProcessing, addExtractedData } = useReports();
  const [uploadedReportId, setUploadedReportId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

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
      };

      // Add the extracted data
      addExtractedData(mockExtractedData);
      setProcessing(false);
      
      toast.success("Processing complete!");
      navigate(`/results/${uploadedReportId}`);
    }, 5000);
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl">
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

          {uploadedReportId && (
            <ProcessOptions onProcess={processReport} isProcessing={processing} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Extract;
