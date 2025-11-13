import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Terminal, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PersonalAPI = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      generateApiKey();
      fetchFavorites();
    }
  }, [user]);

  const generateApiKey = () => {
    // Generate a simple API key based on user ID
    const key = `gd_${user?.id?.slice(0, 8)}_${Date.now().toString(36)}`;
    setApiKey(key);
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('favorites')
      .select(`
        projects (
          repo_name,
          repo_url,
          stars,
          language,
          category
        )
      `)
      .eq('user_id', user.id)
      .limit(5);

    if (data) {
      setFavorites(data.map(f => f.projects).filter(Boolean));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchFavorites();
    setLoading(false);
    toast.success('Data refreshed!');
  };

  if (!user) return null;

  const curlCommand = `curl -H "Authorization: Bearer ${apiKey}" \\
  https://gitdaily.dev/api/v1/favorites`;

  const jsonResponse = JSON.stringify({
    favorites: favorites.slice(0, 2).map(f => ({
      name: f.repo_name,
      url: f.repo_url,
      stars: f.stars,
      language: f.language,
      category: f.category
    }))
  }, null, 2);

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400 font-mono">
          <Terminal className="h-5 w-5" />
          Personal API
          <Badge variant="outline" className="border-green-400 text-green-400">
            REST
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Key className="h-4 w-4" />
            API Key
          </div>
          <div className="flex gap-2">
            <Input 
              value={apiKey} 
              readOnly 
              className="font-mono text-xs bg-slate-800 border-slate-600"
            />
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard(apiKey)}
              className="border-slate-600"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Your Favorites API</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={refreshData}
              disabled={loading}
              className="text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
              {curlCommand}
            </pre>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm text-slate-300">Response</span>
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-700 max-h-40 overflow-y-auto">
            <pre className="text-xs text-blue-400 font-mono">
              {jsonResponse}
            </pre>
          </div>
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <div>• GET /api/v1/favorites - Your starred repos</div>
          <div>• GET /api/v1/trending - Personalized trending</div>
          <div>• POST /api/v1/webhooks - Real-time notifications</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalAPI;