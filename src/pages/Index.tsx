import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProjectCardEnhanced from "@/components/ProjectCardEnhanced";
import FilterBar from "@/components/FilterBar";
import DailyDigest from "@/components/DailyDigest";
import TrendingAlert from "@/components/TrendingAlert";
import PersonalAPI from "@/components/PersonalAPI";
import SmartFilters from "@/components/SmartFilters";
import SignupTeaser from "@/components/SignupTeaser";
import SponsorBanner from "@/components/SponsorBanner";
import { categories } from "@/data/projects";
import { Github, TrendingUp, Calendar } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { projects, loading, error, toggleFavorite } = useProjects(activeCategory);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full mb-8 hover-lift">
            <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold gradient-text">Today's Top Picks</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold font-mono mb-8 leading-tight">
            Discover <span className="gradient-text">Today's</span>
            <br />
            <span className="text-glow">Trending Open Source</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Daily curated collections of the most innovative and useful GitHub repositories
            across AI, web development, DevOps, security, and more.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="glass px-6 py-3 rounded-full flex items-center gap-2 hover-lift">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">Updated Daily</span>
            </div>
            <div className="glass px-6 py-3 rounded-full flex items-center gap-2 hover-lift">
              <Github className="h-4 w-4 text-primary" />
              <span className="font-medium">{projects.length}+ Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Features for Signed-in Users */}
      {user ? (
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <TrendingAlert />
            <SmartFilters />
            <PersonalAPI />
            <DailyDigest />
          </div>
        </section>
      ) : (
        <section className="container mx-auto px-4 py-8 space-y-6">
          <SponsorBanner />
          <SignupTeaser />
        </section>
      )}

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-10">
          {/* Filter Bar */}
          <div className="animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold font-mono mb-6 text-center">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-up"
                  >
                    <ProjectCardEnhanced {...project} onToggleFavorite={toggleFavorite} />
                  </div>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="text-center py-12">
                  {error ? (
                    <div className="space-y-4">
                      <p className="text-red-500 text-lg font-medium">
                        ⚠️ Connection Issue
                      </p>
                      <p className="text-muted-foreground">
                        {error}
                      </p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-lg">
                      No projects found in this category yet. Check back soon!
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 mt-20">
        <div className="container mx-auto text-center text-sm text-muted-foreground space-y-3">
          <p>© 2025 GitDaily.</p>
          <p>
            Created by <strong className="text-primary">Syed Khaja Moinuddin</strong> (
            <a 
              href="https://github.com/S-YED" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @S-YED
            </a>
            )
          </p>
          <p className="text-xs">
            Built with React, TypeScript, and Tailwind CSS • 
            <a 
              href="https://github.com/sponsors/S-YED" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
            >
              💖 Sponsor this project
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
