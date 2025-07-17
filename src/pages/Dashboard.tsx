
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Code2, Plus, Users, BookOpen, MessageSquare, FileText, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useApplications } from "@/hooks/useApplications";
import ProjectApplications from "@/components/ProjectApplications";
import TeamRating from "@/components/TeamRating";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProjects, loading: projectsLoading, deleteProject } = useProjects();
  const { userApplications, loading: applicationsLoading } = useApplications();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleRateTeammates = (project) => {
    setSelectedProject(project);
    setShowRatingModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CollabChain
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut} size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and applications</p>
        </div>

        <Tabs defaultValue="my-projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="my-projects" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <FileText className="h-4 w-4" />
              <span className="text-xs sm:text-sm">My Projects</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs sm:text-sm">My Applications</span>
            </TabsTrigger>
            <TabsTrigger value="applicants" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <Users className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Applicants</span>
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Browse</span>
            </TabsTrigger>
          </TabsList>

          {/* My Projects Tab */}
          <TabsContent value="my-projects" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold">My Projects</h2>
              <Button onClick={() => navigate("/post-project")} className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>

            {projectsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : userProjects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                  <p className="text-gray-500 mb-4">Create your first project to start collaborating with others.</p>
                  <Button onClick={() => navigate("/post-project")}>Create Project</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/team-chat?project=${project.id}`)}
                            className="flex items-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="hidden sm:inline">Team Chat</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRateTeammates(project)}
                            className="flex items-center gap-2"
                          >
                            <Star className="h-4 w-4" />
                            <span className="hidden sm:inline">Rate Team</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.skills?.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Duration: {project.duration}</p>
                        <p>Team Size: {project.team_size} members</p>
                        <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold">My Applications</h2>

            {applicationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : userApplications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-500 mb-4">Browse projects and apply to join interesting collaborations.</p>
                  <Button onClick={() => navigate("/projects")}>Browse Projects</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{application.projects?.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">Applied for: {application.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                          {application.status === 'approved' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/team-chat?project=${application.project_id}`)}
                                className="flex items-center gap-2"
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span className="hidden sm:inline">Join Team Chat</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRateTeammates({
                                  id: application.project_id,
                                  title: application.projects?.title
                                })}
                                className="flex items-center gap-2"
                              >
                                <Star className="h-4 w-4" />
                                <span className="hidden sm:inline">Rate Team</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{application.message}</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Applied: {new Date(application.created_at).toLocaleDateString()}</p>
                        {application.github_profile && (
                          <p>GitHub: <a href={application.github_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">View Profile</a></p>
                        )}
                        {application.portfolio_link && (
                          <p>Portfolio: <a href={application.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">View Portfolio</a></p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Applicants Tab */}
          <TabsContent value="applicants" className="space-y-6">
            <ProjectApplications />
          </TabsContent>

          {/* Browse Projects Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Browse Projects</h2>
              <Button onClick={() => navigate("/projects")} className="w-full sm:w-auto">
                View All Projects
              </Button>
            </div>
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">Discover amazing projects and find your next collaboration opportunity.</p>
                <Button onClick={() => navigate("/projects")}>Browse All Projects</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate Your Teammates</DialogTitle>
            <DialogDescription>
              Rate your teammates for the project "{selectedProject?.title}". Your feedback helps build trust in the community.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <TeamRating
              projectId={selectedProject.id}
              projectTitle={selectedProject.title}
              onClose={() => setShowRatingModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
