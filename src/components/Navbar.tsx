
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, File, Upload, MessageCircle, Settings } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                to="/"
                className="flex items-center gap-2 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/extract"
                className="flex items-center gap-2 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <Upload className="h-4 w-4" />
                Extract
              </Link>
              <Link
                to="/results"
                className="flex items-center gap-2 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <File className="h-4 w-4" />
                Results
              </Link>
              <Link
                to="/chat"
                className="flex items-center gap-2 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="h-4 w-4" />
                AI Chat
              </Link>
              <Link
                to="/config"
                className="flex items-center gap-2 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Configuration
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center text-lg font-semibold">
          <span className="text-report-600">Report</span>
          <span className="text-report-800">Mind</span>
        </Link>
        <div className="flex-1" />
      </div>
    </header>
  );
};

export default Navbar;
