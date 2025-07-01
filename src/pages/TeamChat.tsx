
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useProjectApplications } from "@/hooks/useProjectApplications";

const TeamChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading, sendMessage } = useMessages(projectId);
  const { projects } = useProjects();
  const { projectApplications } = useProjectApplications();
  
  const project = projects.find(p => p.id === projectId);
  const projectTitle = project ? project.title : projectId ? `Project ${projectId}` : "General Chat";

  // Get approved team members for this project
  const approvedMembers = projectApplications.filter(app => 
    app.project_id === projectId && app.status === 'approved'
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to send messages.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendMessage(message.trim());
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">Please log in to access team chat.</p>
            <Button onClick={() => navigate("/login")}>
              Log In
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
                <CardDescription>
                  {projectId ? "Project team members" : "General chat users"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {project.author_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium">{project.author_name}</span>
                        <div className="text-xs text-muted-foreground">Project Owner</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Show approved team members */}
                  {approvedMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.applicant_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium">{member.applicant_name}</span>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show current user if they're not the owner */}
                  {project && user?.id !== project.author_id && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || 'Y'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium">
                          {user.user_metadata?.full_name || user.email} (You)
                        </span>
                        <div className="text-xs text-muted-foreground">Team Member</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Team Discussion</CardTitle>
                <CardDescription>Real-time collaboration space for {projectTitle}</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {msg.user_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{msg.user_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {!projectId && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project-Specific Chat</CardTitle>
                  <CardDescription>
                    To access project-specific team chats, navigate to your posted projects 
                    in the Dashboard and click the "Team Chat" button for each project.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeamChat;
