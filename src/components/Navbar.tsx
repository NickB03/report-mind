
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
import { Menu, File, Upload, MessageCircle, Settings, LogOut, User } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser, isSignedIn } = useReports();

  const handleSignIn = () => {
    // This is a placeholder for the actual Google Sign-In implementation
    // In a real implementation, you would use the Google Sign-In API
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link to="/" className="flex items-center py-4">
              <img src="/logo.png" alt="AnalystAI" className="h-8" />
            </Link>
            <nav className="grid gap-2 text-lg font-medium mt-4">
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
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="AnalystAI" className="h-8 mr-2" />
        </Link>
        <div className="flex-1" />
        
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
