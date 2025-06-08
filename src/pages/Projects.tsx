import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, ArrowLeft, Search } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { projects, loading } = useProjects();

  console.log('Projects data:', projects);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBack = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CollabChain
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {user ? (
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Projects</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, skills, or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            console.log('Rendering project:', project.id, project.title);
            return (
              <ProjectCard 
                key={project.id} 
                id={project.id} // Ensure this is passed as a string
                title={project.title}
                description={project.description}
                author={{
                  name: project.author_name,
                  role: project.author_role || "Student",
                  avatar: ""
                }}
                skills={project.skills || []}
                rolesNeeded={project.roles_needed || []}
                duration={project.duration}
                teamSize={project.team_size}
                applicants={0} // Will be calculated from applications table
              />
            );
          })}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
