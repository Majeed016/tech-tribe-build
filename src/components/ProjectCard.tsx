
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Clock, User, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ApplicationModal from "./ApplicationModal";
import ProjectDetailsModal from "./ProjectDetailsModal";
import { useAuth } from "@/hooks/useAuth";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  skills: string[];
  rolesNeeded: string[];
  duration: string;
  teamSize: number;
  applicants: number;
  created_at?: string;
}

const ProjectCard = ({ 
  id,
  title, 
  description, 
  author, 
  skills, 
  rolesNeeded, 
  duration, 
  teamSize, 
  applicants,
  created_at
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleApplyClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign up or log in to apply to projects.",
        variant: "destructive",
      });
      navigate("/signup");
      return;
    }
    
    console.log('Opening application modal for project ID:', id);
    setIsApplicationModalOpen(true);
  };

  const handleViewDetailsClick = () => {
    setIsDetailsModalOpen(true);
  };

  const projectData = {
    id,
    title,
    description,
    author,
    skills,
    rolesNeeded,
    duration,
    teamSize,
    applicants,
    created_at
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="text-xs">{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{author.name}</span> • {author.role}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Skills Required</div>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Looking For</div>
            <div className="flex flex-wrap gap-1">
              {rolesNeeded.slice(0, 2).map((role) => (
                <Badge key={role} variant="outline" className="text-xs px-2 py-0.5 border-blue-200 text-blue-700">
                  {role}
                </Badge>
              ))}
              {rolesNeeded.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{rolesNeeded.length - 2}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{teamSize} members</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{applicants} applied</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex gap-2">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={handleViewDetailsClick}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={handleApplyClick}
          >
            Apply to Join
          </Button>
        </CardFooter>
      </Card>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        project={projectData}
      />

      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        project={projectData}
      />
    </>
  );
};

export default ProjectCard;
