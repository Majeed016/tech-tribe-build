
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Calendar, User, Star } from "lucide-react";
import ApplicationModal from "./ApplicationModal";
import { useAuth } from "@/hooks/useAuth";

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
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
  };
}

const ProjectDetailsModal = ({ isOpen, onClose, project }: ProjectDetailsModalProps) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const { user } = useAuth();

  const handleApplyClick = () => {
    setIsApplicationModalOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            <DialogDescription>
              Complete project details and requirements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Project Author */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Project Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={project.author.avatar} />
                    <AvatarFallback className="text-lg">
                      {project.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{project.author.name}</h3>
                    <p className="text-muted-foreground">{project.author.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{project.duration}</p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-center">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{project.teamSize}</p>
                      <p className="text-sm text-muted-foreground">Team Size</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{project.applicants}</p>
                      <p className="text-sm text-muted-foreground">Applicants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Roles Needed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Looking For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.rolesNeeded.map((role) => (
                    <Badge key={role} variant="outline" className="px-3 py-1 border-blue-200 text-blue-700">
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Posted on {formatDate(project.created_at)}
                </p>
              </CardContent>
            </Card>

            {/* Apply Button */}
            {user && (
              <div className="flex justify-center pt-4">
                <Button 
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={handleApplyClick}
                >
                  Apply to Join This Project
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        project={project}
      />
    </>
  );
};

export default ProjectDetailsModal;
