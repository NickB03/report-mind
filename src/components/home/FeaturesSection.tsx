
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, MessageCircle } from "lucide-react";

const FeaturesSection = () => {
  return (
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
          <FeatureCard 
            icon={<Upload className="h-12 w-12 text-black" />}
            title="PDF Extraction"
            description="Upload your analyst reports and extract structured content with advanced AI analysis."
          />
          <FeatureCard 
            icon={<FileText className="h-12 w-12 text-black" />}
            title="Visual Data"
            description="Automatically detect and extract charts, tables, and other visual elements from your reports."
          />
          <FeatureCard 
            icon={<MessageCircle className="h-12 w-12 text-black" />}
            title="AI Chat"
            description="Ask questions about your reports and get AI-generated insights and analysis."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6 space-y-4">
        {icon}
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
