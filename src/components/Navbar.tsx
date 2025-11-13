import { Link } from "react-router-dom";
import { Github, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<{username: string; avatar_url: string} | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        setProfile(data);
      };
      fetchProfile();
    }
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Github className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold font-mono">
              Git<span className="text-primary">Daily</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/submit" className="text-sm font-medium hover:text-primary transition-colors">
              Submit Project
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-primary/20">
                      <AvatarImage 
                        src={profile?.avatar_url || user.user_metadata?.avatar_url || ''} 
                        alt={profile?.username || user.email}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {profile?.username?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                <Link to="/auth">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            <Link
              to="/"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/submit"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Submit Project
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
