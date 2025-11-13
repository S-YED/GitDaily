import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Coffee, Zap, X, Github } from 'lucide-react';

const SponsorBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border-pink-500/30 relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex justify-center">
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 px-4 py-2">
            <Heart className="h-4 w-4 mr-2 animate-pulse" />
            Support GitDaily
          </Badge>
        </div>
        
        <div>
          <h3 className="text-xl font-bold font-mono mb-2">
            Keep GitDaily <span className="text-primary">Free & Open</span>
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            GitDaily is built and maintained by <strong>Syed Khaja Moinuddin</strong> (@S-YED). 
            Your sponsorship helps keep the servers running and features coming!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button 
            asChild
            size="sm" 
            className="bg-pink-600 hover:bg-pink-700"
          >
            <a 
              href="https://github.com/sponsors/S-YED" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub Sponsors
            </a>
          </Button>
          
          <Button 
            asChild
            size="sm" 
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-500/10"
          >
            <a 
              href="https://buymeacoffee.com/syedkhajams" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Buy me a coffee
            </a>
          </Button>
          
          <Button 
            asChild
            size="sm" 
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-500/10"
          >
            <a 
              href="https://ko-fi.com/syedkhaja" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Zap className="h-4 w-4 mr-2" />
              Ko-fi
            </a>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          💚 Every contribution helps maintain free access for developers worldwide
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorBanner;