
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Upload, FileText, MessageCircle, ArrowRight, CheckCircle } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";

const Home = () => {
  const { reports, isSignedIn } = useReports();
  const processedCount = reports.filter((r) => r.processed).length;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-white text-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block text-sm font-medium px-3 py-1 bg-gray-100 text-black rounded-md">
                AI-Powered Report Analysis
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="text-black">Analyst</span>
                <span className="text-gray-600">AI</span>
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl">
                Extract insights from analyst reports with AI-powered analysis. Make better decisions faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                  <Link to="/extract">
                    <Upload className="mr-2 h-4 w-4" />
                    Extract a Report
                  </Link>
                </Button>
                {!isSignedIn && (
                  <Button variant="outline" size="lg" className="text-black border-black hover:bg-gray-100">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-auto lg:mx-0 p-4 lg:p-10">
              <div className="rounded-lg overflow-hidden bg-gray-100 p-1">
                <img
                  src="/lovable-uploads/d6805a68-c487-4dda-8940-958e2dd60cd3.png"
                  alt="AnalystAI Logo"
                  className="rounded shadow-xl bg-white p-4"
                  width={550}
                  height={400}
                  onError={(e) => {
                    console.log("Image failed to load");
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Powerful Analysis Tools
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Extract text, detect charts and tables, and generate AI-powered insights from your analyst reports.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 space-y-4">
                <Upload className="h-12 w-12 text-black" />
                <h3 className="text-xl font-bold">PDF Extraction</h3>
                <p className="text-gray-600">
                  Upload your analyst reports and extract structured content with advanced AI analysis.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 space-y-4">
                <FileText className="h-12 w-12 text-black" />
                <h3 className="text-xl font-bold">Visual Data</h3>
                <p className="text-gray-600">
                  Automatically detect and extract charts, tables, and other visual elements from your reports.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 space-y-4">
                <MessageCircle className="h-12 w-12 text-black" />
                <h3 className="text-xl font-bold">AI Chat</h3>
                <p className="text-gray-600">
                  Ask questions about your reports and get AI-generated insights and analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Simple 3-Step Process
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                AnalystAI makes it easy to extract insights from complex analyst reports.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-black">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold">Upload</h3>
              <p className="text-gray-600">
                Upload your analyst report PDF through our secure interface.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-black">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold">Process</h3>
              <p className="text-gray-600">
                Our AI analyzes the document to extract text, tables, charts, and generates insights.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-black">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">Analyze</h3>
              <p className="text-gray-600">
                View results, download extractions, or chat with AI to gain deeper insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Processed Reports */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Get Started?
              </h2>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Join {processedCount > 0 ? processedCount : 'hundreds of'} analysts who are already using AnalystAI to extract insights from their reports.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-black" />
                  <span>AI-powered text extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-black" />
                  <span>Chart and table detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-black" />
                  <span>Intelligent insights generation</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                  <Link to="/extract">Get Started Now</Link>
                </Button>
              </div>
            </div>
            {reports.length > 0 ? (
              <div className="mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-xl bg-white border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Processed Reports</h3>
                <div className="space-y-4">
                  {reports.slice(0, 3).map((report) => (
                    <div key={report.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-500">
                          {report.processed ? 'Processed' : 'Pending'}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm" className="border-gray-300 text-black">
                        <Link to={`/results/${report.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                  {reports.length > 3 && (
                    <Button asChild variant="link" className="w-full text-black">
                      <Link to="/results">View All Reports</Link>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-xl bg-white border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Your Reports</h3>
                <p className="text-gray-500 mb-4">
                  You haven't processed any reports yet. Upload your first report to get started.
                </p>
                <Button asChild variant="outline" className="border-gray-300 text-black">
                  <Link to="/extract">Upload Your First Report</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
