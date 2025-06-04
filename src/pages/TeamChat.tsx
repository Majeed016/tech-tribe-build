
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
}

const TeamChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Sarah Chen",
      message: "Welcome to the team! Let's discuss our project milestones.",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      user: "John Doe",
      message: "Great! I've started working on the frontend components.",
      timestamp: "10:35 AM"
    },
    {
      id: 3,
      user: "Alice Smith",
      message: "I'll handle the backend API integration. Should be ready by tomorrow.",
      timestamp: "10:40 AM"
    }
  ]);

  const projectTitle = projectId ? `Project ${projectId}` : "Team Chat";
  const teamMembers = ["Sarah Chen", "John Doe", "Alice Smith", "Mike Johnson"];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      user: localStorage.getItem("userName") || "You",
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been delivered to the team.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">{projectTitle} - Team Chat</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Team Members Sidebar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members
                </CardTitle>
                <CardDescription>{teamMembers.length} members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{member}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Team Discussion</CardTitle>
                <CardDescription>Real-time collaboration space</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {msg.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{msg.user}</span>
                          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Supabase Realtime Integration</CardTitle>
                <CardDescription>
                  This chat uses mock data. To enable real-time messaging, connect your project to Supabase 
                  and we'll set up Supabase Realtime for live collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Supabase Integration Required",
                    description: "Click the Supabase button in the top right to enable real-time features.",
                  });
                }}>
                  Enable Real-time Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamChat;
