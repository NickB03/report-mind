
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProcessOptionsProps {
  onProcess: (options: ProcessOptions) => void;
  isProcessing: boolean;
}

export interface ProcessOptions {
  extractText: boolean;
  detectCharts: boolean;
  detectTables: boolean;
  generateInsights: boolean;
}

const ProcessOptions = ({ onProcess, isProcessing }: ProcessOptionsProps) => {
  const [options, setOptions] = useState<ProcessOptions>({
    extractText: true,
    detectCharts: true,
    detectTables: true,
    generateInsights: true,
  });

  const handleOptionChange = (option: keyof ProcessOptions) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleProcess = () => {
    onProcess(options);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="extractText"
              checked={options.extractText}
              onCheckedChange={() => handleOptionChange("extractText")}
            />
            <Label htmlFor="extractText">Extract Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="detectCharts"
              checked={options.detectCharts}
              onCheckedChange={() => handleOptionChange("detectCharts")}
            />
            <Label htmlFor="detectCharts">Detect Charts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="detectTables"
              checked={options.detectTables}
              onCheckedChange={() => handleOptionChange("detectTables")}
            />
            <Label htmlFor="detectTables">Detect Tables</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="generateInsights"
              checked={options.generateInsights}
              onCheckedChange={() => handleOptionChange("generateInsights")}
            />
            <Label htmlFor="generateInsights">Generate AI Insights</Label>
          </div>
        </div>
        <Button
          className="w-full"
          onClick={handleProcess}
          disabled={isProcessing || !Object.values(options).some(Boolean)}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Report"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcessOptions;
