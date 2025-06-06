
import { useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { useProjects } from "@/hooks/useProjects";

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const { projects, loading } = useProjects();

  // Show first 6 projects as featured
  const featuredProjects = projects.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading featured projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing projects from talented students across universities. 
            Find the perfect match for your skills and interests.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              id={project.id}
              title={project.title}
              description={project.description}
              author={{
                name: project.author_name,
                role: project.author_role || "Student",
                avatar: ""
              }}
              skills={project.skills}
              rolesNeeded={project.roles_needed}
              duration={project.duration}
              teamSize={project.team_size}
              applicants={0} // Will be calculated from applications table
            />
          ))}
        </div>
        
        {featuredProjects.length === 0 && !loading && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No projects available yet.</p>
            <button 
              onClick={() => navigate("/post-project")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            >
              Post the First Project
            </button>
          </div>
        )}
        
        {featuredProjects.length > 0 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate("/projects")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            >
              View All Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
