
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";

const HeroSection = () => {
  const { isSignedIn } = useReports();
  
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-white text-black">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-[800px]">
            <div className="inline-block text-sm font-medium px-3 py-1 bg-gray-100 text-black rounded-md">
              AI-Powered Report Analysis
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-black">Analyst</span>
              <span className="text-gray-600">AI</span>
            </h1>
            <p className="text-gray-700 md:text-xl max-w-[600px] mx-auto">
              Extract insights from analyst reports with AI-powered analysis. Make better decisions faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
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
