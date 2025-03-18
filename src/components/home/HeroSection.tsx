
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";

const HeroSection = () => {
  const { isSignedIn } = useReports();
  
  return (
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
