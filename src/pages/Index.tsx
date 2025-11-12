import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import FilterBar from "@/components/FilterBar";
import { sampleProjects, categories } from "@/data/projects";
import { Github, TrendingUp, Calendar } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? sampleProjects
      : sampleProjects.filter((project) => project.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">This Week's Awesome Projects</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-mono mb-6">
            Discover <span className="text-primary">Trending</span>
            <br />
            Open Source Projects
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Curated weekly collections of the most innovative and useful GitHub repositories
            across AI, web development, DevOps, security, and more.
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Updated Weekly</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-primary" />
              <span>{sampleProjects.length}+ Projects</span>
            </div>
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up"
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No projects found in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 mt-20">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 GitHub Awesome. Open source community project.</p>
          <p className="mt-2">
            Built with React, TypeScript, and Tailwind CSS • Data from GitHub API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
