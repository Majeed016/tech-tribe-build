
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useProjectApplications } from "@/hooks/useProjectApplications";
import { User, Clock, Github, ExternalLink, Mail } from "lucide-react";

const ProjectApplications = () => {
  const { toast } = useToast();
  const { projectApplications, loading, updateApplicationStatus } = useProjectApplications();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    setProcessingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      toast({
        title: `Application ${status}`,
        description: `The application has been ${status} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error updating application",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openApplicationDetails = (application) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (projectApplications.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
        <p className="text-gray-500">You haven't received any applications for your projects yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Project Applications</h2>
        
        <div className="grid gap-4">
          {projectApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {application.applicant_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{application.applicant_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Applied for: {application.role}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Project: {application.projects?.title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Message:</p>
                  <p className="text-sm line-clamp-2">{application.message}</p>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(application.created_at).toLocaleDateString()}</span>
                  </div>
                  {application.github_profile && (
                    <div className="flex items-center space-x-1">
                      <Github className="h-3 w-3" />
                      <span>GitHub provided</span>
                    </div>
                  )}
                  {application.portfolio_link && (
                    <div className="flex items-center space-x-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>Portfolio provided</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between pt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openApplicationDetails(application)}
                >
                  View Details
                </Button>
                
                {application.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      disabled={processingId === application.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(application.id, 'approved')}
                      disabled={processingId === application.id}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the complete application from {selectedApplication?.applicant_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedApplication.applicant_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium">{selectedApplication.applicant_name}</h3>
                  <p className="text-muted-foreground">Applying for: {selectedApplication.role}</p>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    {selectedApplication.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Project</h4>
                <p>{selectedApplication.projects?.title}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Application Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedApplication.message}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedApplication.github_profile && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <Github className="h-4 w-4" />
                      <span>GitHub Profile</span>
                    </h4>
                    <a 
                      href={selectedApplication.github_profile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedApplication.github_profile}
                    </a>
                  </div>
                )}
                
                {selectedApplication.portfolio_link && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Portfolio/Resume</span>
                    </h4>
                    <a 
                      href={selectedApplication.portfolio_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedApplication.portfolio_link}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Applied on: {new Date(selectedApplication.created_at).toLocaleString()}</p>
                {selectedApplication.updated_at !== selectedApplication.created_at && (
                  <p>Last updated: {new Date(selectedApplication.updated_at).toLocaleString()}</p>
                )}
              </div>
              
              {selectedApplication.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusUpdate(selectedApplication.id, 'rejected');
                      setIsDetailModalOpen(false);
                    }}
                    disabled={processingId === selectedApplication.id}
                    className="text-red-600 hover:text-red-700"
                  >
                    Reject Application
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication.id, 'approved');
                      setIsDetailModalOpen(false);
                    }}
                    disabled={processingId === selectedApplication.id}
                  >
                    Approve Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectApplications;
