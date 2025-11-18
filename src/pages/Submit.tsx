import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBadges } from '@/hooks/useBadges';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const Submit = () => {
  const { user } = useAuth();
  const { checkAndAwardBadges } = useBadges();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    repo_url: '',
    repo_name: '',
    category: '',
    description: '',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to submit projects');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('submissions')
        .insert([{
          user_id: user.id,
          repo_url: formData.repo_url,
          repo_name: formData.repo_name,
          category: formData.category as any,
          description: formData.description,
          reason: formData.reason
        }]);

      if (error) throw error;

      toast.success('Project submitted successfully!');
      await checkAndAwardBadges(user.id);
      navigate('/profile');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p>Please sign in to submit projects.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Send className="h-5 w-5" />
              Submit Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Repository URL</label>
                <Input
                  required
                  placeholder="https://github.com/user/repo"
                  value={formData.repo_url}
                  onChange={(e) => setFormData({...formData, repo_url: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Repository Name</label>
                <Input
                  required
                  placeholder="awesome-project"
                  value={formData.repo_name}
                  onChange={(e) => setFormData({...formData, repo_name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="WebDev">WebDev</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Brief description of the project..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Why is this trending?</label>
                <Textarea
                  required
                  placeholder="Explain why this project should be featured..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Project'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submit;