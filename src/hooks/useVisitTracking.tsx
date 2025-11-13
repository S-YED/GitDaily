import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useVisitTracking = () => {
  const { user } = useAuth();

  const updateVisitAndStreak = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('visits, streak, last_visited')
      .eq('id', user.id)
      .single();

    if (!profile) return;

    const lastVisited = profile.last_visited ? new Date(profile.last_visited).toISOString().split('T')[0] : null;
    
    // Don't update if already visited today
    if (lastVisited === today) return;

    let newStreak = profile.streak || 0;
    
    if (lastVisited) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastVisited === yesterdayStr) {
        newStreak += 1; // Continue streak
      } else {
        newStreak = 1; // Reset streak
      }
    } else {
      newStreak = 1; // First visit
    }

    await supabase
      .from('profiles')
      .update({
        visits: (profile.visits || 0) + 1,
        streak: newStreak,
        last_visited: new Date().toISOString()
      })
      .eq('id', user.id);

    // Check for badge awards
    await checkAndAwardBadges(user.id, profile.visits + 1, newStreak);
  };

  const checkAndAwardBadges = async (userId: string, visits: number, streak: number) => {
    const badgesToCheck = [
      { name: 'Week Streak', criteria: { streak: 7 }, currentStreak: streak },
      { name: 'Month Streak', criteria: { streak: 30 }, currentStreak: streak }
    ];

    for (const badge of badgesToCheck) {
      if (streak >= badge.criteria.streak) {
        // Check if user already has this badge
        const { data: existingBadge } = await supabase
          .from('user_badges')
          .select('id')
          .eq('user_id', userId)
          .eq('badge_id', (await supabase.from('badges').select('id').eq('name', badge.name).single())?.data?.id)
          .single();

        if (!existingBadge) {
          const { data: badgeData } = await supabase
            .from('badges')
            .select('id')
            .eq('name', badge.name)
            .single();

          if (badgeData) {
            await supabase
              .from('user_badges')
              .insert({ user_id: userId, badge_id: badgeData.id });
          }
        }
      }
    }
  };

  useEffect(() => {
    if (user) {
      updateVisitAndStreak();
    }
  }, [user]);

  return { updateVisitAndStreak };
};