
import ProjectCard from "./ProjectCard";

const FeaturedProjects = () => {
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
    },
    {
      title: "Mental Health Chatbot",
      description: "Developing an AI chatbot to provide mental health support and resources for college students, with crisis intervention features.",
      author: {
        name: "Emma Thompson",
        role: "Psychology Major",
        avatar: ""
      },
      skills: ["Python", "NLP", "React", "Docker"],
      rolesNeeded: ["AI Developer", "Frontend Developer"],
      duration: "4 months",
      teamSize: 3,
      applicants: 20
    },
    {
      title: "Blockchain Voting System",
      description: "Building a secure, transparent voting system for student government elections using blockchain technology.",
      author: {
        name: "David Park",
        role: "Computer Engineering",
        avatar: ""
      },
      skills: ["Solidity", "Web3.js", "React", "Ethereum"],
      rolesNeeded: ["Blockchain Developer", "Security Expert"],
      duration: "5 months",
      teamSize: 4,
      applicants: 6
    },
    {
      title: "Smart IoT Dorm System",
      description: "Creating an IoT system to automate dorm room lighting, temperature, and security with mobile app control.",
      author: {
        name: "Lisa Wang",
        role: "Electrical Engineering",
        avatar: ""
      },
      skills: ["Arduino", "React Native", "IoT", "Firebase"],
      rolesNeeded: ["IoT Developer", "Mobile Developer", "Hardware Engineer"],
      duration: "3 months",
      teamSize: 4,
      applicants: 10
    }
  ];

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
          {sampleProjects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
