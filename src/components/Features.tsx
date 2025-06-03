
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, User, Code2 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Code2,
      title: "Post Your Project",
      description: "Share your innovative ideas and find the perfect team members to bring them to life.",
      badge: "Create"
    },
    {
      icon: Search,
      title: "Discover Projects",
      description: "Browse through hundreds of exciting projects and find the ones that match your skills and interests.",
      badge: "Explore"
    },
    {
      icon: Users,
      title: "Build Your Team",
      description: "Connect with talented students from different disciplines and create diverse, skilled teams.",
      badge: "Collaborate"
    },
    {
      icon: User,
      title: "Showcase Your Profile",
      description: "Display your skills, projects, and experience to attract the right collaborators and opportunities.",
      badge: "Grow"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How CollabChain Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple steps to connect with like-minded students and build amazing projects together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="mx-auto mb-2 w-fit">
                  {feature.badge}
                </Badge>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
