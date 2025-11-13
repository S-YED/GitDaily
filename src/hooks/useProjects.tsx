import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useBadges } from './useBadges';
import { toast } from 'sonner';

export interface Project {
  id: string;
  repo_name: string;
  repo_url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[] | null;
  category: string;
  ai_summary: string | null;
  why_trending: string | null;
  demo_url: string | null;
  featured_date: string;
  is_favorited?: boolean;
}

export const useProjects = (category: string = 'All') => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Initialize with sample data immediately
  useEffect(() => {
    const filteredSamples = category === 'All' 
      ? sampleProjects 
      : sampleProjects.filter(p => p.category === category);
    setProjects(filteredSamples);
  }, [category]);

  // Sample data as fallback
  const sampleProjects: Project[] = [
    {
      id: "1",
      repo_name: "ESPectre",
      repo_url: "https://github.com/example/espectre",
      description: "A powerful ESP32-based network analysis and security testing tool with Wi-Fi capabilities",
      language: "C++",
      stars: 3200,
      forks: 450,
      topics: ["security", "esp32", "wifi"],
      category: "Security",
      ai_summary: null,
      why_trending: "Featured in security conferences this week",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "2",
      repo_name: "Myna",
      repo_url: "https://github.com/example/myna",
      description: "Modern AI-powered code completion and refactoring assistant for developers",
      language: "Python",
      stars: 15400,
      forks: 1200,
      topics: ["ai", "code-completion", "developer-tools"],
      category: "AI",
      ai_summary: null,
      why_trending: "Major update with GPT-4 integration",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "3",
      repo_name: "ReactFlow Designer",
      repo_url: "https://github.com/example/reactflow-designer",
      description: "Visual workflow designer and automation builder for React applications",
      language: "TypeScript",
      stars: 18700,
      forks: 1500,
      topics: ["react", "workflow", "visual-programming"],
      category: "WebDev",
      ai_summary: null,
      why_trending: "New drag-and-drop features released",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "4",
      repo_name: "DockerSwarm Manager",
      repo_url: "https://github.com/example/docker-swarm-manager",
      description: "Simplified Docker Swarm orchestration with web UI and monitoring",
      language: "Go",
      stars: 8900,
      forks: 650,
      topics: ["docker", "devops", "orchestration"],
      category: "DevOps",
      ai_summary: null,
      why_trending: "Kubernetes alternative gaining traction",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "5",
      repo_name: "Flutter Animations",
      repo_url: "https://github.com/example/flutter-animations",
      description: "Beautiful pre-built animations and transitions for Flutter apps",
      language: "Dart",
      stars: 12300,
      forks: 890,
      topics: ["flutter", "animations", "mobile"],
      category: "Mobile",
      ai_summary: null,
      why_trending: "New Material 3 animations added",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "6",
      repo_name: "Blockchain Validator",
      repo_url: "https://github.com/example/blockchain-validator",
      description: "Multi-chain blockchain transaction validator and analyzer",
      language: "Rust",
      stars: 5600,
      forks: 320,
      topics: ["blockchain", "crypto", "validation"],
      category: "Blockchain",
      ai_summary: null,
      why_trending: "Supports 15+ blockchain networks",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "7",
      repo_name: "Neural Style Transfer",
      repo_url: "https://github.com/example/neural-style-transfer",
      description: "Real-time neural style transfer for images and videos using PyTorch",
      language: "Python",
      stars: 22100,
      forks: 2800,
      topics: ["ai", "neural-networks", "computer-vision"],
      category: "AI",
      ai_summary: null,
      why_trending: "GPU optimization breakthrough",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "8",
      repo_name: "Vue3 Component Library",
      repo_url: "https://github.com/example/vue3-components",
      description: "Modern Vue 3 component library with TypeScript and Composition API",
      language: "Vue",
      stars: 9800,
      forks: 720,
      topics: ["vue", "components", "typescript"],
      category: "WebDev",
      ai_summary: null,
      why_trending: "Vue 3.4 compatibility update",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "9",
      repo_name: "Kubernetes Security Scanner",
      repo_url: "https://github.com/example/k8s-security-scanner",
      description: "Comprehensive security scanner for Kubernetes clusters and workloads",
      language: "Go",
      stars: 7400,
      forks: 580,
      topics: ["kubernetes", "security", "scanning"],
      category: "Security",
      ai_summary: null,
      why_trending: "CVE detection improvements",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "10",
      repo_name: "React Native Navigation",
      repo_url: "https://github.com/example/rn-navigation",
      description: "Smooth and performant navigation library for React Native apps",
      language: "JavaScript",
      stars: 16200,
      forks: 1400,
      topics: ["react-native", "navigation", "mobile"],
      category: "Mobile",
      ai_summary: null,
      why_trending: "iOS 17 and Android 14 support",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "11",
      repo_name: "Terraform AWS Modules",
      repo_url: "https://github.com/example/terraform-aws-modules",
      description: "Production-ready Terraform modules for AWS infrastructure",
      language: "HCL",
      stars: 11500,
      forks: 980,
      topics: ["terraform", "aws", "infrastructure"],
      category: "DevOps",
      ai_summary: null,
      why_trending: "New EKS and RDS modules",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    },
    {
      id: "12",
      repo_name: "DeFi Protocol SDK",
      repo_url: "https://github.com/example/defi-protocol-sdk",
      description: "TypeScript SDK for interacting with major DeFi protocols",
      language: "TypeScript",
      stars: 4200,
      forks: 280,
      topics: ["defi", "ethereum", "sdk"],
      category: "Blockchain",
      ai_summary: null,
      why_trending: "Uniswap V4 integration",
      demo_url: null,
      featured_date: new Date().toISOString().split('T')[0]
    }
  ];

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    // Always start with sample data as fallback
    const filteredSamples = category === 'All' 
      ? sampleProjects 
      : sampleProjects.filter(p => p.category === category);
    
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('featured_date', { ascending: false })
        .order('stars', { ascending: false });

      if (category !== 'All') {
        query = query.eq('category', category as any);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        console.log('Using sample data as fallback');
        setProjects(filteredSamples);
      } else {
        // If user is logged in, check which projects are favorited
        if (user) {
          const { data: favorites } = await supabase
            .from('favorites')
            .select('project_id')
            .eq('user_id', user.id);

          const favoritedIds = new Set(favorites?.map(f => f.project_id) || []);
          
          setProjects(
            data.map(p => ({
              ...p,
              is_favorited: favoritedIds.has(p.id)
            }))
          );
        } else {
          setProjects(data);
        }
      }
    } catch (err) {
      console.log('Network error, using sample data:', err);
      setProjects(filteredSamples);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [category, user]);

  const toggleFavorite = async (projectId: string) => {
    if (!user) {
      toast.error('Please sign in to favorite projects');
      return;
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      if (project.is_favorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', projectId);

        if (error) throw error;

        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, is_favorited: false } : p
        ));
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, project_id: projectId });

        if (error) throw error;

        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, is_favorited: true } : p
        ));
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error('Failed to update favorites. Please try again.');
    }
  };

  return { projects, loading, error, toggleFavorite, refetch: fetchProjects };
};
