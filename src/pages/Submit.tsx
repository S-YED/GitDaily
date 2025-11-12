import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send } from "lucide-react";

const Submit = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectUrl: "",
    description: "",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Project submitted successfully! We'll review it soon.");
    setFormData({ projectName: "", projectUrl: "", description: "", category: "" });
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
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="awesome-project"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectUrl">GitHub URL</Label>
                <Input
                  id="projectUrl"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="AI, Web, DevTools, etc."
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us why this project is awesome..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  className="bg-background resize-none"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Submit Project
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
