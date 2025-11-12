import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Github, Youtube, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold font-mono">
              About <span className="text-primary">GitHub Awesome</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Curating the best trending open source projects, one week at a time
            </p>
          </div>

          <Card className="p-8 bg-gradient-card border-border shadow-card">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-mono mb-4 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  GitHub Awesome is a community-driven platform dedicated to discovering and showcasing
                  the most innovative, useful, and trending open source projects from GitHub. Every week,
                  we curate a fresh collection of projects that deserve your attention—from cutting-edge
                  AI tools to powerful developer utilities.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-mono mb-4 flex items-center gap-2">
                  <Youtube className="h-6 w-6 text-primary" />
                  Inspired by the Community
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  This platform was created in response to community demand from viewers of the GitHub
                  Awesome YouTube channel. You asked for a centralized place to browse and explore these
                  amazing projects—so we built it!
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-mono mb-4">What We Do</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Curate trending GitHub repositories weekly across various categories</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Provide detailed insights including stars, forks, and language information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Accept community submissions for awesome projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Create an archive of past weeks for easy reference</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-mono mb-4 flex items-center gap-2">
                  <Github className="h-6 w-6 text-primary" />
                  Join the Community
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This project itself is open source! We welcome contributions, suggestions, and feedback
                  from the community. Help us make GitHub Awesome even better.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" className="bg-primary hover:bg-primary/90">
                    <Github className="h-4 w-4 mr-2" />
                    Contribute on GitHub
                  </Button>
                  <Button variant="outline" className="hover:border-primary hover:text-primary">
                    <Youtube className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/30 border-border text-center">
            <p className="text-sm text-muted-foreground">
              Made with <Heart className="inline h-4 w-4 text-primary animate-glow" /> by the open source community
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
