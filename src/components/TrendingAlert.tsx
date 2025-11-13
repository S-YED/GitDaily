import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Rocket, Star, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HotProject {
  id: string;
  repo_name: string;
  stars: number;
  category: string;
  created_at: string;
}

const TrendingAlert = () => {
  const { user } = useAuth();
  const [hotProjects, setHotProjects] = useState<HotProject[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHotProjects();
    }
  }, [user]);

  const fetchHotProjects = async () => {
    // Get projects added in last 6 hours with high star velocity
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from('projects')
      .select('id, repo_name, stars, category, created_at')
      .gte('created_at', sixHoursAgo)
      .gte('stars', 1000)
      .order('stars', { ascending: false })
      .limit(3);

    if (data) {
      setHotProjects(data);
    }
  };

  if (!user || hotProjects.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-orange-500" />
          🔥 Trending Alert
          <Badge variant="destructive" className="ml-auto animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Hot projects detected in the last 6 hours!
        </p>
        
        {hotProjects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-sm">{project.repo_name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {project.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {project.stars.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.floor((Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60))}h ago
                </div>
              </div>
            </div>
            <Rocket className="h-4 w-4 text-orange-500" />
          </div>
        ))}
        
        <Button 
          size="sm" 
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => setAlertsEnabled(!alertsEnabled)}
        >
          {alertsEnabled ? '🔔 Alerts On' : '🔕 Enable Alerts'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrendingAlert;