
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, LogOut, Plus, User, Search, MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userName = localStorage.getItem("userName") || "User";

  // Mock data for user's applications
  const userApplications = [
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

  // Mock data for user's posted projects
  const userProjects = [
    {
      id: 1,
      title: "E-commerce Platform Redesign",
      applicants: 12,
      status: "active",
      createdDate: "2024-01-20"
    },
    {
      id: 2,
      title: "Mobile Fitness Tracker",
      applicants: 8,
      status: "active", 
      createdDate: "2024-01-18"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate("/");
  };

  const handleDeleteProject = (projectId: number, projectTitle: string) => {
    toast({
      title: "Project deleted",
      description: `"${projectTitle}" has been removed successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CollabChain
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate("/projects")}>
                Browse Projects
              </Button>
              <Button variant="ghost" onClick={() => navigate("/team-chat")}>
                Team Chat
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">Welcome, {userName}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/projects")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Browse Projects
              </CardTitle>
              <CardDescription>Discover exciting projects to join</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/post-project")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Post Project
              </CardTitle>
              <CardDescription>Share your project idea with others</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/profile")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                My Profile
              </CardTitle>
              <CardDescription>Manage your profile and applications</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Applications */}
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track your project applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userApplications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-1">{app.projectTitle}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{app.role}</p>
                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(app.status)}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{app.appliedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Posted Projects */}
          <Card>
            <CardHeader>
              <CardTitle>My Posted Projects</CardTitle>
              <CardDescription>Manage your project listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{project.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id, project.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{project.applicants} applicants</span>
                      <span>{project.createdDate}</span>
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/team-chat?project=${project.id}`)}
                        className="mr-2"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Team Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
