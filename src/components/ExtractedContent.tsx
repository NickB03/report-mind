
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, BarChart, Table } from "lucide-react";
import { ExtractedData } from "@/contexts/ReportContext";
import { toast } from "sonner";

interface ExtractedContentProps {
  data: ExtractedData;
}

const ExtractedContent = ({ data }: ExtractedContentProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleDownload = () => {
    toast.success("Download started");
    // This would actually create and download a file in a real implementation
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Extracted Content</h2>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
      </div>
      
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="tables" className="flex items-center">
            <Table className="mr-2 h-4 w-4" />
            Tables ({data.tables.length})
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Charts ({data.charts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Text Content</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage + 1} of {data.text.length}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(Math.min(data.text.length - 1, currentPage + 1))}
                    disabled={currentPage === data.text.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-md p-4 min-h-[400px] whitespace-pre-line">
                {data.text[currentPage] || "No text content available for this page."}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tables" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Tables</CardTitle>
            </CardHeader>
            <CardContent>
              {data.tables.length > 0 ? (
                <div className="space-y-6">
                  {data.tables.map((table) => (
                    <div key={table.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">{table.title}</h3>
                        <span className="text-sm text-muted-foreground">Page {table.page}</span>
                      </div>
                      <div className="border rounded-md overflow-x-auto">
                        <table className="w-full min-w-full divide-y divide-border">
                          <tbody className="bg-card divide-y divide-border">
                            {table.data.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <td 
                                    key={cellIndex}
                                    className={`px-4 py-2 text-sm ${
                                      rowIndex === 0 ? "font-medium bg-muted/50" : ""
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No tables detected in this report.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="charts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Charts</CardTitle>
            </CardHeader>
            <CardContent>
              {data.charts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.charts.map((chart) => (
                    <div key={chart.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">{chart.title}</h3>
                        <span className="text-sm text-muted-foreground">Page {chart.page}</span>
                      </div>
                      <div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center">
                        {/* In a real implementation, this would display the actual chart image */}
                        <BarChart className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Type: {chart.type}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No charts detected in this report.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.insights.length > 0 ? (
              data.insights.map((insight) => (
                <div key={insight.id} className="bg-muted/50 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{insight.category}</h3>
                    <span className="text-xs text-muted-foreground">
                      Confidence: {(insight.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p>{insight.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No AI insights generated for this report.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtractedContent;
