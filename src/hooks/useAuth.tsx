import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const trackVisit = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('visits, streak, last_visited')
      .eq('id', userId)
      .single();

    if (!profile) return;

    const lastVisited = profile.last_visited ? new Date(profile.last_visited).toISOString().split('T')[0] : null;
    
    if (lastVisited === today) return;

    let newStreak = profile.streak || 0;
    
    if (lastVisited) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastVisited === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await supabase
      .from('profiles')
      .update({
        visits: (profile.visits || 0) + 1,
        streak: newStreak,
        last_visited: new Date().toISOString()
      })
      .eq('id', userId);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user && event === 'SIGNED_IN') {
          await trackVisit(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        await trackVisit(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username || email.split('@')[0]
        }
      }
    });
    
    if (!error) {
      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <div>
            <div className="font-semibold">🎉 Welcome to GitDaily!</div>
            <div className="text-sm text-muted-foreground">
              Check your email for confirmation link
            </div>
          </div>
        </div>,
        { duration: 6000 }
      );
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      toast.success('Signed in successfully!');
      setTimeout(() => navigate('/'), 100);
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
