import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Code, Star, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SmartFilters = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    minStars: [1000],
    language: 'all',
    daysOld: [7],
    category: 'all'
  });
  const [filteredCount, setFilteredCount] = useState(0);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchLanguages();
      applyFilters();
    }
  }, [user, filters]);

  const fetchLanguages = async () => {
    const { data } = await supabase
      .from('projects')
      .select('language')
      .not('language', 'is', null);
    
    if (data) {
      const uniqueLanguages = [...new Set(data.map(p => p.language))].filter(Boolean);
      setLanguages(uniqueLanguages.slice(0, 10)); // Top 10 languages
    }
  };

  const applyFilters = async () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - filters.daysOld[0]);

    let query = supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .gte('stars', filters.minStars[0])
      .gte('created_at', daysAgo.toISOString());

    if (filters.language !== 'all') {
      query = query.eq('language', filters.language);
    }

    if (filters.category !== 'all') {
      query = query.eq('category', filters.category as any);
    }

    const { count } = await query;
    setFilteredCount(count || 0);
  };

  const resetFilters = () => {
    setFilters({
      minStars: [1000],
      language: 'all',
      daysOld: [7],
      category: 'all'
    });
  };

  if (!user) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Filter className="h-5 w-5" />
          Smart Filters
          <Badge variant="outline" className="border-blue-400 text-blue-400 ml-auto">
            {filteredCount} results
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              Minimum Stars: {filters.minStars[0].toLocaleString()}
            </div>
            <Slider
              value={filters.minStars}
              onValueChange={(value) => setFilters(prev => ({ ...prev, minStars: value }))}
              max={50000}
              min={100}
              step={500}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-green-500" />
              Created within: {filters.daysOld[0]} days
            </div>
            <Slider
              value={filters.daysOld}
              onValueChange={(value) => setFilters(prev => ({ ...prev, daysOld: value }))}
              max={365}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Code className="h-4 w-4 text-purple-500" />
                Language
              </div>
              <Select 
                value={filters.language} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4 text-orange-500" />
                Category
              </div>
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="WebDev">WebDev</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={resetFilters}
            className="border-blue-500 text-blue-400"
          >
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          SELECT * FROM projects WHERE stars {'>'}= {filters.minStars[0]} 
          {filters.language !== 'all' && ` AND language = '${filters.language}'`}
          {filters.category !== 'all' && ` AND category = '${filters.category}'`}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartFilters;