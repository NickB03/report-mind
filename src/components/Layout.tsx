
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Home, Upload, FileText, MessageCircle, Settings, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar className="hidden md:block border-r border-gray-100">
            <SidebarContent className="bg-white">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Home" 
                    asChild 
                    isActive={isActive("/")}
                    className={cn(
                      "hover:bg-report-50 transition-colors", 
                      isActive("/") && "bg-report-50 text-report-700 font-medium"
                    )}
                  >
                    <Link to="/" className="gap-3">
                      <Home className={cn("text-gray-500", isActive("/") && "text-report-600")} />
                      <span>Home</span>
                      {isActive("/") && <ChevronRight className="ml-auto h-4 w-4 text-report-600" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Extract" 
                    asChild 
                    isActive={isActive("/extract")}
                    className={cn(
                      "hover:bg-report-50 transition-colors", 
                      isActive("/extract") && "bg-report-50 text-report-700 font-medium"
                    )}
                  >
                    <Link to="/extract" className="gap-3">
                      <Upload className={cn("text-gray-500", isActive("/extract") && "text-report-600")} />
                      <span>Extract</span>
                      {isActive("/extract") && <ChevronRight className="ml-auto h-4 w-4 text-report-600" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Results" 
                    asChild 
                    isActive={isActive("/results")}
                    className={cn(
                      "hover:bg-report-50 transition-colors", 
                      isActive("/results") && "bg-report-50 text-report-700 font-medium"
                    )}
                  >
                    <Link to="/results" className="gap-3">
                      <FileText className={cn("text-gray-500", isActive("/results") && "text-report-600")} />
                      <span>Results</span>
                      {isActive("/results") && <ChevronRight className="ml-auto h-4 w-4 text-report-600" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="AI Chat" 
                    asChild 
                    isActive={isActive("/chat")}
                    className={cn(
                      "hover:bg-report-50 transition-colors", 
                      isActive("/chat") && "bg-report-50 text-report-700 font-medium"
                    )}
                  >
                    <Link to="/chat" className="gap-3">
                      <MessageCircle className={cn("text-gray-500", isActive("/chat") && "text-report-600")} />
                      <span>AI Chat</span>
                      {isActive("/chat") && <ChevronRight className="ml-auto h-4 w-4 text-report-600" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Configuration" 
                    asChild 
                    isActive={isActive("/config")}
                    className={cn(
                      "hover:bg-report-50 transition-colors", 
                      isActive("/config") && "bg-report-50 text-report-700 font-medium"
                    )}
                  >
                    <Link to="/config" className="gap-3">
                      <Settings className={cn("text-gray-500", isActive("/config") && "text-report-600")} />
                      <span>Configuration</span>
                      {isActive("/config") && <ChevronRight className="ml-auto h-4 w-4 text-report-600" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 bg-white">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
