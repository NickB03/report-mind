
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ExtractedContent from "@/components/ExtractedContent";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, MessageCircle } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReport, getExtractedData } = useReports();

  const report = id ? getReport(id) : undefined;
  const extractedData = id ? getExtractedData(id) : undefined;

  if (!report || !extractedData) {
    return (
      <Layout>
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The report you're looking for doesn't exist or hasn't been processed yet.
            </p>
            <Button onClick={() => navigate("/results")}>Back to Results</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/results")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{report.name}</h1>
              <p className="text-sm text-muted-foreground">
                Uploaded on {report.uploadedAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          <Tabs defaultValue="content">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Report Content
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-6">
              <ExtractedContent data={extractedData} />
            </TabsContent>
            <TabsContent value="chat" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ChatInterface reportId={id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
