
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ChatInterface from "@/components/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReports } from "@/contexts/ReportContext";

const Chat = () => {
  const { reports } = useReports();
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  
  // Set first processed report as default selection if available
  useEffect(() => {
    const processedReports = reports.filter(r => r.processed);
    if (processedReports.length > 0 && !selectedReportId) {
      setSelectedReportId(processedReports[0].id);
    }
  }, [reports, selectedReportId]);

  const processedReports = reports.filter(r => r.processed);

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">AI Chat</h1>
            <p className="text-muted-foreground mt-1">
              Ask questions about your reports and get AI-powered insights
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Report Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <Select value={selectedReportId} onValueChange={setSelectedReportId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a report" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">General Questions (No specific report)</SelectItem>
                    {processedReports.map((report) => (
                      <SelectItem key={report.id} value={report.id}>
                        {report.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[500px]">
            <CardContent className="pt-6 h-full">
              <ChatInterface reportId={selectedReportId || undefined} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
