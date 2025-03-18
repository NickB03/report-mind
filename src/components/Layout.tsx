
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
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 w-full flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar className="hidden md:block border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarContent className="bg-transparent">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Home" 
                    asChild 
                    isActive={isActive("/")}
                    className={cn(
                      "hover:bg-primary/10 transition-colors", 
                      isActive("/") && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Link to="/" className="gap-3">
                      <Home className={cn("text-muted-foreground", isActive("/") && "text-primary")} />
                      <span>Home</span>
                      {isActive("/") && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Extract" 
                    asChild 
                    isActive={isActive("/extract")}
                    className={cn(
                      "hover:bg-primary/10 transition-colors", 
                      isActive("/extract") && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Link to="/extract" className="gap-3">
                      <Upload className={cn("text-muted-foreground", isActive("/extract") && "text-primary")} />
                      <span>Extract</span>
                      {isActive("/extract") && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Results" 
                    asChild 
                    isActive={isActive("/results")}
                    className={cn(
                      "hover:bg-primary/10 transition-colors", 
                      isActive("/results") && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Link to="/results" className="gap-3">
                      <FileText className={cn("text-muted-foreground", isActive("/results") && "text-primary")} />
                      <span>Results</span>
                      {isActive("/results") && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="AI Chat" 
                    asChild 
                    isActive={isActive("/chat")}
                    className={cn(
                      "hover:bg-primary/10 transition-colors", 
                      isActive("/chat") && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Link to="/chat" className="gap-3">
                      <MessageCircle className={cn("text-muted-foreground", isActive("/chat") && "text-primary")} />
                      <span>AI Chat</span>
                      {isActive("/chat") && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Configuration" 
                    asChild 
                    isActive={isActive("/config")}
                    className={cn(
                      "hover:bg-primary/10 transition-colors", 
                      isActive("/config") && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Link to="/config" className="gap-3">
                      <Settings className={cn("text-muted-foreground", isActive("/config") && "text-primary")} />
                      <span>Configuration</span>
                      {isActive("/config") && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
            <div className="container mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
