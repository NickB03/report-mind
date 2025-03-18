
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import ProcessOptions, { ProcessOptions as ProcessOptionsType } from "@/components/ProcessOptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useReports } from "@/contexts/ReportContext";
import { Download, MessageCircle, FileText, ChevronDown, ChevronUp, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Extract = () => {
  const navigate = useNavigate();
  const { getReport, setReportProcessing, addExtractedData } = useReports();
  const [uploadedReportId, setUploadedReportId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [pdfDetails, setPdfDetails] = useState<{name: string, size: string, pages: number, uploadDate: string} | null>(null);
  const [showPdfDetails, setShowPdfDetails] = useState(true);

  const handleUploadComplete = (reportId: string) => {
    setUploadedReportId(reportId);
    toast.success("Upload complete!");
    
    // Set mock PDF details
    const report = getReport(reportId);
    if (report) {
      setPdfDetails({
        name: report.name,
        size: formatFileSize(report.size),
        pages: Math.floor(Math.random() * 30) + 5, // Mock page count between 5-35
        uploadDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
      
      // Add AI welcome message to chat
      setChatMessages([
        {
          type: 'ai',
          content: `I've analyzed your PDF "${pdfDetails?.name}". You can ask me any questions about its content.`
        }
      ]);
      
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

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Add user message
      setChatMessages(prev => [...prev, { type: 'user', content: chatInput.trim() }]);
      
      // Simulate AI thinking and responding
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev, 
          { 
            type: 'ai', 
            content: `Based on the report, I can tell you that ${chatInput.trim().includes('?') ? 'the answer involves market growth trends and competitive positioning. The report indicates significant opportunities in the technology sector, with projected growth rates exceeding industry averages.' : 'this report covers market analysis, competitive landscape, and growth projections for the technology sector. Key findings suggest a positive trajectory for market leaders with innovative product offerings.'}`
          }
        ]);
      }, 1500);
      
      // Clear input
      setChatInput("");
    }
  };

  const togglePdfDetails = () => {
    setShowPdfDetails(!showPdfDetails);
  };

  if (!processed) {
    return (
      <Layout>
        <div className="container max-w-6xl pt-6 px-4">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-report-600 to-purple-600 text-transparent bg-clip-text">
                Extract Report Data
              </h1>
              <p className="text-muted-foreground mt-2">
                Upload an analyst report PDF to extract text, charts, tables, and insights
              </p>
            </div>

            <Card className="border border-report-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-report-700">Upload Report</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload onUploadComplete={handleUploadComplete} />
              </CardContent>
            </Card>

            {uploadedReportId && !processed && (
              <ProcessOptions onProcess={processReport} isProcessing={processing} />
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-0 mx-auto h-[calc(100vh-64px)]">
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-64px)]">
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-report-700">PDF Details</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={togglePdfDetails} 
                  className="text-gray-500"
                >
                  {showPdfDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
              
              {showPdfDetails && pdfDetails && (
                <Card className="border-report-100 mb-4">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2 truncate">{pdfDetails.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">File size</p>
                        <p className="font-medium">{pdfDetails.size}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pages</p>
                        <p className="font-medium">{pdfDetails.pages}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Uploaded</p>
                        <p className="font-medium">{pdfDetails.uploadDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium text-green-600">Processed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex flex-col gap-3 mt-2">
                <Button 
                  onClick={() => navigate(`/results/${uploadedReportId}`)} 
                  variant="outline" 
                  className="justify-start gap-2 border-report-100 hover:bg-report-50 text-gray-700"
                >
                  <FileText className="h-4 w-4 text-report-600" />
                  View Full Results
                </Button>
                
                <Button 
                  onClick={handleDownloadAll} 
                  variant="outline" 
                  className="justify-start gap-2 border-report-100 hover:bg-report-50 text-gray-700"
                >
                  <Download className="h-4 w-4 text-report-600" />
                  Download All Files
                </Button>
              </div>
              
              <div className="mt-auto pt-4">
                <Card className="border-report-100 bg-gray-50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Processing Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Text Extracted</span>
                        <span className="font-medium">10 pages</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tables Detected</span>
                        <span className="font-medium">3 tables</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Charts Identified</span>
                        <span className="font-medium">4 charts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Key Insights</span>
                        <span className="font-medium">3 insights</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={60}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-report-700 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-report-600" />
                  Chat with this PDF
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Ask questions about the content and get AI-powered answers
                </p>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="rounded-full bg-report-50 p-4 mb-4">
                      <FileText className="h-10 w-10 text-report-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ask questions about your report</h3>
                    <p className="text-muted-foreground max-w-md">
                      The PDF has been processed and analyzed. You can now ask any questions about its content and get AI-powered insights.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === 'user' 
                              ? 'bg-report-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your question here..."
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-report-500 focus:border-transparent"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    className="bg-report-600 hover:bg-report-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Layout>
  );
};

export default Extract;
