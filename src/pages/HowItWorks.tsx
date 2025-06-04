
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, MessageSquare, Trophy } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse Projects",
      description: "Discover exciting projects posted by fellow students and developers looking for collaborators."
    },
    {
      icon: Users,
      title: "Apply to Join",
      description: "Submit applications for roles that match your skills and interests with a personalized message."
    },
    {
      icon: MessageSquare,
      title: "Collaborate",
      description: "Work together using our integrated team chat and project management tools."
    },
    {
      icon: Trophy,
      title: "Build Together",
      description: "Create amazing projects while learning from peers and building your portfolio."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">How CollabChain Works</h1>
            <p className="text-xl text-muted-foreground">
              Connect, collaborate, and create amazing projects together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Ready to Get Started?</CardTitle>
                <CardDescription>
                  Join our community of creators and start building amazing projects today.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 justify-center">
                  <a href="/signup" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors">
                    Sign Up Now
                  </a>
                  <a href="/projects" className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Browse Projects
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
