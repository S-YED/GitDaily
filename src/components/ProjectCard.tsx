import { ExternalLink, Star, GitFork, Code } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  category: string;
}

const ProjectCard = ({ name, description, stars, forks, language, url, category }: ProjectCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Card className="group p-6 bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg font-mono text-foreground group-hover:text-primary transition-colors truncate">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 bg-secondary/50">
            {category}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{formatNumber(stars)}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{formatNumber(forks)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>{language}</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
          onClick={() => window.open(url, "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on GitHub
        </Button>
      </div>
    </Card>
  );
};

export default ProjectCard;
