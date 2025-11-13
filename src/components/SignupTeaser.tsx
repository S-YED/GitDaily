import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Bell, Mail, Trophy, Zap } from 'lucide-react';

const SignupTeaser = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <CardContent className="relative p-8 text-center space-y-6">
        <div className="flex justify-center">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Unlock Premium Features
          </Badge>
        </div>
        
        <h3 className="text-2xl font-bold font-mono">
          <span className="text-primary">$ ./unlock</span> --developer-mode
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-4 p-4 bg-background/50 rounded-lg backdrop-blur-sm border border-primary/20">
            <div className="text-2xl">⚡</div>
            <div>
              <div className="font-mono font-semibold text-primary">git push --force-with-lease</div>
              <div className="text-sm text-muted-foreground mt-1">Get trending repos before they hit HackerNews</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-background/50 rounded-lg backdrop-blur-sm border border-primary/20">
            <div className="text-2xl">🔍</div>
            <div>
              <div className="font-mono font-semibold text-primary">grep -r "TODO" --exclude-dir=node_modules</div>
              <div className="text-sm text-muted-foreground mt-1">Smart filters by language, stars, and recency</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-background/50 rounded-lg backdrop-blur-sm border border-primary/20">
            <div className="text-2xl">📊</div>
            <div>
              <div className="font-mono font-semibold text-primary">npm run analyze</div>
              <div className="text-sm text-muted-foreground mt-1">Weekly digest with growth metrics and tech trends</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-background/50 rounded-lg backdrop-blur-sm border border-primary/20">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="font-mono font-semibold text-primary">curl -s api/watchlist | jq '.[]'</div>
              <div className="text-sm text-muted-foreground mt-1">Personal API for your starred repos and alerts</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
            <Link to="/auth">
              <Sparkles className="h-5 w-5 mr-2" />
              Join Free Now
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground font-mono">
            ✨ Free tier • OAuth login • Join 2,847 developers
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupTeaser;