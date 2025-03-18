
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Extract from "./pages/Extract";
import Results from "./pages/Results";
import ResultsList from "./pages/ResultsList";
import Chat from "./pages/Chat";
import Config from "./pages/Config";
import NotFound from "./pages/NotFound";
import { ReportProvider } from "./contexts/ReportContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ReportProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/extract" element={<Extract />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/results" element={<ResultsList />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/config" element={<Config />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ReportProvider>
  </QueryClientProvider>
);

export default App;
