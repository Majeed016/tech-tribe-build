
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js"]);
  const [currentSkill, setCurrentSkill] = useState("");
  
  // Mock applications data
  const applications = [
    {
      id: 1,
      projectTitle: "AI-Powered Study Buddy App",
      role: "Frontend Developer",
      status: "pending",
      appliedDate: "2024-01-15"
    },
    {
      id: 2,
      projectTitle: "Blockchain Voting System",
      role: "Full Stack Developer",
      status: "accepted",
      appliedDate: "2024-01-10"
    },
    {
      id: 3,
      projectTitle: "Sustainable Campus Marketplace",
      role: "Backend Developer",
      status: "rejected",
      appliedDate: "2024-01-05"
    }
  ];

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your profile changes have been saved.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold">My Profile</h1>
            </div>
            <Button 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        defaultValue={localStorage.getItem("userName") || "John Doe"}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        defaultValue={localStorage.getItem("userEmail") || "john@example.com"}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role/Major</Label>
                    <Input 
                      id="role" 
                      defaultValue={localStorage.getItem("userRole") || "Computer Science Student"}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell others about yourself..."
                      disabled={!isEditing}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Profile</Label>
                    <Input 
                      id="github" 
                      placeholder="https://github.com/yourusername"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Skills</Label>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input 
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          placeholder="Add a skill"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        />
                        <Button type="button" onClick={handleAddSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                          {skill}
                          {isEditing && (
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>Track your project applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">{app.projectTitle}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{app.role}</p>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">{app.appliedDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
