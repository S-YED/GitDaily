import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth-hook';
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

<<<<<<< HEAD
export const useProjects = (category: string = 'All') => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFeaturedDate, setActiveFeaturedDate] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching projects from Supabase...');
      console.log('📍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🏷️ Category filter:', category);
      
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('projects')
        .select('count', { count: 'exact', head: true });
      
      if (testError) {
        console.error('❌ Connection test failed:', testError);
        setError(`Connection failed: ${testError.message}`);
        setProjects([]);
        setLoading(false);
        return;
      }
      
      console.log('✅ Connection successful, total projects:', testData);
      
      const todayUtc = new Date().toISOString().split('T')[0];
      console.log('📅 Today (UTC) is:', todayUtc);

      const buildQuery = (date: string) =>
        supabase
          .from('projects')
          .select('*')
          .eq('featured_date', date)
          .order('featured_date', { ascending: false })
          .order('stars', { ascending: false });

      // Always prefer whatever date is newest in the DB.
      // This avoids timezone confusion (UI) and "successful" runs that actually wrote to a different day.
      const { data: latestDateRows, error: latestDateError } = await supabase
        .from('projects')
        .select('featured_date')
        .order('featured_date', { ascending: false })
        .limit(1);

      const targetDate = latestDateError
        ? todayUtc
        : (latestDateRows?.[0]?.featured_date || todayUtc);

      setActiveFeaturedDate(targetDate);
      console.log('🗓️ Using featured_date:', targetDate);

      let query = buildQuery(targetDate);
      if (category !== 'All') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Query error:', error);
        setError(`Query failed: ${error.message}`);
        setProjects([]);
      } else {
        console.log(`📦 Found ${data?.length || 0} projects for category: ${category}`);
        console.log('📋 Projects data:', data);
        
        if (data && data.length > 0) {
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
        } else {
          console.log('⚠️ No projects found in database');
          setProjects([]);
        }
      }
    } catch (err) {
      console.error('💥 Network error:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setProjects([]);
    }
    
    setLoading(false);
  }, [category, user, setLoading, setError, setProjects]);

  useEffect(() => {
    console.log('🔄 useProjects effect triggered for category:', category);
    fetchProjects();
  }, [category, user, fetchProjects]);
  
  // Debug log when projects change
  useEffect(() => {
    console.log('📊 Projects state updated:', projects.length, 'projects');
  }, [projects]);

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