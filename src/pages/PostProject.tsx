import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const PostProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleAddRole = () => {
    if (currentRole.trim() && !roles.includes(currentRole.trim())) {
      setRoles([...roles, currentRole.trim()]);
      setCurrentRole("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !duration.trim() || !teamSize.trim()) {
      toast({
        title: "Please fill all required fields",
        description: "Title, description, duration, and team size are required.",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally save to database
    toast({
      title: "Project posted successfully!",
      description: "Your project is now live and accepting applications.",
    });
    navigate("/dashboard");
  };

  const handleClearForm = () => {
    setTitle("");
    setDescription("");
    setDuration("");
    setTeamSize("");
    setSkills([]);
    setRoles([]);
    setCurrentSkill("");
    setCurrentRole("");
    
    toast({
      title: "Form cleared",
      description: "All fields have been reset.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold">Post a New Project</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleClearForm}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Form
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Share your project idea and find collaborators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your project title" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project idea, goals, and vision..."
                    className="min-h-[120px]"
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Project Duration</Label>
                    <Input 
                      id="duration" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 3 months" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input 
                      id="teamSize" 
                      type="number" 
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      placeholder="e.g., 5" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Skills</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Add a skill (e.g., React, Python)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" onClick={handleAddSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                        {skill}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Roles Needed</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      placeholder="Add a role (e.g., Frontend Developer)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                    />
                    <Button type="button" onClick={handleAddRole}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {roles.map((role, index) => (
                      <div key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                        {role}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setRoles(roles.filter((_, i) => i !== index))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Post Project
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PostProject;
