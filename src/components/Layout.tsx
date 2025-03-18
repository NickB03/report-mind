
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { Sidebar } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar className="hidden md:block">
          <Sidebar.Nav>
            <Sidebar.NavItem href="/" active icon="home">
              Home
            </Sidebar.NavItem>
            <Sidebar.NavItem href="/extract" icon="upload">
              Extract
            </Sidebar.NavItem>
            <Sidebar.NavItem href="/results" icon="file">
              Results
            </Sidebar.NavItem>
            <Sidebar.NavItem href="/chat" icon="message-circle">
              AI Chat
            </Sidebar.NavItem>
            <Sidebar.NavItem href="/config" icon="settings">
              Configuration
            </Sidebar.NavItem>
          </Sidebar.Nav>
        </Sidebar>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
