
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, File, FileText, MessageCircle, Settings, LogOut, User, Home as HomeIcon } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser, isSignedIn } = useReports();

  const handleSignIn = () => {
    // This is a placeholder for the actual Google Sign-In implementation
    console.log("Sign in with Google");
    // Example of setting a mock user for testing
    setUser({
      id: "google-user-id",
      email: "user@example.com",
      displayName: "Test User",
      photoURL: "https://ui-avatars.com/api/?name=Test+User",
    });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/9874fc9d-1d1a-4db3-a201-1b077b901bb7.png" alt="AnalystAI" className="h-8" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/results" className="text-sm font-medium transition-colors hover:text-primary">
              Files
            </Link>
            <Link to="/chat" className="text-sm font-medium transition-colors hover:text-primary">
              Ask AnalystAI
            </Link>
            <Link to="/config" className="text-sm font-medium transition-colors hover:text-primary">
              Configuration
            </Link>
          </nav>
        </div>
        
        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link to="/" className="flex items-center py-4">
              <img src="/lovable-uploads/9874fc9d-1d1a-4db3-a201-1b077b901bb7.png" alt="AnalystAI" className="h-8" />
            </Link>
            <nav className="grid gap-2 text-lg font-medium mt-4">
              <Link
                to="/"
                className="flex items-center gap-2 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/results"
                className="flex items-center gap-2 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <FileText className="h-4 w-4" />
                Files
              </Link>
              <Link
                to="/chat"
                className="flex items-center gap-2 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="h-4 w-4" />
                Ask AnalystAI
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
        
        {/* User Authentication */}
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                  <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.displayName && (
                    <p className="font-medium">{user.displayName}</p>
                  )}
                  {user?.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/config">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleSignIn} variant="default" className="gap-2">
            <User className="h-4 w-4" />
            Sign In with Google
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
