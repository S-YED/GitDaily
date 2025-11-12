import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/projects";

const Submit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    repoName: "",
    repoUrl: "",
    category: "",
    description: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to submit projects');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          repo_url: formData.repoUrl,
          repo_name: formData.repoName,
          category: formData.category as any,
          description: formData.description,
          reason: formData.reason,
        });

      if (error) throw error;

      toast.success("Project submitted successfully! We'll review it soon.");
      setFormData({ repoName: "", repoUrl: "", category: "", description: "", reason: "" });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold font-mono">
              Submit a <span className="text-primary">Project</span>
            </h1>
            <p className="text-muted-foreground">
              Share an awesome open source project for tomorrow's picks
            </p>
          </div>

          <Card className="p-8 bg-gradient-card border-border shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="repoName">Repository Name *</Label>
                <Input
                  id="repoName"
                  placeholder="owner/repository"
                  value={formData.repoName}
                  onChange={(e) => setFormData({ ...formData, repoName: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repoUrl">GitHub URL *</Label>
                <Input
                  id="repoUrl"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What makes this project awesome?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="bg-background resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why is it trending?</Label>
                <Textarea
                  id="reason"
                  placeholder="Recent updates, viral thread, new release, etc."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="bg-background resize-none"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Submitting...' : 'Submit Project'}
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-muted/50 border-border">
            <h3 className="font-semibold mb-2">Submission Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Project must be open source and publicly accessible</li>
              <li>• Active development with recent commits preferred</li>
              <li>• Clear documentation and README required</li>
              <li>• Should solve a real problem or provide unique value</li>
              <li>• Reviewed daily for inclusion in tomorrow's picks</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Submit;
