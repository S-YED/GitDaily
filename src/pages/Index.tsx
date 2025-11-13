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
  const { projects, loading, toggleFavorite } = useProjects(activeCategory);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Today's Top Picks</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-mono mb-6">
            Discover <span className="text-primary">Today's</span>
            <br />
            Trending Open Source
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Daily curated collections of the most innovative and useful GitHub repositories
            across AI, web development, DevOps, security, and more.
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Updated Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-primary" />
              <span>{projects.length}+ Projects Today</span>
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
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Filter Bar */}
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold font-mono mb-4">
              Browse by <span className="text-primary">Category</span>
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
                  <p className="text-muted-foreground text-lg">
                    No projects found in this category yet. Check back soon!
                  </p>
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