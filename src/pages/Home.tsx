
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Upload, Search, MessageCircle, Settings, LogIn } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";

const Home = () => {
  const { reports, isSignedIn } = useReports();
  const processedCount = reports.filter((r) => r.processed).length;

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl">
        <div className="space-y-8">
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl font-bold flex items-center justify-center flex-wrap gap-1">
              <span className="text-report-600">Analyst</span>
              <span className="text-report-800">AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Extract insights from analyst reports with AI-powered analysis and understanding
            </p>
          </div>

          <Card className="bg-gradient-to-r from-report-50 to-report-100 border-report-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-report-900 mb-2">
                    Start Analyzing Reports
                  </h2>
                  <p className="text-report-700 mb-4">
                    Upload your analyst reports to extract text, charts, tables, and get AI-powered insights
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild className="bg-report-600 hover:bg-report-700">
                      <Link to="/extract">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Report
                      </Link>
                    </Button>
                    {!isSignedIn && (
                      <Button variant="outline" className="gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In to Save Reports
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-report-200 rounded-full flex items-center justify-center text-report-600">
                    <Upload className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-report-500" />
                  View Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-muted-foreground text-sm">
                  Browse and search through your processed reports
                </p>
                <p className="font-medium">{processedCount} processed reports</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/results">View Reports</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5 text-report-500" />
                  AI Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-muted-foreground text-sm">
                  Interact with AI to get insights about your reports
                </p>
                <p className="font-medium">Ask questions about your data</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/chat">Open Chat</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-report-500" />
                  Configure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-muted-foreground text-sm">
                  Manage vendors, patterns, and API settings
                </p>
                <p className="font-medium">Customize your experience</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/config">Configure</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
