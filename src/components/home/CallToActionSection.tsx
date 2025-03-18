
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useReports, ReportFile } from "@/contexts/ReportContext";

const CallToActionSection = () => {
  const { reports, getExtractedData } = useReports();
  const processedCount = reports.filter(r => r.processed).length;

  return (
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
              <FeatureItem text="AI-powered text extraction" />
              <FeatureItem text="Chart and table detection" />
              <FeatureItem text="Intelligent insights generation" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                <Link to="/extract">Get Started Now</Link>
              </Button>
            </div>
          </div>
          
          {reports.length > 0 ? (
            <ProcessedReportsCard reports={reports} />
          ) : (
            <EmptyReportsCard />
          )}
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  text: string;
}

const FeatureItem = ({ text }: FeatureItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle className="h-5 w-5 text-black" />
      <span>{text}</span>
    </div>
  );
};

interface ProcessedReportsCardProps {
  reports: ReportFile[];
}

const ProcessedReportsCard = ({ reports }: ProcessedReportsCardProps) => {
  return (
    <div className="mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-xl bg-white border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-4">Processed Reports</h3>
      <div className="space-y-4">
        {reports.slice(0, 3).map(report => (
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
  );
};

const EmptyReportsCard = () => {
  return (
    <div className="mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-xl bg-white border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-4">Your Reports</h3>
      <p className="text-gray-500 mb-4">
        You haven't processed any reports yet. Upload your first report to get started.
      </p>
      <Button asChild variant="outline" className="border-gray-300 text-black">
        <Link to="/extract">Upload Your First Report</Link>
      </Button>
    </div>
  );
};

export default CallToActionSection;
