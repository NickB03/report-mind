
import Layout from "@/components/Layout";
import ReportCard from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Upload } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";
import { useState } from "react";

const ResultsList = () => {
  const { reports } = useReports();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter((report) => 
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Reports</h1>
              <p className="text-muted-foreground mt-1">
                View and analyze your processed reports
              </p>
            </div>
            <Button asChild className="bg-report-600 hover:bg-report-700">
              <Link to="/extract">
                <Upload className="mr-2 h-4 w-4" />
                Upload New
              </Link>
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No reports found</h2>
              {searchQuery ? (
                <p className="text-muted-foreground">
                  No reports match your search query. Try a different search term.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  You haven't uploaded any reports yet. Start by uploading a report.
                </p>
              )}
              {!searchQuery && (
                <Button asChild className="mt-4">
                  <Link to="/extract">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Report
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResultsList;
