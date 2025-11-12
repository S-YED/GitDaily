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
    <Card className="group h-full bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-mono group-hover:text-primary transition-colors line-clamp-1">
              {repo_name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              {description || 'No description available'}
            </CardDescription>
          </div>
          
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => onToggleFavorite(id)}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  is_favorited ? 'fill-primary text-primary' : 'text-muted-foreground'
                }`}
              />
            </Button>
          )}
        </div>

        {ai_summary && (
          <div className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border border-border/50">
            <span className="text-xs text-primary font-semibold">AI Summary:</span>
            <p className="mt-1">{ai_summary}</p>
          </div>
        )}

        {why_trending && (
          <div className="flex items-start gap-2 text-xs bg-accent/10 p-2 rounded-md border border-accent/20">
            <span className="text-accent font-semibold">🔥</span>
            <span className="text-accent-foreground">{why_trending}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatNumber(stars)}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatNumber(forks)}</span>
          </div>
          {language && (
            <Badge variant="secondary" className="text-xs">
              {language}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          
          <Button
            asChild
            size="sm"
            variant="default"
            className="bg-primary hover:bg-primary/90"
          >
            <a href={repo_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Repo
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCardEnhanced;
