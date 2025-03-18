
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendHorizontal, User, Loader2 } from "lucide-react";
import { useReports, ExtractedData } from "@/contexts/ReportContext";

interface ChatInterfaceProps {
  reportId?: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatInterface = ({ reportId }: ChatInterfaceProps) => {
  const { getExtractedData, getReport } = useReports();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const extractedData = reportId ? getExtractedData(reportId) : undefined;
  const report = reportId ? getReport(reportId) : undefined;

  // Generate a summary of the report when component mounts
  useEffect(() => {
    if (reportId && report && !messages.length) {
      // First add loading message
      const loadingMessage = {
        id: "loading",
        content: "Analyzing report...",
        sender: "ai" as const,
        timestamp: new Date(),
      };
      setMessages([loadingMessage]);
      
      // Simulate API call for summary generation
      setTimeout(() => {
        const summaryContent = generateReportSummary(extractedData);
        
        const initialMessage = {
          id: Date.now().toString(),
          content: `📄 **Report Summary**: ${summaryContent}\n\nWhat would you like to know about "${report.name}"?`,
          sender: "ai" as const,
          timestamp: new Date(),
        };
        
        setMessages([initialMessage]);
      }, 1000);
    } else if (!reportId && !messages.length) {
      const initialMessage = {
        id: Date.now().toString(),
        content: "Welcome! I can help you analyze reports and provide insights. Please select a report to analyze or ask a general question.",
        sender: "ai" as const,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [reportId, report, messages.length, extractedData]);

  // Generate a summary based on the extracted data
  const generateReportSummary = (data?: ExtractedData): string => {
    if (!data) return "No data available for this report.";
    
    // Build a summary based on available data
    const tableCount = data.tables.length;
    const chartCount = data.charts.length;
    const insightCount = data.insights.length;
    
    let summary = `This ${data.text.length}-page report contains ${tableCount} tables and ${chartCount} charts.`;
    
    // Add industry if available
    if (data.industry) {
      summary += ` The report is about the ${data.industry} industry.`;
    }
    
    // Add insights if available
    if (insightCount > 0) {
      summary += "\n\nKey insights:";
      data.insights.forEach((insight, index) => {
        if (index < 3) { // Limit to 3 insights for brevity
          summary += `\n• ${insight.text}`;
        }
      });
      
      if (insightCount > 3) {
        summary += `\n• Plus ${insightCount - 3} more insights...`;
      }
    }
    
    // Add report summary if available
    if (data.summary) {
      summary += `\n\n${data.summary}`;
    }
    
    return summary;
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    // Simulate AI response with relevant information from the extractedData
    setTimeout(() => {
      let aiResponse = "";

      if (extractedData) {
        // Generate contextual response based on user query and extracted data
        if (inputValue.toLowerCase().includes("summary") || inputValue.toLowerCase().includes("overview")) {
          aiResponse = `This ${extractedData.text.length}-page report contains ${extractedData.tables.length} tables and ${extractedData.charts.length} charts. The key insights suggest that ${extractedData.insights[0]?.text || "the market is evolving rapidly with several key players emerging as leaders."}`;
        } else if (inputValue.toLowerCase().includes("table") || inputValue.toLowerCase().includes("tables")) {
          aiResponse = `I found ${extractedData.tables.length} tables in the report. ${
            extractedData.tables.length > 0
              ? `The most notable one is "${extractedData.tables[0]?.title || "Market Share Analysis"}" on page ${extractedData.tables[0]?.page || 1}.`
              : ""
          }`;
        } else if (inputValue.toLowerCase().includes("chart") || inputValue.toLowerCase().includes("graph")) {
          aiResponse = `There are ${extractedData.charts.length} charts in this report. ${
            extractedData.charts.length > 0
              ? `One significant chart is "${extractedData.charts[0]?.title || "Market Growth Projection"}" which is a ${extractedData.charts[0]?.type || "line"} chart on page ${extractedData.charts[0]?.page || 1}.`
              : ""
          }`;
        } else if (inputValue.toLowerCase().includes("insight") || inputValue.toLowerCase().includes("key finding")) {
          aiResponse = `Key insights from this report include: ${extractedData.insights.map(i => i.text).join("; ")}`;
        } else {
          aiResponse = `Based on my analysis of the report, ${extractedData.insights[0]?.text || "the data indicates significant market growth in this sector."}. Would you like to know more about a specific aspect of the report?`;
        }
      } else {
        aiResponse = "I don't have specific data about this report yet. Would you like me to explain how the report extraction process works?";
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-report-100 text-report-600">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-report-600 text-white"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-report-100 text-report-600">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-report-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <Separator className="my-2" />
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about the report..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !inputValue.trim()}>
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
