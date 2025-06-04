
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, ArrowLeft, Search } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const sampleProjects = [
    {
      title: "AI-Powered Study Buddy App",
      description: "Building a mobile app that uses machine learning to create personalized study schedules and quiz students on their weak areas.",
      author: {
        name: "Sarah Chen",
        role: "CS Major",
        avatar: ""
      },
      skills: ["React Native", "Python", "TensorFlow", "Node.js"],
      rolesNeeded: ["Mobile Developer", "ML Engineer"],
      duration: "3 months",
      teamSize: 4,
      applicants: 12
    },
    {
      title: "Blockchain Voting System",
      description: "A secure and transparent voting system built on blockchain technology for campus elections and decision-making.",
      author: {
        name: "Alex Rodriguez",
        role: "Computer Science",
        avatar: ""
      },
      skills: ["Blockchain", "Solidity", "React", "Web3"],
      rolesNeeded: ["Blockchain Developer", "Frontend Developer"],
      duration: "4 months",
      teamSize: 5,
      applicants: 18
    },
    {
      title: "Sustainable Campus Marketplace",
      description: "A web platform for students to buy, sell, and trade textbooks, furniture, and other campus essentials sustainably.",
      author: {
        name: "Mike Rodriguez",
        role: "Business Major",
        avatar: ""
      },
      skills: ["React", "Django", "PostgreSQL", "Stripe API"],
      rolesNeeded: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
      duration: "4 months",
      teamSize: 5,
      applicants: 8
    },
    {
      title: "Virtual Reality Campus Tour",
      description: "Creating an immersive VR experience for prospective students to explore college campuses from anywhere in the world.",
      author: {
        name: "Alex Kim",
        role: "Game Design Major",
        avatar: ""
      },
      skills: ["Unity", "C#", "Blender", "VR Development"],
      rolesNeeded: ["VR Developer", "3D Artist", "Sound Designer"],
      duration: "6 months",
      teamSize: 6,
      applicants: 15
    }
  ];

  const filteredProjects = sampleProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBack = () => {
    // Check if user came from dashboard, otherwise go to home
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

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
              {isAuthenticated ? (
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
          {filteredProjects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
