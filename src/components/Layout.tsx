
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
import { Home, Upload, FileText, MessageCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar className="hidden md:block">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Home" asChild isActive={window.location.pathname === "/"}>
                    <Link to="/">
                      <Home className="text-report-600" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Extract" asChild isActive={window.location.pathname === "/extract"}>
                    <Link to="/extract">
                      <Upload className="text-report-600" />
                      <span>Extract</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Results" asChild isActive={window.location.pathname.startsWith("/results")}>
                    <Link to="/results">
                      <FileText className="text-report-600" />
                      <span>Results</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="AI Chat" asChild isActive={window.location.pathname === "/chat"}>
                    <Link to="/chat">
                      <MessageCircle className="text-report-600" />
                      <span>AI Chat</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Configuration" asChild isActive={window.location.pathname === "/config"}>
                    <Link to="/config">
                      <Settings className="text-report-600" />
                      <span>Configuration</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
