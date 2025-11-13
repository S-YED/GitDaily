import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, TrendingUp, Star, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DailyDigest = () => {
  const { user } = useAuth();
  const [digestEnabled, setDigestEnabled] = useState(false);
  const [todayStats, setTodayStats] = useState({
    newProjects: 0,
    topCategory: '',
    totalStars: 0
  });

  useEffect(() => {
    if (user) {
      fetchDigestPreference();
      fetchTodayStats();
    }
  }, [user]);

  const fetchDigestPreference = async () => {
    // In a real app, you'd store this in user preferences
    setDigestEnabled(true);
  };

  const fetchTodayStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: projects } = await supabase
      .from('projects')
      .select('category, stars')
      .eq('featured_date', today);

    if (projects) {
      const categoryCount: Record<string, number> = {};
      let totalStars = 0;

      projects.forEach(p => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
        totalStars += p.stars;
      });

      const topCategory = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'AI';

      setTodayStats({
        newProjects: projects.length,
        topCategory,
        totalStars
      });
    }
  };

  const toggleDigest = async () => {
    setDigestEnabled(!digestEnabled);
    toast.success(digestEnabled ? 'Daily digest disabled' : 'Daily digest enabled! 📧');
  };

  if (!user) return null;

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-primary" />
          Daily Digest
          <Badge variant="secondary" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{todayStats.newProjects}</div>
            <div className="text-xs text-muted-foreground">New Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">{todayStats.topCategory}</div>
            <div className="text-xs text-muted-foreground">Top Category</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{(todayStats.totalStars / 1000).toFixed(1)}k</div>
            <div className="text-xs text-muted-foreground">Total Stars</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            Get personalized insights delivered daily
          </div>
          <Button 
            size="sm" 
            variant={digestEnabled ? "default" : "outline"}
            onClick={toggleDigest}
          >
            {digestEnabled ? 'Enabled' : 'Enable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyDigest;