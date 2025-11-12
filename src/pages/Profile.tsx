import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, Flame, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Profile {
  username: string;
  avatar_url: string;
  bio: string;
  visits: number;
  streak: number;
}

interface UserBadge {
  badges: {
    name: string;
    description: string;
    icon: string;
  };
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBadges();
      fetchFavoritesCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchBadges = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_badges')
      .select('badges(name, description, icon)')
      .eq('user_id', user.id);

    if (data) {
      setBadges(data as UserBadge[]);
    }
  };

  const fetchFavoritesCount = async () => {
    if (!user) return;
    
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setFavoritesCount(count || 0);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Profile Header */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <h1 className="text-3xl font-bold font-mono">{profile.username}</h1>
                  {profile.bio && (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        <span className="font-semibold">{favoritesCount}</span> Favorites
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-accent" />
                      <span className="text-sm">
                        <span className="font-semibold">{profile.streak}</span> Day Streak
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        <span className="font-semibold">{profile.visits}</span> Visits
                      </span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={() => navigate('/submit')}>
                  Submit Project
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          {badges.length > 0 && (
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="font-mono flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <span className="text-4xl mb-2">{badge.badges.icon}</span>
                      <span className="font-semibold text-sm text-center">
                        {badge.badges.name}
                      </span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        {badge.badges.description}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="font-mono">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-lg">
                  <span className="text-sm">Total Visits</span>
                  <Badge variant="secondary">{profile.visits}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-lg">
                  <span className="text-sm">Current Streak</span>
                  <Badge variant="secondary" className="gap-1">
                    <Flame className="h-3 w-3" />
                    {profile.streak} days
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-lg">
                  <span className="text-sm">Favorited Projects</span>
                  <Badge variant="secondary">{favoritesCount}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
