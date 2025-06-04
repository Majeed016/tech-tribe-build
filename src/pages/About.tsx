
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Heart, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About CollabChain</h1>
            <p className="text-xl text-muted-foreground">
              Connecting passionate developers and creators worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <Code2 className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  To bridge the gap between idea and execution by connecting talented individuals 
                  who want to build amazing projects together.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A world where anyone with a great idea can find the right collaborators 
                  to bring their vision to life.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We believe in the power of collaboration and community-driven development 
                  to create innovative solutions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fostering creativity and innovation by providing tools and platforms 
                  for seamless collaboration.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Why CollabChain?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In today's interconnected world, the best projects are built by diverse teams 
                with complementary skills. CollabChain makes it easy to find your perfect 
                project partners, whether you're a designer, developer, marketer, or visionary.
              </p>
              <p>
                Our platform provides everything you need to successfully collaborate: 
                project discovery, team formation, communication tools, and project management features.
              </p>
              <p>
                Join thousands of creators who are already building the future together on CollabChain.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
