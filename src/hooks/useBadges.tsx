import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBadges = () => {
  const checkAndAwardBadges = async (userId: string) => {
    try {
      // Get user stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('visits, streak')
        .eq('id', userId)
        .single();

      const { count: submissionsCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const { count: approvedCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'approved');

      if (!profile) return;

      const badgeChecks = [
        { name: 'First Submit', condition: (submissionsCount || 0) >= 1 },
        { name: 'Top Curator', condition: (approvedCount || 0) >= 5 },
        { name: 'Week Streak', condition: profile.streak >= 7 },
        { name: 'Month Streak', condition: profile.streak >= 30 }
      ];

      for (const check of badgeChecks) {
        if (check.condition) {
          await awardBadge(userId, check.name);
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const awardBadge = async (userId: string, badgeName: string) => {
    try {
      const { data: badge } = await supabase
        .from('badges')
        .select('id')
        .eq('name', badgeName)
        .single();

      if (!badge) return;

      const { data: existing } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .single();

      if (!existing) {
        await supabase
          .from('user_badges')
          .insert({ user_id: userId, badge_id: badge.id });
        
        toast.success(`🎉 Badge earned: ${badgeName}!`);
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  return { checkAndAwardBadges, awardBadge };
};