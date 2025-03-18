
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const {
    user,
    setUser,
    isSignedIn
  } = useReports();

  const handleSignIn = () => {
    // This is a placeholder for the actual Google Sign-In implementation
    console.log("Sign in with Google");
    // Example of setting a mock user for testing
    setUser({
      id: "google-user-id",
      email: "user@example.com",
      displayName: "Test User",
      photoURL: "https://ui-avatars.com/api/?name=Test+User"
    });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const handleLogoError = () => {
    console.log("Logo loading error, falling back to text");
    setLogoError(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center mr-6">
          {!logoError ? (
            <img 
              src="/lovable-uploads/d6805a68-c487-4dda-8940-958e2dd60cd3.png" 
              alt="AnalystAI" 
              className="h-8 mr-2" 
              onError={handleLogoError}
            />
          ) : (
            <div className="font-bold text-xl">AnalystAI</div>
          )}
        </Link>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center space-x-4 flex-1">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-white/80">
            Home
          </Link>
          <Link to="/extract" className="text-sm font-medium transition-colors hover:text-white/80">
            Files
          </Link>
          <Link to="/chat" className="text-sm font-medium transition-colors hover:text-white/80">
            Ask AnalystAI
          </Link>
          <Link to="/config" className="text-sm font-medium transition-colors hover:text-white/80">
            Configuration
          </Link>
          <a href="https://www.linkedin.com/in/nickbohmer" 
             className="text-sm font-medium transition-colors hover:text-white/80"
             target="_blank" 
             rel="noopener noreferrer">
            Contact
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black text-white pr-0">
            <Link to="/" className="flex items-center py-4">
              {!logoError ? (
                <img 
                  src="/lovable-uploads/d6805a68-c487-4dda-8940-958e2dd60cd3.png" 
                  alt="AnalystAI" 
                  className="h-8" 
                  onError={handleLogoError}
                />
              ) : (
                <div className="font-bold text-xl">AnalystAI</div>
              )}
            </Link>
            <nav className="grid gap-2 text-lg font-medium mt-4">
              <Link to="/" className="flex items-center gap-2 py-2 text-sm" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link to="/extract" className="flex items-center gap-2 py-2 text-sm" onClick={() => setOpen(false)}>
                Files
              </Link>
              <Link to="/chat" className="flex items-center gap-2 py-2 text-sm" onClick={() => setOpen(false)}>
                Ask AnalystAI
              </Link>
              <Link to="/config" className="flex items-center gap-2 py-2 text-sm" onClick={() => setOpen(false)}>
                Configuration
              </Link>
              <a href="https://www.linkedin.com/in/nickbohmer" 
                 className="flex items-center gap-2 py-2 text-sm"
                 target="_blank" 
                 rel="noopener noreferrer" 
                 onClick={() => setOpen(false)}>
                Contact
              </a>
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 md:flex-none" />
        
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
                  {user?.displayName && <p className="font-medium">{user.displayName}</p>}
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
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleSignIn} variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Sign In with Google
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
