import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, ExternalLink, Heart } from "lucide-react";
import { Project } from "@/hooks/useProjects";

interface ProjectCardProps extends Project {
  onToggleFavorite?: (id: string) => void;
}

const ProjectCardEnhanced = ({
  id,
  repo_name,
  repo_url,
  description,
  language,
  stars,
  forks,
  category,
  ai_summary,
  why_trending,
  is_favorited,
  onToggleFavorite
}: ProjectCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Card className="group h-full glass hover:glass-strong border-border/50 hover:border-primary/50 transition-all duration-500 hover-lift overflow-hidden relative">
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <CardHeader className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-mono group-hover:text-primary transition-all duration-300 line-clamp-1 group-hover:scale-105 transform origin-left">
              {repo_name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-2 text-sm">
              {description || 'No description available'}
            </CardDescription>
          </div>
          
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 hover:scale-110 transition-transform duration-200"
              onClick={() => onToggleFavorite(id)}
            >
              <Heart
                className={`h-5 w-5 transition-all duration-300 ${
                  is_favorited ? 'fill-primary text-primary scale-110' : 'text-muted-foreground hover:text-primary'
                }`}
              />
            </Button>
          )}
        </div>

        {ai_summary && (
          <div className="text-sm text-muted-foreground glass p-4 rounded-lg border border-primary/20 backdrop-blur-sm">
            <span className="text-xs text-primary font-bold uppercase tracking-wide">✨ AI Summary</span>
            <p className="mt-2 leading-relaxed">{ai_summary}</p>
          </div>
        )}

        {why_trending && (
          <div className="flex items-start gap-3 text-sm glass-strong p-3 rounded-lg border border-accent/30">
            <span className="text-2xl animate-pulse">🔥</span>
            <span className="text-accent-foreground leading-relaxed">{why_trending}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-semibold">{formatNumber(stars)}</span>
          </div>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <GitFork className="h-4 w-4 text-primary" />
            <span className="font-semibold">{formatNumber(forks)}</span>
          </div>
          {language && (
            <Badge variant="secondary" className="text-xs glass">
              {language}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Badge variant="outline" className="text-xs glass font-medium">
            {category}
          </Badge>
          
          <Button
            asChild
            size="sm"
            variant="default"
            className="bg-primary hover:bg-primary-glow shadow-glow hover:shadow-glow-strong transition-all duration-300 font-semibold group/btn"
          >
            <a href={repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-200" />
              View Repo
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCardEnhanced;
